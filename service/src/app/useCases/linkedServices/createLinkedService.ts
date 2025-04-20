import { db } from '@/infrastructure/database';
import { linkedServiceTable } from '@/infrastructure/database/schema';

const createLinkedService = async (
	linkedService: typeof linkedServiceTable.$inferInsert
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
