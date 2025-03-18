export class AppError extends Error {
	public statusCode: number;
	public isOperational = true;

	constructor(message: string, statusCode?: number, isOperational?: boolean) {
		super(message);
		Error.captureStackTrace(this, this.constructor);

		this.statusCode = statusCode || 500;
		this.isOperational = isOperational || true;
	}
}
