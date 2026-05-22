import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, ShieldAlert, Award, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E8E6E1] shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 border border-[#E8E6E1] bg-white group-hover:bg-[#FAF9F6] transition-colors rounded-none">
                <ShoppingBag className="w-4 h-4 text-[#1A1A1A]" />
              </div>
              <span className="font-serif font-black text-2xl tracking-tighter text-[#1A1A1A]">
                AERO<span className="text-[#A29F98]">.FLASK</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[11px] font-bold uppercase tracking-widest text-[#666] hover:text-[#1A1A1A] transition-colors">
              Collection
            </Link>
            <Link to="/products" className="text-[11px] font-bold uppercase tracking-widest text-[#666] hover:text-[#1A1A1A] transition-colors">
              Explore Products
            </Link>
            
            {user && (
              <Link to="/orders" className="text-[11px] font-bold uppercase tracking-widest text-[#666] hover:text-[#1A1A1A] transition-colors">
                My Orders
              </Link>
            )}

            {/* Admin control panel link */}
            {user?.role === 'admin' && (
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] bg-white border border-[#E8E6E1] hover:bg-[#FAF9F6] transition-all rounded-none"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Button */}
            {user?.role !== 'admin' && (
              <Link 
                to="/cart" 
                className="relative p-2 text-[#666] hover:text-[#1A1A1A] hover:bg-[#FAF9F6] transition-all rounded-none"
              >
                <ShoppingCart className="w-4 h-4" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-mono font-medium">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>
            )}

            {/* User Session Interface */}
            {user ? (
              <div className="flex items-center space-x-4 border-l border-[#E8E6E1] pl-6">
                <Link to="/profile" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-black transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#E8E6E1] flex items-center justify-center text-[10px] font-bold text-[#1A1A1A]">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#666] hover:text-black rounded-none transition-all cursor-pointer"
                  title="Logout Account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 border-l border-[#E8E6E1] pl-6">
                <Link 
                  to="/login" 
                  className="text-[11px] font-bold uppercase tracking-widest text-[#666] hover:text-[#1A1A1A] transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-black transition-all rounded-none shadow-none"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex items-center md:hidden">
            {user?.role !== 'admin' && (
              <Link 
                to="/cart" 
                className="relative p-2 mr-2 text-[#666] hover:text-black transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-mono">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#666] hover:bg-[#FAF9F6] border border-[#E8E6E1] rounded-none transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-[#E8E6E1] bg-white"
          >
            <div className="px-3 pt-2 pb-5 space-y-1 sm:px-4">
              <Link 
                to="/" 
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[#666] hover:text-[#1A1A1A]"
              >
                Collection
              </Link>
              <Link 
                to="/products"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[#666] hover:text-[#1A1A1A]"
              >
                Explore Products
              </Link>
              {user && (
                <Link 
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[#666] hover:text-[#1A1A1A]"
                >
                  My Orders
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] bg-[#FAF9F6] border border-[#E8E6E1] rounded-none"
                >
                  Admin Control Panel
                </Link>
              )}

              {user ? (
                <div className="border-t border-[#E8E6E1] pt-3 mt-3">
                  <div className="px-3 py-2 flex items-center justify-between">
                    <Link 
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]"
                    >
                      <User className="w-4 h-4 text-[#666]" />
                      {user.name}
                    </Link>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#666] px-2 py-0.5 bg-[#FAF9F6] border border-[#E8E6E1]">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 mt-1 text-[11px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-[#E8E6E1] pt-4 mt-4 flex items-center space-x-3 px-3">
                  <Link 
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] border border-[#E8E6E1] rounded-none bg-white hover:bg-[#FAF9F6] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-[11px] font-bold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-black transition-colors rounded-none"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
