import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { roleTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const getAllRoles = async (linkedServiceId: LinkedService['id']) => {
	return await db
		.select()
		.from(roleTable)
		.where(eq(roleTable.linkedServiceId, linkedServiceId));
};

export default getAllRoles;
