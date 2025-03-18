import { Request } from 'express';
import extractBearerToken from './extractBearerToken';
import {
	deleteAccessTokenEntry,
	deleteRefreshTokenEntry,
} from '../useCases/redis/actions';

const deletePreviousTokens = async (req: Request) => {
	const accessToken = extractBearerToken(req);
	const { refreshToken } = req.cookies;

	if (accessToken) await deleteAccessTokenEntry(accessToken);
	if (refreshToken) await deleteRefreshTokenEntry(refreshToken?.rid);
};

export default deletePreviousTokens;
