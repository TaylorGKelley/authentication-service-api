import passport from '@/infrastructure/configurations/passport';
import { Router } from 'express';
import { processSignIn } from '../controllers/googleOAuth.controller';
import { loginLimiter } from '../middleware/rateLimiters';

const googleOAuthRouter = Router();

googleOAuthRouter.use(loginLimiter);

googleOAuthRouter.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

googleOAuthRouter.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  processSignIn
);

export default googleOAuthRouter;
