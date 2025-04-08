import jwt from 'jsonwebtoken';
import RefreshTokenPayload from '@/domain/types/token/RefreshTokenPayload';
import { Request } from 'express';

const extractRefreshToken = (req: Request) => {
  const token = req.cookies?.refreshToken;
  if (!token) return null;

  const tokenPayload = jwt.decode(token) as RefreshTokenPayload;

  return tokenPayload?.rid;
};

export default extractRefreshToken;
