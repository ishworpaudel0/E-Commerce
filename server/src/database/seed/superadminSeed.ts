import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { logger } from "../../utils/logger";
import appPermissions from "../../constant/permission";
import PermissionModel from "../../models/permissionModel";
import appRoles from "../../constant/roles";
import RoleModel from "../../models/roleModel";
import UserModel from "../../models/userModel";
import { NO_OF_SALT } from "../../constant/noOfSalt";

dotenv.config();

const seed = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  const Super_Admin_Name = process.env.Super_Admin_Name;
  const Super_Admin_Email = process.env.Super_Admin_Email;
  const Super_Admin_Password = process.env.Super_Admin_Password;

  if (
    !MONGODB_URI ||
    !Super_Admin_Name ||
    !Super_Admin_Email ||
    !Super_Admin_Password
  ) {
    logger.error(
      "Missing required environment variables for seeding super admin",
    );
    throw new Error(
      "Please set MONGODB_URI, Super_Admin_Name, Super_Admin_Email, and Super_Admin_Password in your .env file",
    );
  }

  // This variable is declared here so it is accessible in the entire function scope.
  // try catch is used so it needs to be declared here
  let createdPermissions: any[] = [];

  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB for seeding super admin");

    // 1. Seed Permissions
    const permissionList = Object.values(appPermissions).map((perm) => ({
      name: perm.name,
      description: perm.description,
    }));

    createdPermissions = await Promise.all(
      permissionList.map(async (perm) => {
        const existingPermission = await PermissionModel.findOne({
          name: perm.name,
        });
        if (existingPermission) {
          return existingPermission;
        }
        return PermissionModel.create({
          name: perm.name,
          description: perm.description,
        });
      }),
    );
    logger.info("Permissions seeded successfully");

    // Seed Roles
    // Access .name and .description properties specifically from constants.
    const roleList = [
      {
        name: appRoles.Super_Admin.name,
        description: appRoles.Super_Admin.description,
        permissions: createdPermissions.map((perm) => perm._id),
        //super admin gets all permissions, so we map through createdPermissions to get their _id for the role's permissions array.
      },
      {
        name: appRoles.Admin.name,
        description: appRoles.Admin.description,
        permissions: createdPermissions
          .filter(
            (perm) =>
              perm.name !== appPermissions.UPDATE_ROLES.name &&
              perm.name !== appPermissions.CREATE_ROLES.name &&
              perm.name !== appPermissions.VIEW_ANALYTICS.name,
          )
          .map((perm) => perm._id),
        // Admin gets all permissions except those related to role management and analytics, so we filter out those permissions before mapping to get their _id for the role's permissions array.
      },
      {
        name: appRoles.User.name,
        description: appRoles.User.description,
        permissions: [],
        // Regular users do not get any special permissions, so we leave the permissions array empty.
      },
    ];

    const createdRoles = await Promise.all(
      roleList.map(async (role) => {
        const existingRole = await RoleModel.findOne({ name: role.name });
        if (existingRole) {
          existingRole.permissions =
            role.permissions as mongoose.Types.ObjectId[];
          return await existingRole.save();
        }
        return RoleModel.create(role);
      }),
    );
    logger.info("Roles seeded successfully");

    //Seed Super Admin User
    const existingSuperAdmin = await UserModel.findOne({
      email: Super_Admin_Email,
    });
    if (!existingSuperAdmin) {
      const superAdminRole = createdRoles.find(
        (role) => role.name === appRoles.Super_Admin.name,
      );

      if (!superAdminRole) {
        throw new Error("Super Admin role not found during user creation");
      }

      const hashedPassword = await bcrypt.hash(
        Super_Admin_Password,
        NO_OF_SALT,
      );

      await UserModel.create({
        name: Super_Admin_Name,
        email: Super_Admin_Email,
        password: hashedPassword,
        roles: [superAdminRole._id],
      });
      logger.info("Super admin user seeded successfully");
    } else {
      logger.info("Super admin user already exists, skipping creation");
    }
  } catch (error) {
    logger.error("Error during seeding process", { error });
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
    process.exit(0);
  }
};

seed().catch((error) => {
  logger.error("Critical error in seeding script", { error });
  process.exit(1);
});
