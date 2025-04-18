import { RequestHandler } from 'express';

export const getAllPermissions: RequestHandler = (req, res, next) => {};

export const getPermission: RequestHandler<{ permissionId: number }> = (
  req,
  res,
  next
) => {};

export const createPermission: RequestHandler = (req, res, next) => {};

export const importPermissions: RequestHandler = (req, res, next) => {};

export const updatePermission: RequestHandler<{ permissionId: number }> = (
  req,
  res,
  next
) => {};

export const deletePermission: RequestHandler<{ permissionId: number }> = (
  req,
  res,
  next
) => {};
