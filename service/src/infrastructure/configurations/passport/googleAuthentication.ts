import { VerifyFunction } from 'passport-google-oauth2';
import findUser from '@/app/useCases/user/findUser';
import createGoogleUser from '@/app/useCases/user/createGoogleUser';
import { AppError } from '@/domain/entities/AppError';

const googleAuthentication: VerifyFunction = async (
	_accessToken,
	_refreshToken,
	profile,
	done
) => {
	try {
		let user = await findUser({ googleId: profile.id });

		if (user?.id === undefined) {
			user = await createGoogleUser({
				googleId: profile.id,
				email: profile.email,
				displayName: profile.displayName,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
			});
		}

		if (user?.id === undefined)
			throw new AppError('Error fetching or creating user', 500);

		done(null, user);
	} catch (error) {
		done(error, null);
	}
};

export default googleAuthentication;
