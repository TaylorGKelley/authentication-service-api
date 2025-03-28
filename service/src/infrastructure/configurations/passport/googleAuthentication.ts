import { VerifyFunction } from 'passport-google-oauth2';
import { User } from '@/domain/entities/User';

const googleAuthentication: VerifyFunction = (
  _accessToken,
  _refreshToken,
  profile,
  done
) => {
  console.log(profile);

  const user = new User({ id: 1 });

  // user.findByGoogleId(profile.id);
  // if (!user.id) {
  //   user.createGoogleUser({
  //     firstName: profile.name?.givenName!,
  //     lastName: profile.name?.familyName!,
  //     email: profile.emails?.[0].value!,
  //     googleId: profile.id,
  //   });
  // }

  // if (!user.id) done(new Error('Error fetching or creating user'), false);

  done(null, user);
};

export default googleAuthentication;
