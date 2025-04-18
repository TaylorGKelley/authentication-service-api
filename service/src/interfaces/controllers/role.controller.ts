import { RequestHandler } from 'express';
import { AppError } from '@/domain/entities/AppError';
import getAllRolesUseCase from '@/app/useCases/roles/getAllRoles';
import getRoleUseCase from '@/app/useCases/roles/getRole';
import createRoleUseCase from '@/app/useCases/roles/createRole';
import updateRoleUseCase from '@/app/useCases/roles/updateRole';
import deleteRoleUseCase from '@/app/useCases/roles/deleteRole';
import addUserToRoleUseCase from '@/app/useCases/roles/addUserToRole';
import removeUserFromRoleUseCase from '@/app/useCases/roles/removeUserFromRole';
import addPermissionToRoleUseCase from '@/app/useCases/roles/addPermissionToRole';
import removePermissionFromRoleUseCase from '@/app/useCases/roles/removePermissionFromRole';
import Role from '@/domain/types/authorization/Role';

export const getAllRoles: RequestHandler = async (req, res, next) => {
	try {
		const roles = await getAllRolesUseCase();

		res.status(200).json({
			roles,
		});
	} catch (error) {
		next(error);
	}
};

export const getRole: RequestHandler<{ roleId: number }> = async (
	req,
	res,
	next
) => {
	const { roleId } = req.params;

	try {
		const role = await getRoleUseCase(roleId);

		res.status(200).json({
			role,
		});
	} catch (error) {
		next(error);
	}
};

export const createRole: RequestHandler<
	any,
	any,
	Omit<Role, 'id'> & { addToNewUser?: boolean }
> = async (req, res, next) => {
	const role = req.body;

	try {
		const newRole = await createRoleUseCase(role);

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
		roleId: number;
	},
	any,
	Partial<Role>
> = async (req, res, next) => {
	const { roleId } = req.params;
	const role = req.body;

	try {
		const updatedRole = await updateRoleUseCase(roleId, role);

		res.status(200).json({
			message: 'Role Updated',
			role: updatedRole,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteRole: RequestHandler<{
	roleId: number;
}> = async (req, res, next) => {
	const { roleId } = req.params;

	try {
		const isSuccess = await deleteRoleUseCase(roleId);

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
	any,
	any,
	{ userId: number; roleId: number }
> = async (req, res, next) => {
	const { userId, roleId } = req.body;

	try {
		const result = await addPermissionToRoleUseCase(userId, roleId);

		if (!result) {
			throw new AppError('Role already has that permission', 409);
		}

		res.status(200).json({
			message: 'User added to role',
		});
	} catch (error) {
		next(error);
	}
};

export const removePermissionFromRole: RequestHandler<
	any,
	any,
	{ userId: number; roleId: number }
> = async (req, res, next) => {
	const { userId, roleId } = req.body;

	try {
		await removePermissionFromRoleUseCase(userId, roleId);

		res.status(200).json({
			message: 'Permission removed from role',
		});
	} catch (error) {
		next(error);
	}
};

export const addUserToRole: RequestHandler<
	any,
	any,
	{ userId: number; roleId: number }
> = async (req, res, next) => {
	const { userId, roleId } = req.body;

	try {
		const result = await addUserToRoleUseCase(userId, roleId);

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
	any,
	any,
	{ userId: number; roleId: number }
> = async (req, res, next) => {
	const { userId, roleId } = req.body;

	try {
		await removeUserFromRoleUseCase(userId, roleId);

		res.status(200).json({
			message: 'User removed from role',
		});
	} catch (error) {
		next(error);
	}
};
