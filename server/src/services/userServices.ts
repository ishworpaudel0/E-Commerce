import UserModel from "../models/userModel";
import mongoose from "mongoose";
import RoleModel from "../models/roleModel";
import { NO_OF_SALT } from "../constant/noOfSalt";
import bcrypt from "bcrypt";
import { logger } from "../utils/logger";

export const getAll = async () => {
  return await UserModel.find({}).populate({
    //Ues populate so that we can display roles and check permission.
    path: "roles",
    populate: {
      path: "permissions",
    },
  });
};

export const updateUserRoles = async (userId: string, roles: string[]) => {
  let roleIds: mongoose.Types.ObjectId[] = [];

  if (roles && roles.length > 0) {
    const fetchedRoles = await RoleModel.find({ name: { $in: roles } });

    roleIds = fetchedRoles.map((r) => r._id);

    if (roleIds.length !== roles.length) {
      throw new Error("Some roles do not exist");
    }
  }

  return await UserModel.findByIdAndUpdate(
    userId,
    { roles: roleIds },
    { new: true },
  ).populate({
    path: "roles",
    populate: {
      path: "permissions",
    },
  });
};

export const getById = async (userId: string) => {
  return await UserModel.findById(userId).populate({
    path: "roles",
    populate: {
      path: "permissions",
    },
  });
};

export const updateUser = async (
  userId: string,
  data: Partial<{ name: string; email: string }>,
) => {
  const { name, email } = data;
  const updateData: any = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  return await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).populate({
    path: "roles",
    populate: {
      path: "permissions",
    },
  });
};

export const deleteUser = async (userId: string) => {
  await UserModel.findByIdAndDelete(userId);
};

export const updateUserPassword = async (
  userId: string,
  newPassword: string,
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    logger.warn("No user found to change password");
    throw new Error("User not Found");
  }
  user.password = await bcrypt.hash(newPassword, NO_OF_SALT);
  await user.save();
  return {
    message: "Password reset done",
  };
};
