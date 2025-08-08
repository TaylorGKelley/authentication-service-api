import { type UUID } from 'node:crypto';
import { eq, and, lte } from 'drizzle-orm';
import { db } from '@/infrastructure/database';
import { webhookEventTable } from '@/infrastructure/database/schema/webhookEvent.schema';
import { webhookTable } from '@/infrastructure/database/schema/webhook.schema';
import { generateSignature } from '../utils/generateWebhookSignature';
import { decryptSecret } from '../utils/encryptWebhookSecret';

const maxRetries = 5;

class UserCreatedWorker {
  constructor() {
    console.log('[Webhooks] User worker initialized');
    this.startUserCreatedWorker();
  }

  private startUserCreatedWorker() {
    setInterval(UserCreatedWorker.processWebhookEvents, 5000);
  }

  public static async createUserEvent(userId: UUID) {
    // Create event
    const event = (
      await db
        .insert(webhookEventTable)
        .values({
          eventType: 'user.created',
          payload: {
            id: userId,
          },
        })
        .returning()
    ).at(0);

    // Process event immediatly if possible
    UserCreatedWorker.processWebhookEvents(event!);
  }

  public static async processWebhookEvents(
    event: typeof webhookEventTable.$inferSelect
  ) {
    const events = !event
      ? await db
          .select()
          .from(webhookEventTable)
          .where(
            and(
              eq(webhookEventTable.status, 'pending'),
              lte(webhookEventTable.nextAttemptAt, new Date()),
              lte(webhookEventTable.retries, maxRetries)
            )
          )
          .limit(10)
      : [event]; // 10 events per batch or specific event

    for (const event of events) {
      const targets = await db
        .select({
          url: webhookTable.url,
          secret: webhookTable.secret,
          secretIv: webhookTable.secretIv,
        })
        .from(webhookTable)
        .where(
          and(
            eq(webhookTable.eventType, event.eventType),
            eq(webhookTable.enabled, true)
          )
        );

      for (const target of targets) {
        try {
          const res = await fetch(target.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-webhook-secret': decryptSecret(target.secret, target.secretIv),
              'x-webhook-signature': generateSignature(
                target.secret,
                event.payload
              ),
            },
            body: JSON.stringify(event.payload),
          });

          if (res.ok) {
            await db
              .update(webhookEventTable)
              .set({ status: 'delivered' })
              .where(eq(webhookEventTable.id, event.id));

            console.log(
              `[Webhooks - Sent] Sent user with id: ${event.payload.id}`
            );
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        } catch (err) {
          console.log(
            `[Webhooks - Error] Error sending to target: ${target.url}`
          );
          const retries = event.retries + 1;
          const backoff = Math.min(2 ** retries * 1000, 10 * 60 * 1000); // up to 10min delay
          const nextAttempt = new Date(Date.now() + backoff);

          await db
            .update(webhookEventTable)
            .set({
              retries,
              nextAttemptAt: nextAttempt,
              status: retries > maxRetries ? 'failed' : 'pending',
            })
            .where(eq(webhookEventTable.id, event.id));
        }
      }
    }
  }
}

const userCreatedWorker = new UserCreatedWorker();

export { userCreatedWorker as default, UserCreatedWorker };
