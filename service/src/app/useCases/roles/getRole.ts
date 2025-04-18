import { db } from '@/infrastructure/database';
import { roleTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const getRole = async (roleId: number) => {
	return (
		await db.select().from(roleTable).where(eq(roleTable.id, roleId)).limit(1)
	).at(0);
};

export default getRole;
