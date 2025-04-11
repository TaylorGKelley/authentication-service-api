import { RequestHandler } from 'express';
import { getAllLogs as getAllLogsUseCase } from '@/app/useCases/logging/getAllLogs';

export const getAllLogs: RequestHandler = async (req, res) => {
	const logs = getAllLogsUseCase();

	res.status(200).json({
		message: 'Successfully fetched all logs',
		logs,
	});
};
