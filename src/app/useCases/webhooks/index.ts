import { decryptSecret, encryptSecret } from '@/app/utils/encryptWebhookSecret';
import { generateSecret } from '@/app/utils/generateWebhookSecret';
import { db } from '@/infrastructure/database';
import { webhookTable } from '@/infrastructure/database/schema/webhook.schema';
import { webhookEventTable } from '@/infrastructure/database/schema/webhookEvent.schema';
import { eq, getTableColumns } from 'drizzle-orm';
import { type UUID } from 'node:crypto';

export type WebhookType = Pick<
  Partial<typeof webhookTable.$inferSelect>,
  'secretIv'
> &
  Omit<typeof webhookTable.$inferSelect, 'secretIv'>; // Making secretIv column optional so it can be removed from response
export type NewWebhookType = typeof webhookTable.$inferInsert;

export type WebhookEventType = typeof webhookEventTable.$inferSelect;

export class Webhook {
  public static async getAll(): Promise<
    Omit<WebhookType, 'secret' | 'secretIv'>[]
  > {
    const {
      secret: _secret,
      secretIv: _iv,
      ...columns
    } = getTableColumns(webhookTable);
    const result = await db.select(columns).from(webhookTable);

    return result;
  }

  public static async getAllFailedEvents(): Promise<WebhookEventType[]> {
    const result = await db
      .select()
      .from(webhookEventTable)
      .where(eq(webhookEventTable.status, 'failed'));

    return result;
  }

  public static async get(
    webhookId: UUID
  ): Promise<Omit<WebhookType, 'secretIv'> | undefined> {
    const result = (
      await db
        .select()
        .from(webhookTable)
        .where(eq(webhookTable.id, webhookId))
        .limit(1)
    ).at(0) as Pick<Partial<WebhookType>, 'secretIv'> &
      Omit<WebhookType, 'secretIv'>;

    if (result) {
      result.secret = decryptSecret(result?.secret!, result?.secretIv!);
      delete result.secretIv;
    }

    return result;
  }

  public static async retryEvent(
    eventId: UUID
  ): Promise<WebhookEventType | undefined> {
    const result = (
      await db
        .update(webhookEventTable)
        .set({
          retries: 0,
          status: 'pending',
          nextAttemptAt: new Date(),
        })
        .where(eq(webhookEventTable.id, eventId))
        .returning()
    ).at(0);

    return result;
  }

  public static async create(
    webhook: Omit<NewWebhookType, 'id' | 'secret' | 'secretIv'>
  ): Promise<Omit<WebhookType, 'secretIv'> | undefined> {
    const secret = await generateSecret();
    const { iv, encryptedSecret } = encryptSecret(secret);

    const result = (
      await db
        .insert(webhookTable)
        .values({
          ...webhook,
          id: undefined,
          secret: encryptedSecret,
          secretIv: iv,
        })
        .returning()
    ).at(0) as WebhookType;

    if (result) {
      result.secret = decryptSecret(result?.secret!, result?.secretIv!);
      delete result.secretIv;
    }

    return result;
  }

  public static async update(
    webhookId: UUID,
    webhook: Partial<Omit<NewWebhookType, 'id' | 'secret' | 'secretIv'>>
  ): Promise<WebhookType | undefined> {
    const {
      secret: _secret,
      secretIv: _iv,
      ...columns
    } = getTableColumns(webhookTable);

    const result = (
      await db
        .update(webhookTable)
        .set({
          ...webhook,
          id: undefined, // not allowed to update id, secret, or secretIv columns
          secret: undefined,
          secretIv: undefined,
        })
        .where(eq(webhookTable.id, webhookId))
        .returning(columns)
    ).at(0) as WebhookType;

    return result;
  }

  public static async delete(webhookId: UUID): Promise<UUID | undefined> {
    const result = (
      await db
        .delete(webhookTable)
        .where(eq(webhookTable.id, webhookId))
        .returning({ id: webhookTable.id })
    ).at(0);

    return result?.id as UUID | undefined;
  }
}
