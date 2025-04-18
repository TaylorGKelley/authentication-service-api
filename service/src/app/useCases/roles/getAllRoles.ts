import { db } from '@/infrastructure/database';
import { roleTable } from '@/infrastructure/database/schema';

const getAllRoles = async () => {
	return await db.select().from(roleTable);
};

export default getAllRoles;
