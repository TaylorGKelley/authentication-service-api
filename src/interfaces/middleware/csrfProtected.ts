import csurf from 'csurf';
import { RequestHandler } from 'express';

const csrfProtected: (options?: {
	exemptRoutes?: string[];
}) => RequestHandler = (options) => (req, res, next) => {
	try {
		if (options?.exemptRoutes?.includes(req.originalUrl)) {
			return next();
		} else {
			// Check CSRF token
			csurf({
				cookie: {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
					path: '/',
				},
			})(req, res, next);
		}
	} catch (error) {
		next(error);
	}
};

export default csrfProtected;
