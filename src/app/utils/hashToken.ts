import crypto, { type UUID } from 'crypto';

const hashToken = async (token: string | UUID): Promise<string> => {
  const hashedToken = await crypto
    .createHmac('sha256', process.env.TOKEN_HASH_KEY!)
    .update(token)
    .digest('hex');

  return hashedToken;
};

export default hashToken;
