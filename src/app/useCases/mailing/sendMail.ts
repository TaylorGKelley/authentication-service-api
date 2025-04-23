import nodemailer from 'nodemailer';
import Email from '@/domain/types/mail/Email';

export const sendMail = async (message: Email) => {
	var transport = nodemailer.createTransport({
		host: process.env.MAIL_HOST_URL!,
		port: parseInt(process.env.MAIL_PORT!, 10),
		auth: {
			user: process.env.MAIL_USERNAME!,
			pass: process.env.MAIL_PASSWORD!,
		},
	} as nodemailer.TransportOptions);

	await transport.sendMail({
		...message,
		from: 'noreply@demomailtrap.co',
	});
};
