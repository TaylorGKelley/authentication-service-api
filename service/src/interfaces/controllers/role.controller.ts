import { RequestHandler } from 'express';
import { AppError } from '@/domain/entities/AppError';
import Role from '@/domain/types/authorization/Role';
import getAllRolesUseCase from '@/app/useCases/roles/getAllRoles';
import getRoleUseCase from '@/app/useCases/roles/getRole';
import createRoleUseCase from '@/app/useCases/roles/createRole';
import updateRoleUseCase from '@/app/useCases/roles/updateRole';
import deleteRoleUseCase from '@/app/useCases/roles/deleteRole';
import addUserToRoleUseCase from '@/app/useCases/roles/addUserToRole';
import removeUserFromRoleUseCase from '@/app/useCases/roles/removeUserFromRole';
import addPermissionToRoleUseCase from '@/app/useCases/roles/addPermissionToRole';
import removePermissionFromRoleUseCase from '@/app/useCases/roles/removePermissionFromRole';
import LinkedService from '@/domain/types/authorization/LinkedService';

export const getAllRoles: RequestHandler<{
	linkedServiceId: LinkedService['id'];
}> = async (req, res, next) => {
	const { linkedServiceId } = req.params;

	try {
		const roles = await getAllRolesUseCase(linkedServiceId);

		res.status(200).json({
			roles,
		});
	} catch (error) {
		next(error);
	}
};

export const getRole: RequestHandler<{
	linkedServiceId: LinkedService['id'];
	roleId: number;
}> = async (req, res, next) => {
	const { linkedServiceId, roleId } = req.params;

	try {
		const role = await getRoleUseCase(linkedServiceId, roleId);

		res.status(200).json({
			role,
		});
	} catch (error) {
		next(error);
	}
};

export const createRole: RequestHandler<
	{ linkedServiceId: LinkedService['id'] },
	any,
	Omit<Role, 'id' | 'linkedServiceId'> & { addToNewUser?: boolean }
> = async (req, res, next) => {
	const { linkedServiceId } = req.params;
	const role = req.body;

	try {
		const newRole = await createRoleUseCase(linkedServiceId, role);

		if (!newRole) {
			throw new AppError('Role already exist', 409);
		}

		res.status(200).json({
			message: 'Role Created',
			role: newRole,
		});
	} catch (error) {
		next(error);
	}
};

export const updateRole: RequestHandler<
	{
		linkedServiceId: LinkedService['id'];
		roleId: number;
	},
	any,
	Omit<Partial<Role>, 'linkedServiceId'>
> = async (req, res, next) => {
	const { linkedServiceId, roleId } = req.params;
	const role = req.body;

	try {
		const updatedRole = await updateRoleUseCase(linkedServiceId, roleId, role);

		res.status(200).json({
			message: 'Role Updated',
			role: updatedRole,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteRole: RequestHandler<{
	linkedServiceId: LinkedService['id'];
	roleId: number;
}> = async (req, res, next) => {
	const { linkedServiceId, roleId } = req.params;

	try {
		const isSuccess = await deleteRoleUseCase(linkedServiceId, roleId);

		if (!isSuccess) {
			throw new AppError('Role with that id does not exist', 404);
		}

		res.status(200).json({
			message: 'Role deleted',
		});
	} catch (error) {
		next(error);
	}
};

export const addPermissionToRole: RequestHandler<
	{ linkedServiceId: LinkedService['id'] },
	any,
	{ roleId: number; permissionId: number }
> = async (req, res, next) => {
	const { linkedServiceId } = req.params;
	const { roleId, permissionId } = req.body;

	try {
		const result = await addPermissionToRoleUseCase(
			linkedServiceId,
			roleId,
			permissionId
		);

		if (!result) {
			throw new AppError('Role already has that permission', 409);
		}

		res.status(200).json({
			message: 'Permission added to role',
		});
	} catch (error) {
		next(error);
	}
};

export const removePermissionFromRole: RequestHandler<
	{ linkedServiceId: LinkedService['id'] },
	any,
	{ permissionId: number; roleId: number }
> = async (req, res, next) => {
	const { linkedServiceId } = req.params;
	const { roleId, permissionId } = req.body;

	try {
		const result = await removePermissionFromRoleUseCase(
			linkedServiceId,
			roleId,
			permissionId
		);

		if (!result) {
			throw new AppError('Role does not have that permission', 409);
		}

		res.status(200).json({
			message: 'Permission removed from role',
		});
	} catch (error) {
		next(error);
	}
};

export const addUserToRole: RequestHandler<
	{ linkedServiceId: LinkedService['id'] },
	any,
	{ roleId: number; userId: number }
> = async (req, res, next) => {
	const { linkedServiceId } = req.params;
	const { roleId, userId } = req.body;

	try {
		const result = await addUserToRoleUseCase(linkedServiceId, roleId, userId);

		if (!result) {
			throw new AppError('User already belongs to that role', 409);
		}

		res.status(200).json({
			message: 'User added to role',
		});
	} catch (error) {
		next(error);
	}
};

export const removeUserFromRole: RequestHandler<
	{ linkedServiceId: LinkedService['id'] },
	any,
	{ userId: number; roleId: number }
> = async (req, res, next) => {
	const { linkedServiceId } = req.params;
	const { userId, roleId } = req.body;

	try {
		const result = await removeUserFromRoleUseCase(
			linkedServiceId,
			roleId,
			userId
		);

		if (!result) {
			throw new AppError('User does not belong to that role', 409);
		}

		res.status(200).json({
			message: 'User removed from role',
		});
	} catch (error) {
		next(error);
	}
};
