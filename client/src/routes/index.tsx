import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/storeHook'; 
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';
import Home from '../pages/home';
import Cart from '../pages/cartPage';
import AdminLayout from '../components/admin/adminLayout'; 
import ProtectedAdminRoute from '../components/admin/protectedAdminRoute'; 
import AdminDashboard from '../pages/admin/adminDashboard'; 
import Categories from '../pages/admin/adminCategory';
import Products from '../pages/admin/adminProduct';
import ProductDetail from '../pages/productDetail';
import Users from '../pages/admin/adminUserDisplay';
import Orders from '../pages/orderPage';
import AdminOrders from '../pages/admin/adminOrder';
import UserProfile from '../pages/userProfile';
import AboutPage from '../pages/aboutPage';
import ContactPage from '../pages/contactPage';

const AppRoutes = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    return (
        <Routes>
            {/*Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />


            {/* Auth Routes */}
            <Route 
                path="/login" 
                element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} 
            />
            <Route 
                path="/register" 
                element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} 
            />
            

            {/* Protected Cart Route: Redirect to login if not authenticated */}
            <Route 
                path="/cart" 
                element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} 
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<UserProfile />} />

            {/* Admin Section routes */}
            <Route element={<ProtectedAdminRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/add-category" element={<Categories />} />
                    <Route path="/admin/products" element={<Products />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;