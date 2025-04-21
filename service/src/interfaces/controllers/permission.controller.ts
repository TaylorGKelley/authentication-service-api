import { type UUID } from 'node:crypto';
import { type RequestHandler } from 'express';
import type Permission from '@/domain/types/authorization/Permission';
import type LinkedService from '@/domain/types/authorization/LinkedService';
import { AppError } from '@/domain/entities/AppError';
import getAllPermissionsUseCase from '@/app/useCases/permissions/getAllPermissions';
import getPermissionUseCase from '@/app/useCases/permissions/getPermission';
import { getPermissionsForUser as getPermissionsForUserUseCase } from '@/app/useCases/permissionSync';
import createPermissionUseCase from '@/app/useCases/permissions/createPermission';
import importPermissionsUseCase from '@/app/useCases/permissions/importPermissions';
import updatePermissionUseCase from '@/app/useCases/permissions/updatePermission';
import deletePermissionUseCase from '@/app/useCases/permissions/deletePermission';

export const getAllPermissions: RequestHandler<{
	linkedServiceId: LinkedService['id'];
}> = async (req, res, next) => {
	const { linkedServiceId } = req.params;

	try {
		const permissions = await getAllPermissionsUseCase(linkedServiceId);

		res.status(200).json({
			permissions,
		});
	} catch (error) {
		next(error);
	}
};

export const getPermission: RequestHandler<{
	linkedServiceId: LinkedService['id'];
	permissionId: number;
}> = async (req, res, next) => {
	const { linkedServiceId, permissionId } = req.params;

	try {
		const permission = await getPermissionUseCase(
			linkedServiceId,
			permissionId
		);

		if (!permission) {
			throw new AppError('Permission not found', 404);
		}

		res.status(200).json({
			permission,
		});
	} catch (error) {
		next(error);
	}
};

export const createPermission: RequestHandler<
	{ linkedServiceId: UUID },
	any,
	Omit<Permission, 'id' | 'linkedServiceId'> & { addToNewRole?: boolean }
> = async (req, res, next) => {
	const { linkedServiceId } = req.params;
	const permission = req.body;

	try {
		const newPermission = await createPermissionUseCase(
			linkedServiceId,
			permission
		);

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
	{ linkedServiceId: UUID },
	any,
	(Omit<Permission, 'id' | 'linkedServiceId'> & { addToNewRole?: boolean })[]
> = async (req, res, next) => {
	const { linkedServiceId } = req.params;
	const permissions = req.body;

	try {
		const newPermissions = await importPermissionsUseCase(
			linkedServiceId,
			permissions
		);

		res.status(200).json({
			permissions: newPermissions,
		});
	} catch (error) {
		next(error);
	}
};

export const updatePermission: RequestHandler<
	{
		linkedServiceId: LinkedService['id'];
		permissionId: number;
	},
	any,
	Omit<Partial<Permission>, 'linkedServiceId'>
> = async (req, res, next) => {
	const { linkedServiceId, permissionId } = req.params;
	const permission = req.body;

	try {
		const updatedPermission = await updatePermissionUseCase(
			linkedServiceId,
			permissionId,
			permission
		);

		if (!updatePermission) {
			throw new AppError('Permission not found', 404);
		}

		res.status(200).json({
			message: 'Permission Updated',
			permission: updatedPermission,
		});
	} catch (error) {
		next(error);
	}
};

export const deletePermission: RequestHandler<{
	linkedServiceId: LinkedService['id'];
	permissionId: number;
}> = async (req, res, next) => {
	const { linkedServiceId, permissionId } = req.params;

	try {
		const isSuccess = await deletePermissionUseCase(
			linkedServiceId,
			permissionId
		);

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
