import { type UUID } from 'node:crypto';
import { db } from '@/infrastructure/database';
import { linkedServiceTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const deleteLinkedService = async (linkedServiceId: UUID) => {
	const result = await db
		.delete(linkedServiceTable)
		.where(eq(linkedServiceTable.id, linkedServiceId));

	return result.rowCount != null && result.rowCount > 0;
};

export default deleteLinkedService;
