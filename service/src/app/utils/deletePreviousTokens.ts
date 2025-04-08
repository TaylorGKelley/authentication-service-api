import extractBearerToken from './extractBearerToken';
import {
  deleteAccessTokenEntry,
  deleteRefreshTokenEntry,
} from '../useCases/redis/actions';
import { Request } from 'express';
import extractRefreshToken from './extractRefreshToken';

const deletePreviousTokens = async (req: Request) => {
  const accessToken = extractBearerToken(req);
  const rid = extractRefreshToken(req);

  if (accessToken) await deleteAccessTokenEntry(accessToken);
  if (rid) await deleteRefreshTokenEntry(rid);
};

export default deletePreviousTokens;
