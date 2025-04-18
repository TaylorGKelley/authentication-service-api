import { RequestHandler } from 'express';
import { AppError } from '@/domain/entities/AppError';
import getAllPermissionsUseCase from '@/app/useCases/permissions/getAllPermissions';
import getPermissionUseCase from '@/app/useCases/permissions/getPermission';
import { getPermissionsForUser as getPermissionsForUserUseCase } from '@/app/useCases/permissionSync';
import createPermissionUseCase from '@/app/useCases/permissions/createPermission';
import importPermissionsUseCase from '@/app/useCases/permissions/importPermissions';
import updatePermissionUseCase from '@/app/useCases/permissions/updatePermission';
import deletePermissionUseCase from '@/app/useCases/permissions/deletePermission';
import Permission from '@/domain/types/authorization/Permission';

export const getAllPermissions: RequestHandler = async (req, res, next) => {
	try {
		const permissions = await getAllPermissionsUseCase();

		res.status(200).json({
			permissions,
		});
	} catch (error) {
		next(error);
	}
};

export const getPermission: RequestHandler<{ permissionId: number }> = async (
	req,
	res,
	next
) => {
	const { permissionId } = req.params;

	try {
		const permission = await getPermissionUseCase(permissionId);

		res.status(200).json({
			permission,
		});
	} catch (error) {
		next(error);
	}
};

export const getPermissionsForUser: RequestHandler<{ userId: number }> = async (
	req,
	res,
	next
) => {
	const { userId } = req.params;

	try {
		const permissions = await getPermissionsForUserUseCase(userId);

		res.status(200).json({
			permissions,
		});
	} catch (error) {
		next(error);
	}
};

export const createPermission: RequestHandler<
	any,
	any,
	Omit<Permission, 'id'> & { addToNewRole?: boolean }
> = async (req, res, next) => {
	const permission = req.body;
	try {
		const newPermission = await createPermissionUseCase(permission);

		if (!newPermission) {
			throw new AppError('Permission already exist', 409);
		}

		res.status(200).json({
			message: 'Permission Created',
			permission: newPermission,
		});
	} catch (error) {
		next(error);
	}
};

export const importPermissions: RequestHandler<
	any,
	any,
	(Omit<Permission, 'id'> & { addToNewRole?: boolean })[]
> = async (req, res, next) => {
	const permissions = req.body;

	try {
		const newPermissions = await importPermissionsUseCase(permissions);

		res.status(200).json({
			permissions: newPermissions,
		});
	} catch (error) {
		next(error);
	}
};

export const updatePermission: RequestHandler<
	{
		permissionId: number;
	},
	any,
	Partial<Permission>
> = async (req, res, next) => {
	const { permissionId } = req.params;
	const permission = req.body;

	try {
		const updatedPermission = await updatePermissionUseCase(
			permissionId,
			permission
		);

		res.status(200).json({
			message: 'Permission Updated',
			permission: updatedPermission,
		});
	} catch (error) {
		next(error);
	}
};

export const deletePermission: RequestHandler<{
	permissionId: number;
}> = async (req, res, next) => {
	const { permissionId } = req.params;

	try {
		const isSuccess = await deletePermissionUseCase(permissionId);

		if (!isSuccess) {
			throw new AppError('Permission with that id does not exist', 404);
		}

		res.status(200).json({
			message: 'Permission deleted',
		});
	} catch (error) {
		next(error);
	}
};
