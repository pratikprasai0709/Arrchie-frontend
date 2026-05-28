import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Sparkles, 
  ShieldAlert, 
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastErr, setToastErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setActiveImage(data.productImage);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error fetching product detail:', e);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-[#FAF9F6]">
        <div className="w-8 h-8 rounded-none border-t-2 border-r-2 border-black animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#A29F98]">Retrieving flask details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-12 bg-white border border-[#E8E6E1] rounded-none">
        <p className="text-xs text-stone-505 uppercase tracking-wide leading-relaxed mb-6">
          The requested product model is missing or was removed by the administrator.
        </p>
        <Link to="/products" className="px-6 py-3 bg-[#1A1A1A] text-white rounded-none text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">
          Browse Active Catalog
        </Link>
      </div>
    );
  }

  const handleQtyAdjust = (offset: number) => {
    const newVal = quantity + offset;
    if (newVal >= 1 && newVal <= product.stockQuantity) {
      setQuantity(newVal);
    }
  };

  const handleAddToCart = () => {
    const res = addToCart(product, quantity);
    if (res.success) {
      setToastMsg(res.message);
      setTimeout(() => setToastMsg(null), 3000);
    } else {
      setToastErr(res.message);
      setTimeout(() => setToastErr(null), 3500);
    }
  };

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FAF9F6]">
      
      {/* Dynamic Toast Alert Header */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 inset-x-4 max-w-md mx-auto z-50 bg-[#1A1A1A] border border-[#E8E6E1] text-white p-4 rounded-none shadow-xl flex items-center gap-3"
          >
            <div className="p-1 border border-white/20">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest flex-1">{toastMsg}</p>
          </motion.div>
        )}
        {toastErr && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 inset-x-4 max-w-md mx-auto z-50 bg-red-650 border border-[#E8E6E1] text-white p-4 rounded-none shadow-xl flex items-center gap-3"
          >
            <div className="p-1 border border-white/20">
              <ShieldAlert className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest flex-1">{toastErr}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back breadcrumb */}
      <div>
        <Link 
          to="/products"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Flask catalog
        </Link>
      </div>

      {/* Main product card detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Large Product Image Preview Box & Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square border border-[#E8E6E1] p-4 bg-white rounded-none">
            <img 
              src={activeImage || product.productImage} 
              alt={product.name} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Tag Overlay */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-1 focus:outline-hidden">
              <span className="px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase text-[#555] bg-white border border-[#E8E6E1] rounded-none">
                {product.material} Build
              </span>
            </div>
          </div>
          
          {/* Multiple Images Thumbnail Gallery */}
          {product.productImages && product.productImages.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {product.productImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 border p-1 bg-white cursor-pointer transition-all focus:outline-hidden ${
                    activeImage === imgUrl ? 'border-black opacity-100' : 'border-[#E8E6E1] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} gallery ${index + 1}`}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Specifications detail text & purchase triggers */}
        <div className="space-y-8">
          <div>
            <span className="text-[10px] font-bold text-[#A29F98] uppercase tracking-[0.25em] mb-2 block">
              Premium {product.brand} Collection
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-[#1A1A1A] italic leading-tight">
              {product.name}
            </h1>
            
            {/* Stock Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-[9px] font-mono rounded-none bg-white border border-[#E8E6E1] text-[#666]">
                Cap: {product.capacity}
              </span>
              
              {isOutOfStock ? (
                <span className="px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase text-white bg-red-650 rounded-none">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase text-white bg-black rounded-none animate-pulse">
                  Only {product.stockQuantity} Left!
                </span>
              ) : (
                <span className="px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase text-[#1A1A1A] bg-[#FAF9F6] border border-[#E8E6E1] rounded-none">
                  In Stock ({product.stockQuantity})
                </span>
              )}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-6 bg-white border border-[#E8E6E1] rounded-none flex items-center justify-between shadow-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A29F98]">Individual Retail Release</span>
            <span className="text-3xl font-serif font-black text-[#1A1A1A]">
              Rs. {product.price.toFixed(2)}
            </span>
          </div>

          {/* Core description text */}
          <div className="space-y-2">
            <h3 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">
              Meticulous Overview
            </h3>
            <p className="text-sm text-[#555] font-light leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Custom specifications grid */}
          <div className="grid grid-cols-2 gap-6 border-t border-b border-[#E8E6E1] py-6">
            <div>
              <span className="text-[9px] text-[#A29F98] font-bold uppercase tracking-widest block">Fluid Capacity</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mt-1 block">{product.capacity}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#A29F98] font-bold uppercase tracking-widest block">Body Material</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mt-1 block">{product.material}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#A29F98] font-bold uppercase tracking-widest block">Model Group</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mt-1 block">{product.category} Series</span>
            </div>
            <div>
              <span className="text-[9px] text-[#A29F98] font-bold uppercase tracking-widest block">Environmental Health</span>
              <span className="text-xs font-bold uppercase tracking-wider mt-1 text-[#1A1A1A] flex items-center gap-1.5 leading-none">
                <Sparkles className="w-3.5 h-3.5 text-[#A29F98]" />
                100% BPA Free
              </span>
            </div>
          </div>

          {/* Adjust item and purchase button block */}
          {(!isOutOfStock && user?.role !== 'admin') && (
            <div className="space-y-4 pt-2">
              <span className="text-[9px] font-bold text-[#A29F98] uppercase tracking-widest block">
                Select Purchase Quantity
              </span>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity Toggle counter */}
                <div className="flex items-center border border-[#E8E6E1] rounded-none bg-white p-2">
                  <button
                    onClick={() => handleQtyAdjust(-1)}
                    disabled={quantity <= 1}
                    className="p-1 px-3 text-[#1A1A1A] hover:bg-[#FAF9F6] disabled:opacity-25"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-5 text-sm font-bold text-[#1A1A1A] font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQtyAdjust(1)}
                    disabled={quantity >= product.stockQuantity}
                    className="p-1 px-3 text-[#1A1A1A] hover:bg-[#FAF9F6] disabled:opacity-25"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Main purchase button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-none shadow-none cursor-pointer transition-all duration-300"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Shopping Cart
                </button>
              </div>
            </div>
          )}

          {/* Eco promise callout */}
          <div className="p-5 bg-white border border-[#1A1A1A] rounded-none flex items-start gap-4">
            <span className="text-stone-700 text-sm mt-0.5">🌎</span>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">Our Carbon Impact Promise</h4>
              <p className="text-xs text-stone-500 font-light leading-relaxed mt-1">
                Each AeroFlask order funds local coastal ocean cleanup teams to remove 100g of plastic trash from estuaries and marine reserves globally.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
