// import {
// 	GoogleCallbackParameters,
// 	Profile,
// 	VerifyCallback,
// } from 'passport-google-oauth20';
// import { User } from '../../domain/entities/User';

// const googleAuthentication = (
// 	accessToken: string,
// 	refreshToken: string,
// 	profile: Profile,
// 	done: VerifyCallback
// ) => {
// 	const user = new User();

// 	user.findByGoogleId(profile.id);
// 	if (!user.id) {
// 		user.createGoogleUser({
// 			firstName: profile.name?.givenName!,
// 			lastName: profile.name?.familyName!,
// 			email: profile.emails?.[0].value!,
// 			googleId: profile.id,
// 		});
// 	}

// 	if (!user.id) done(new Error('Error fetching or creating user'), false);

// 	done(null, user);
// };

// export default googleAuthentication;
