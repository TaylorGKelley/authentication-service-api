import { Request } from 'express';

const extractBearerToken = (req: Request) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(' ')[1];
  if (token || token == 'null') {
    return token;
  }

  return null;
};

export default extractBearerToken;
