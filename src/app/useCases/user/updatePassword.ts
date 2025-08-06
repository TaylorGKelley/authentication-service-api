import hashPassword from '@/app/utils/hashPassword';
import { UUID } from 'node:crypto';

const updatePassword = async (userId: UUID, newPassword: string) => {
  const hashedPassword = await hashPassword(newPassword);
};

export default updatePassword;
