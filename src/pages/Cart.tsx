import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, AlertTriangle, ArrowRight, ShieldCheck, ShoppingBag, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shipping = subtotal >= 50 ? 0 : subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.0825; // 8.25% Sales tax
  const grandTotal = subtotal + shipping + tax;

  const handleCheckoutRedirect = () => {
    if (!user) {
      // Direct unauthorized user to Sign In page first
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 px-4 text-center space-y-6 bg-white border border-[#E8E6E1] p-12 rounded-none">
        <div className="inline-flex p-4 bg-[#FAF9F6] border border-[#E8E6E1] rounded-none text-stone-700">
          <ShoppingBag className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-gray-950 tracking-tight italic">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed font-light">
            You haven't added any AeroFlask hydration bottles to your shopping basket yet. Let's find your perfect model!
          </p>
        </div>

        <Link 
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-black transition-all text-center rounded-none"
        >
          Explore Active Catalog
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF9F6]">
      
      <div className="border-b border-[#E8E6E1] pb-4">
        <span className="text-[10px] font-bold text-[#A29F98] uppercase tracking-[0.2em] block mb-1">Your Basket</span>
        <h1 className="text-3.5xl font-serif text-[#1A1A1A] italic">
          Shopping Basket
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart items list ledger */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const prod = item.product;
            const isAtMax = item.quantity >= prod.stockQuantity;

            return (
              <motion.div 
                key={prod._id}
                layout
                className="flex items-center gap-5 p-5 bg-white border border-[#E8E6E1] rounded-none shadow-none"
              >
                {/* Thumb image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FAF9F6] border border-[#E8E6E1] rounded-none overflow-hidden shrink-0 p-1">
                  <img 
                    src={prod.productImage} 
                    alt={prod.name} 
                    className="w-full h-full object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info titles */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold text-[#A29F98] uppercase tracking-widest block">
                    {prod.brand}
                  </span>
                  <Link 
                    to={`/products/${prod._id}`}
                    className="text-xs sm:text-sm font-bold uppercase tracking-tight text-[#1A1A1A] hover:text-stone-600 transition-colors block mt-1 focus:outline-hidden"
                  >
                    {prod.name}
                  </Link>
                  <p className="text-[10px] text-stone-500 mt-1 font-light">
                    Cap: {prod.capacity} • {prod.material}
                  </p>
                  
                  {/* Warning label if inventory upper limit is touched */}
                  {isAtMax && (
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-red-50 border border-red-100 rounded-none text-[9px] font-bold uppercase tracking-wide text-red-800 animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      Stock limit reached
                    </span>
                  )}
                </div>

                {/* Actions: change qty, trash, pricing */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-right shrink-0">
                  {/* Adjust buttons */}
                  <div className="flex items-center border border-[#E8E6E1] rounded-none bg-[#FAF9F6] p-1 h-fit">
                    <button
                      onClick={() => updateQuantity(prod._id, item.quantity - 1)}
                      className="p-1 px-2 text-stone-500 hover:text-black transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(prod._id, item.quantity + 1)}
                      disabled={isAtMax}
                      className="p-1 px-2 text-stone-500 hover:text-black transition-colors disabled:opacity-20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Calculations & Remove */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-serif font-bold text-[#1A1A1A] min-w-[70px]">
                      Rs. {(prod.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(prod._id)}
                      className="p-2 border border-[#E8E6E1] bg-white rounded-none text-stone-400 hover:text-black hover:border-black transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Right Cart pricing breakdown and triggers */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 border border-[#E8E6E1] rounded-none space-y-6 shadow-none">
            <h3 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-widest border-b border-[#E8E6E1] pb-3">Order Summary</h3>

            <div className="space-y-3 text-xs text-stone-500 border-b border-[#E8E6E1] pb-5 font-light">
              <div className="flex justify-between">
                <span>Total Items ({getCartItemCount()})</span>
                <span className="font-bold text-[#1A1A1A] font-mono">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Estimated Shipping</span>
                {shipping === 0 ? (
                  <span className="text-emerald-800 font-bold uppercase text-[9px] bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-none">
                    FREE SHIPPING
                  </span>
                ) : (
                  <span className="font-bold text-[#1A1A1A] font-mono">Rs. {shipping.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Estimated Taxes (8.25%)</span>
                <span className="font-bold text-[#1A1A1A] font-mono">Rs. {tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end pt-1">
              <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Estimated Total</span>
              <span className="text-2xl font-serif font-black text-[#1A1A1A]">
                Rs. {grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Minimum free shipping motivation tracker */}
            {subtotal < 50 && (
              <p className="text-[10px] text-[#A29F98] leading-relaxed bg-[#FAF9F6] border border-[#E8E6E1] p-3 rounded-none italic font-light">
                💡 Add <span className="font-bold text-[#1A1A1A] font-mono">Rs. {(50 - subtotal).toFixed(2)}</span> more to unlock <span className="font-bold text-emerald-800 uppercase text-[9px]">Free Shipping</span>!
              </p>
            )}

            <button
              onClick={handleCheckoutRedirect}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-none shadow-none cursor-pointer transition-all duration-300"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Reassuring note */}
            <p className="text-[9px] uppercase tracking-widest font-bold text-[#A29F98] text-center flex items-center justify-center gap-1.5 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#A29F98] shrink-0" />
              Secure Encrypted Core
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
