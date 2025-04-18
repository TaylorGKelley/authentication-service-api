import { verifyAccessToken } from '@/app/useCases/token/verifyToken';
import extractBearerToken from '@/app/utils/extractBearerToken';
import { RequestHandler } from 'express';

const authenticateRequest: RequestHandler = async (req, _res, next) => {
	try {
		const accessToken = extractBearerToken(req);
		if (!accessToken) {
			req.user = undefined;
			return next();
		}

		const verifiedToken = await verifyAccessToken(accessToken);
		if (!verifiedToken?.id) {
			req.user = undefined;
			return next();
		}
		req.user = {
			id: verifiedToken.id,
			// roles: verifiedToken.roleIds.map((id) => {
			//   id;
			// }),
		};

		next();
	} catch (error) {
		req.user = undefined;
		next();
	}
};

export default authenticateRequest;
