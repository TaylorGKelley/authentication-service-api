import crypto from 'node:crypto';

const algorithm: crypto.CipherGCMTypes = 'aes-256-gcm';

export const encryptSecret = (secret: string) => {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    algorithm,
    process.env.WEBHOOK_SECRET_KEY!,
    iv
  );

  const encryptedSecret = Buffer.concat([
    cipher.update(secret),
    cipher.final(),
  ]);

  return {
    iv: iv.toString('hex'),
    encryptedSecret: encryptedSecret.toString('hex'),
  };
};

export const decryptSecret = (encryptedSecret: string, iv: string) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    process.env.WEBHOOK_SECRET_KEY!,
    Buffer.from(iv, 'hex')
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(encryptedSecret, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
