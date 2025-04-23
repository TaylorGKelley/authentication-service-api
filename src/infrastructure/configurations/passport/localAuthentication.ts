import { VerifyFunction } from 'passport-local';
import { User } from '@/domain/entities/User';
import verifyPassword from '@/app/utils/verifyPassword';
import findUser from '@/app/useCases/user/findUser';
import { AppError } from '@/domain/entities/AppError';

const authEmailUser: VerifyFunction = async (email, password, callback) => {
	try {
		const user = await findUser({ email });

		if (user?.id === undefined) return callback(null, false);

		if (!(await verifyPassword(password, user.password!)))
			return callback(new AppError('Incorrect password', 401), false);

		return callback(null, new User(user));
	} catch (error) {
		return callback(error);
	}
};

export default authEmailUser;
