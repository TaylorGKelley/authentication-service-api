import { db } from '@/infrastructure/database';
import { linkedServiceTable } from '@/infrastructure/database/schema';

const getAllLinkedServices = async () => {
	return await db.select().from(linkedServiceTable);
};

export default getAllLinkedServices;
