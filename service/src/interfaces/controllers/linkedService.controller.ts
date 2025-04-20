import { RequestHandler } from 'express';
import { AppError } from '@/domain/entities/AppError';
import getAllLinkedServicesUseCase from '@/app/useCases/linkedServices/getAllLinkedServices';
import getLinkedServiceUseCase from '@/app/useCases/linkedServices/getLinkedService';
import createLinkedServiceUseCase from '@/app/useCases/linkedServices/createLinkedService';
import updateLinkedServiceUseCase from '@/app/useCases/linkedServices/updateLinkedService';
import deleteLinkedServiceUseCase from '@/app/useCases/linkedServices/deleteLinkedService';
import LinkedService from '@/domain/types/authorization/LinkedService';

export const getAllLinkedServices: RequestHandler = async (req, res, next) => {
	try {
		const linkedServices = await getAllLinkedServicesUseCase();

		res.status(200).json({
			linkedServices,
		});
	} catch (error) {
		next(error);
	}
};

export const getLinkedService: RequestHandler<{
	linkedServiceId: LinkedService['id'];
}> = async (req, res, next) => {
	const { linkedServiceId } = req.params;

	try {
		const linkedService = await getLinkedServiceUseCase(linkedServiceId);

		res.status(200).json({
			linkedService,
		});
	} catch (error) {
		next(error);
	}
};

export const createLinkedService: RequestHandler<
	any,
	any,
	Omit<LinkedService, 'id'>
> = async (req, res, next) => {
	const linkedService = req.body;
	try {
		const newLinkedService = await createLinkedServiceUseCase(linkedService);

		if (!newLinkedService) {
			throw new AppError('LinkedService already exist', 409);
		}

		res.status(200).json({
			message: 'LinkedService Created',
			linkedService: newLinkedService,
		});
	} catch (error) {
		next(error);
	}
};

export const updateLinkedService: RequestHandler<
	{
		linkedServiceId: LinkedService['id'];
	},
	any,
	Partial<LinkedService>
> = async (req, res, next) => {
	const { linkedServiceId } = req.params;
	const linkedService = req.body;

	try {
		const updatedLinkedService = await updateLinkedServiceUseCase(
			linkedServiceId,
			linkedService
		);

		res.status(200).json({
			message: 'LinkedService Updated',
			linkedService: updatedLinkedService,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteLinkedService: RequestHandler<{
	linkedServiceId: LinkedService['id'];
}> = async (req, res, next) => {
	const { linkedServiceId } = req.params;

	try {
		const isSuccess = await deleteLinkedServiceUseCase(linkedServiceId);

		if (!isSuccess) {
			throw new AppError('LinkedService with that id does not exist', 404);
		}

		res.status(200).json({
			message: 'LinkedService deleted',
		});
	} catch (error) {
		next(error);
	}
};
