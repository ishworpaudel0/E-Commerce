const appRoles = {
    Super_Admin: {
        name: "Super_Admin",
        description: "Has all permissions and can manage everything." 
    },
    Admin: {
        name: "Admin",
        description: "Can manage users, products, and orders but cannot manage other admins or super admins."   
    },
    User: {
        name: "User",
        description: "Can view products and place orders but cannot manage users or products." 
    }
}
export default appRoles;