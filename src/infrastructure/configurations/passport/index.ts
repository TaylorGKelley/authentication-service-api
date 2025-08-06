import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import localAuthentication from './localAuthentication';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import googleAuthentication from './googleAuthentication';
import { db } from '@/infrastructure/database';
import { userTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';
import { User } from '@/domain/entities/User';
import findUser from '@/app/useCases/user/findUser';
import { UUID } from 'node:crypto';

passport.use(new LocalStrategy(localAuthentication));
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI!,
    },
    googleAuthentication
  )
);

passport.serializeUser((user, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser(async (id: UUID, done) => {
  try {
    // Retrieve the user from the database using Drizzle ORM
    const user = await findUser({ id });

    if (!user) {
      throw new Error('User not found');
    }

    done(null, user); // Attach the user object to `req.user`
  } catch (err) {
    done(err);
  }
});

export default passport;
