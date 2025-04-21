import { db } from '@/infrastructure/database';
import { linkedServiceTable } from '@/infrastructure/database/schema';

const createLinkedService = async (
	linkedService: Omit<typeof linkedServiceTable.$inferInsert, 'id'>
) => {
	return (
		await db
			.insert(linkedServiceTable)
			.values({ ...linkedService })
			.onConflictDoNothing()
			.returning()
	).at(0);
};

export default createLinkedService;
