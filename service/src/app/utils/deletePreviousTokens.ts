import extractBearerToken from './extractBearerToken';
import {
  deleteAccessTokenEntry,
  deleteRefreshTokenEntry,
} from '../useCases/redis/actions';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import RefreshTokenPayload from '@/domain/types/token/RefreshTokenPayload';

const deletePreviousTokens = async (req: Request) => {
  const accessToken = extractBearerToken(req);
  const { refreshToken } = req.cookies;
  const { rid } = jwt.decode(refreshToken) as RefreshTokenPayload;

  if (accessToken) await deleteAccessTokenEntry(accessToken);
  if (refreshToken) await deleteRefreshTokenEntry(rid);
};

export default deletePreviousTokens;
