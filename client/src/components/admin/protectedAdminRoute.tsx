import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/storeHook";

const ProtectedAdminRoute = () => {
  const { isAuthenticated, roles } = useAppSelector((state) => state.auth);

  const isAdmin = roles.some((role) => {
    const roleName = typeof role === "string" ? role : (role as any).name;
    return roleName === "Admin" || roleName === "Super_Admin";
  });

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default ProtectedAdminRoute;
