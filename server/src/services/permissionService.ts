// Permission is created but not used in front end since it is small project.
import { createPermissionRequest } from "../interfaces/permissionInterface";
import PermissionModel from "../models/permissionModel";

export const createdPermissions = async (data: createPermissionRequest) => {
  const { name, description } = data;
  const existingPermission = await PermissionModel.findOne({ name });
  if (existingPermission) {
    throw new Error("Permission with this name already exists");
  }
  return await PermissionModel.create({ name, description });
};

export const getAllPermissions = async () => {
  return await PermissionModel.find();
};

