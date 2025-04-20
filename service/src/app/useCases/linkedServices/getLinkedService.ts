import { type UUID } from 'node:crypto';
import { db } from '@/infrastructure/database';
import { linkedServiceTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const getLinkedService = async (linkedServiceId: UUID) => {
	return (
		await db
			.select()
			.from(linkedServiceTable)
			.where(eq(linkedServiceTable.id, linkedServiceId))
			.limit(1)
	).at(0);
};

export default getLinkedService;
