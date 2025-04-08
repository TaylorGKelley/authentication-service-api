import bcrypt from 'bcrypt';

const validateTokenHash = async (token: string, hashedToken: string) => {
  return await bcrypt.compare(token, hashedToken);
};

export default validateTokenHash;
