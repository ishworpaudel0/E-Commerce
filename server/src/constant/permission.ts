const appPermissions = {
  UPDATE_ROLES: {
    name: "UPDATE_ROLES",
    description:
      "Allows the user to update existing roles and their permissions",
  },
  CREATE_ROLES: {
    name: "CREATE_ROLES",
    description:
      "Allows the user to create new roles and assign permissions to users",
  },
  VIEW_USERS: {
    name: "VIEW_USERS",
    description: "Allows the user to view the list of users and their details",
  },
  UPDATE_USERS: {
    name: "UPDATE_USERS",
    description:
      "Allows the user to update user details and manage their roles and permissions",
  },
  DELETE_USERS: {
    name: "DELETE_USERS",
    description: "Allows the user to delete user accounts",
  },
  DELETE_PRODUCTS: {
    name: "DELETE_PRODUCTS",
    description: "Allows the user to delete products from the catalog",
  },
  DELETE_ORDERS: {
    name: "DELETE_ORDERS",
    description: "Allows the user to delete customer orders",
  },
  DELETE_PERMISSIONS: {
    name: "DELETE_PERMISSIONS",
    description: "Allows the user to delete permissions from the system",
  },
  MANAGE_PRODUCTS: {
    name: "MANAGE_PRODUCTS",
    description: "Allows the user to create, update, and delete products",
  },
  MANAGE_ORDERS: {
    name: "MANAGE_ORDERS",
    description: "Allows the user to view and manage customer orders",
  },
  MANAGE_USERS: {
    name: "MANAGE_USERS",
    description: "Allows the user to create, update, and delete users",
  },
  CATEGORY_MANAGEMENT: {
    name: "CATEGORY_MANAGEMENT",
    description:
      "Allows the user to create, update, and delete product categories",
  },
  VIEW_ANALYTICS: {
    name: "VIEW_ANALYTICS",
    description: "Allows the user to view sales and customer analytics",
  },
  CREATE_PERMISSIONS: {
    name: "CREATE_PERMISSIONS",
    description:
      "Allows the user to create new permissions and assign them to roles",
  },
  UPDATE_PERMISSIONS: {
    name: "UPDATE_PERMISSIONS",
    description: "Allows the user to update existing permissions",
  },
  VIEW_PERMISSIONS: {
    name: "VIEW_PERMISSIONS",
    description:
      "Allows the user to view the list of permissions and their details",
  },
  VIEW_ROLES: {
    name: "VIEW_ROLES",
    description: "Allows the user to view the list of roles and their details",
  },
  DELETE_ROLES: {
    name: "DELETE_ROLE",
    description: "Allows the user to delete roles from the system",
  },
  VIEW_ADMIN_DASHBOARD: {
    name: "VIEW_ADMIN_DASHBOARD",
    description:
      "Allows the user to access the admin dashboard and view overall statistics and management options",
  },
};
export default appPermissions;
