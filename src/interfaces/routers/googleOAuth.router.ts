import passport from '@/infrastructure/configurations/passport';
import { Router } from 'express';

const googleOAuthRouter = Router();

googleOAuthRouter.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

export default googleOAuthRouter;
