import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Frontend Storefront Views
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';

// Backend Administration Views
import AdminDashboard from './pages/admin/Dashboard';
import AddProduct from './pages/admin/AddProduct';
import ManageProducts from './pages/admin/ManageProducts';
import EditProduct from './pages/admin/EditProduct';
import Inventory from './pages/admin/Inventory';
import ManageOrders from './pages/admin/ManageOrders';
import UsersList from './pages/admin/Users';

function MainLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A]">
      {/* Omit standard navigation controls inside Admin workspaces for a seamless responsive feel */}
      {!isAdminRoute && <Navbar />}

      <div className={isAdminRoute ? "flex-1 flex flex-col" : "flex-1 max-w-7xl w-full mx-auto px-0 sm:px-4"}>
        <Routes>
          {/* User storefront routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute userOnly>
                <Cart />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute userOnly>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute userOnly>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute userOnly>
                <Orders />
              </ProtectedRoute>
            } 
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Administrative console routing */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/add-product" 
            element={
              <ProtectedRoute adminOnly>
                <AddProduct />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/manage-products" 
            element={
              <ProtectedRoute adminOnly>
                <ManageProducts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/edit-product/:id" 
            element={
              <ProtectedRoute adminOnly>
                <EditProduct />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/inventory" 
            element={
              <ProtectedRoute adminOnly>
                <Inventory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <ProtectedRoute adminOnly>
                <ManageOrders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute adminOnly>
                <UsersList />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>

      {/* Footer is omitted inside admin consoles too */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
