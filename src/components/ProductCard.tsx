import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Eye, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page when knocking button click
    const res = addToCart(product, 1);
    
    if (res.success) {
      setSuccessMsg(`Added 1x ${product.name}!`);
      setTimeout(() => setSuccessMsg(null), 2500);
    } else {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col bg-white border border-[#E8E6E1] rounded-none hover:border-[#1A1A1A] transition-all duration-300 group"
    >
      {/* Dynamic Alerts */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 focus:outline-hidden">
        {isOutOfStock ? (
          <span className="px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase text-white bg-red-600 rounded-none">
            Sold Out
          </span>
        ) : isLowStock ? (
          <span className="px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase text-white bg-[#1A1A1A] rounded-none animate-pulse">
            Only {product.stockQuantity} Left!
          </span>
        ) : (
          <span className="px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase text-[#555] bg-[#FAF9F6] border border-[#E8E6E1] rounded-none">
            {product.material}
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-0.5 text-[9px] font-mono font-medium text-[#666] bg-white/90 border border-[#E8E6E1] rounded-none">
          {product.capacity}
        </span>
      </div>

      {/* Image Block */}
      <Link to={`/products/${product._id}`} className="relative block aspect-square bg-[#FAF9F6] overflow-hidden cursor-pointer border-b border-[#E8E6E1]">
        <img
          src={product.productImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="p-2 border border-[#E8E6E1] bg-white rounded-none text-gray-700 hover:text-black hover:scale-105 transition-all">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </Link>

      {/* Content details */}
      <div className="p-5 flex-1 flex flex-col bg-white">
        <span className="text-[9px] font-bold tracking-[0.25em] text-[#A29F98] uppercase mb-1.5 inline-block">
          {product.brand}
        </span>
        <Link 
          to={`/products/${product._id}`} 
          className="text-sm font-bold uppercase tracking-tight text-[#1A1A1A] group-hover:text-stone-600 transition-colors mb-1.5 focus:outline-hidden"
        >
          {product.name}
        </Link>
        <p className="text-xs text-[#555] line-clamp-2 h-8 leading-relaxed mb-4 font-sans font-light">
          {product.description}
        </p>

        {/* Pricing & Add to Cart */}
        <div className="mt-auto pt-4 border-t border-[#E8E6E1] flex items-center justify-between">
          <span className="text-base font-serif font-bold text-[#1A1A1A]">
            Rs. {product.price.toFixed(2)}
          </span>
          
          {isOutOfStock ? (
            <button
              disabled
              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A29F98] bg-[#FAF9F6] border border-[#E8E6E1] rounded-none cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : user?.role === 'admin' ? (
            <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A29F98] bg-[#FAF9F6] border border-[#E8E6E1] rounded-none cursor-not-allowed">
              Admin View
            </span>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A] bg-white border border-[#E8E6E1] hover:bg-black hover:text-white transition-all duration-300 rounded-none cursor-pointer focus:outline-hidden"
            >
              <ShoppingCart className="w-3 h-3" />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Popup Notifications */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="absolute inset-x-2 bottom-2 bg-black border border-[#E8E6E1] text-white p-2.5 text-[10px] font-bold uppercase tracking-wider rounded-none text-center shadow-md z-20"
          >
            {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="absolute inset-x-2 bottom-2 bg-red-600 text-white p-2.5 text-[10px] font-bold uppercase tracking-wider rounded-none text-center shadow-md z-20"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
