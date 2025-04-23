export type EmailAddress = `${string}@${string}.${string}`;

type Email = {
	to: EmailAddress;
	subject: string;
	text: string;
	html: string;
};

export default Email;
