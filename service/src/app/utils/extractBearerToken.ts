import { Request } from 'express';

const extractBearerToken = (req: Request) => {
	const authHeader = req.headers.authorization;

	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.split(' ')[1];
	}

	return null;
};

export default extractBearerToken;
