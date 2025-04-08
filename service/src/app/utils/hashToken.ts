import { UUID } from 'crypto';
import bcrypt from 'bcrypt';

const hashToken = async (token: string | UUID) => {
  const salt = await bcrypt.genSalt(5);

  return await bcrypt.hash(token, salt);
};

export default hashToken;
