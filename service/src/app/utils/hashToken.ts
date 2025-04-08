import { UUID } from 'crypto';
import bcrypt from 'bcrypt';

const hashToken = async (token: string | UUID): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedToken = await bcrypt.hash(token?.toString(), salt);

  return hashedToken;
};

export default hashToken;
