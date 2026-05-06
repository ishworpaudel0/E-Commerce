import { NO_OF_SALT } from "../constant/noOfSalt";
import {
  userLoginRequest,
  userRegisterRequest,
  UserWithRolesAndPermission,
} from "../interfaces/userInterface";
import bcrypt from "bcrypt";
import userModel from "../models/userModel";
import { logger } from "../utils/logger";
import { generateAccessToken, generateRefreshToken } from "../utils/authTokens";
import sessionModel from "../models/sessionModel";

export const register = async (userData: userRegisterRequest) => {
  const { name, email, password } = userData;
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    logger.warn(`Registration attempt with existing email: ${email}`);
    throw new Error("User with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, NO_OF_SALT);
  return await userModel.create({ name, email, password: hashedPassword });
};

export const login = async (data: userLoginRequest) => {
  const { email, password } = data;
  const user = (await userModel
    .findOne({ email })
    .select("+password")
    .populate({
      path: "roles",
      populate: {
        path: "permissions",
      },
    })
    .select("+password")) as UserWithRolesAndPermission;
  if (!user) {
    logger.warn(`Login attempt with non-existent email: ${email}`);
    throw new Error("Invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    logger.warn(`Invalid password attempt for email: ${email}`);
    throw new Error("Invalid email or password");
  }
  const roles = user?.roles?.map((role) => role.name) ?? [];
  const permissions =
    user?.roles?.flatMap(
      (role) => role.permissions?.map((permission) => permission.name) ?? [],
    ) ?? [];

  const accessToken = generateAccessToken(user, roles, permissions);
  const refreshToken = generateRefreshToken(user);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);
  await sessionModel.create({ userId: user._id, refreshToken, expiresAt });
  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  };
};

export const logout = async (userId: string) => {
  return await sessionModel.deleteMany({ userId });
};

export const refreshAccessToken = async (refreshToken: string) => {
  const session = await sessionModel.findOne({ refreshToken });

  if (!session) {
    throw new Error("Invalid refresh token");
  }

  const user = (await userModel
    .findOne({ _id: session.userId })
    .populate({
      path: "roles",
      populate: {
        path: "permissions",
      },
    })
    .select("+password")) as UserWithRolesAndPermission;

  if (!user) {
    throw new Error("User not found");
  }

  const roles = user?.roles?.map((role) => role.name) ?? [];

  const permissions =
    user?.roles?.flatMap(
      (role) => role.permissions?.map((permission) => permission.name) ?? [],
    ) ?? [];

  logger.info(
    `[AUTH-SERVICES] [GENERATE-ACCESS-TOKEN] Generating new access token for user: ${user.email} based on refresh token`,
  );

  const accessToken = generateAccessToken(user, roles, permissions);

  return {
    accessToken,
  };
};
