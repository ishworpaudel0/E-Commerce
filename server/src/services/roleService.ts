import mongoose from "mongoose";
import RoleModel from "../models/roleModel";
import PermissionModel from "../models/permissionModel";
import { createRoleRequest } from "../interfaces/roleInterface";

export const createRole = async (data: createRoleRequest) => {
  const { name, description, permissions } = data;
  const existingRole = await RoleModel.findOne({ name });

  if (existingRole) {
    throw new Error("Role already exists!");
  }
  let permissionIds: mongoose.Types.ObjectId[] = [];

  if (permissions && permissions.length > 0) {
    const perms = await PermissionModel.find({ name: { $in: permissions } });
    permissionIds = perms.map((p) => p._id);

    if (permissionIds.length !== permissions.length) {
      throw new Error("One or more permissions are invalid!");
    }
  }
  return RoleModel.create({
    name,
    description,
    ...(permissionIds.length > 0 && { permissions: permissionIds }),
  });
};

export const getAllRoles = async () => {
  return await RoleModel.find().populate("permissions");
};
export const updateRole = async (
  roleId: string,
  data: Partial<createRoleRequest>,
) => {
  const { name, description, permissions } = data;

  const role = await RoleModel.findById(roleId);
  if (!role) {
    throw new Error("Role not found");
  }

  // If a new name is provided, ensure it's not already taken by another role
  if (name && name !== role.name) {
    const nameExists = await RoleModel.findOne({ name });
    if (nameExists) {
      throw new Error("A role with this name already exists");
    }
  }

  let permissionIds: mongoose.Types.ObjectId[] = [];

  if (permissions && permissions.length > 0) {
    const perms = await PermissionModel.find({ name: { $in: permissions } });
    permissionIds = perms.map((p) => p._id as mongoose.Types.ObjectId);

    if (permissionIds.length !== permissions.length) {
      throw new Error("One or more provided permissions are invalid");
    }
  }

  return await RoleModel.findByIdAndUpdate(
    roleId,
    {
      // Replaces if (name) updateData.name = name;
      //... Makes sure that if only one is provided only that is changed.
      ...(name && { name }),
      ...(description && { description }),
      // Update permissions only if provided in the request.
      ...(permissions && { permissions: permissionIds }),
    },
    { new: true, runValidators: true },
  ).populate("permissions");
};

//Delete role by ID
export const deleteRole = async (roleId: string) => {
  const role = await RoleModel.findById(roleId);
  if (!role) {
    throw new Error("Role not found");
  }
  return await RoleModel.findByIdAndDelete(roleId);
};
