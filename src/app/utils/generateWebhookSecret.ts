import crypto from 'node:crypto';

export function generateSecret() {
  return crypto.randomBytes(128).toString('hex');
}
