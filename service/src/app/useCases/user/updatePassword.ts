import hashPassword from '@/app/utils/hashPassword';

const updatePassword = async (userId: number, newPassword: string) => {
	const hashedPassword = await hashPassword(newPassword);
};

export default updatePassword;
