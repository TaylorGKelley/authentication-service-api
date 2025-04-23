import crypto from 'node:crypto';

const generateResetToken = () => {
	const resetToken = crypto.randomBytes(64).toString('hex');
	return resetToken;
};

export default generateResetToken;
