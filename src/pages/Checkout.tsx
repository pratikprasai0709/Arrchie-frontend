import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShieldCheck, ClipboardCheck, Truck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.0825;
  const grandTotal = subtotal + shipping + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!address || !city || !zipCode || !phone) {
      setErrorMsg('Please specify complete shipping details for your delivery.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Build payload
    const itemsPayload = cartItems.map((ci) => ({
      productId: ci.product._id,
      name: ci.product.name,
      price: ci.product.price,
      quantity: ci.quantity,
      productImage: ci.product.productImage,
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: itemsPayload,
          shippingAddress: {
            address,
            city,
            zipCode,
            phone,
          },
          totalAmount: grandTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Failed to place order. Please review your stock levels.');
        setLoading(false);
        return;
      }

      // Success! Clear state
      clearCart();
      setOrderCompleted(true);
      setLoading(false);
    } catch (e) {
      setErrorMsg('A connection error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className="max-w-md mx-auto my-20 p-12 bg-white border border-[#E8E6E1] rounded-none text-center space-y-6">
        <div className="inline-flex p-4 border border-[#E8E6E1] bg-[#FAF9F6] text-[#1A1A1A]">
          <ClipboardCheck className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-gray-950 tracking-tight italic">
            Hydration Confirmed!
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed font-light">
            Thank you for buying AeroFlask! Your sustainable order went through successfully. We have instantly locked and started packing your units!
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link 
            to="/orders"
            className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest text-center rounded-none"
          >
            Track in My Orders
          </Link>
          <Link 
            to="/"
            className="w-full py-4 bg-white border border-[#E8E6E1] hover:bg-[#FAF9F6] text-stone-700 text-[10px] font-bold uppercase tracking-widest text-center rounded-none transition-colors"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-12 text-center bg-white border border-[#E8E6E1] rounded-none">
        <p className="text-stone-500 text-xs uppercase tracking-wider mb-6">Your basket is empty. Add a flask model first before checking out!</p>
        <Link to="/products" className="px-6 py-3 bg-[#1A1A1A] text-white rounded-none text-[10px] uppercase font-bold tracking-widest inline-block">
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF9F6]">
      
      <div>
        <Link 
          to="/cart"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#A29F98] hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Edit Shopping Basket
        </Link>
      </div>

      <div className="border-b border-[#E8E6E1] pb-4">
        <span className="text-[10px] font-bold text-[#A29F98] uppercase tracking-[0.2em] block mb-1">Shipping details</span>
        <h1 className="text-3.5xl font-serif text-[#1A1A1A] italic">
          Checkout Shipping
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Delivery form details */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-2 border-b border-[#E8E6E1] pb-3">
            <Truck className="w-4 h-4 text-[#1A1A1A]" />
            Address & Contact Details
          </h2>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-800 text-xs font-bold uppercase tracking-wider rounded-none">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#A29F98] uppercase tracking-wider block">
                Full Customer Name (Locked)
              </label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full px-3.5 py-3 text-xs bg-[#FAF9F6] text-stone-500 border border-[#E8E6E1] rounded-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#A29F98] uppercase tracking-wider block">
                Email Address (Locked)
              </label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-3 text-xs bg-[#FAF9F6] text-stone-500 border border-[#E8E6E1] rounded-none cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[9px] font-bold text-[#A29F98] uppercase tracking-wider block">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Ocean Parkway, Apt 4B"
                className="w-full px-3.5 py-3 text-xs bg-white border border-[#E8E6E1] rounded-none focus:outline-none focus:border-black transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#A29F98] uppercase tracking-wider block">
                City / Region State *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-3.5 py-3 text-xs bg-white border border-[#E8E6E1] rounded-none focus:outline-none focus:border-black transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#A29F98] uppercase tracking-wider block">
                Postal ZIP Code *
              </label>
              <input
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="94107"
                className="w-full px-3.5 py-3 text-xs bg-white border border-[#E8E6E1] rounded-none focus:outline-none focus:border-black transition-all"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[9px] font-bold text-[#A29F98] uppercase tracking-wider block">
                Active Contact Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (415) 555-0199"
                className="w-full px-3.5 py-3 text-xs bg-white border border-[#E8E6E1] rounded-none focus:outline-none focus:border-black transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white rounded-none text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 cursor-pointer transition-all duration-300"
          >
            {loading ? 'Securing Inventory & Packaging...' : 'Place My Secure Hydration Order'}
          </button>
        </form>

        {/* Right Side: Recap list summary elements */}
        <div className="lg:col-span-5 space-y-6 bg-white p-8 border border-[#E8E6E1] rounded-none shadow-none">
          <div className="space-y-4">
            <h3 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-widest border-b border-[#E8E6E1] pb-3">Order Basket Items</h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-[#E8E6E1] pr-2">
              {cartItems.map((ci) => (
                <div key={ci.product._id} className="flex gap-4 py-3.5 items-center">
                  <div className="w-12 h-12 border border-[#E8E6E1] bg-[#FAF9F6] rounded-none p-1 overflow-hidden shrink-0">
                    <img src={ci.product.productImage} alt={ci.product.name} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold uppercase tracking-tight text-[#1A1A1A] truncate">{ci.product.name}</h4>
                    <span className="text-[10px] text-stone-500 block uppercase tracking-wider pt-0.5">Qty {ci.quantity}x @ Rs. {ci.product.price.toFixed(2)}</span>
                  </div>
                  <span className="text-xs font-serif font-bold text-[#1A1A1A]">Rs. {(ci.product.price * ci.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-[#555] border-t border-[#E8E6E1] pt-5 font-light">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#1A1A1A] font-mono">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping fee</span>
                {shipping === 0 ? (
                  <span className="text-emerald-800 font-bold uppercase text-[9px] bg-emerald-50 px-2.5 py-0.5 border border-emerald-100 rounded-none">FREE</span>
                ) : (
                  <span className="font-bold text-[#1A1A1A] font-mono">Rs. {shipping.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Taxes (8.25%)</span>
                <span className="font-bold text-[#1A1A1A] font-mono">Rs. {tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-[#E8E6E1] pt-5">
              <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Grand Net Amount</span>
              <span className="text-xl font-serif font-black text-[#1A1A1A]">Rs. {grandTotal.toFixed(2)}</span>
            </div>

            {/* Reassuring note */}
            <p className="text-[9px] uppercase tracking-widest font-bold text-[#A29F98] text-center bg-[#FAF9F6] border border-[#E8E6E1] p-3 rounded-none flex items-center justify-center gap-1.5 pt-3">
              <ShieldCheck className="w-4 h-4 text-[#A19D97] shrink-0" />
              Fully compliant PCI standard core
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
