import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Flame, ShieldCheck, Zap, Scale, Gift } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        // Take the first 3 items as featured models
        if (Array.isArray(data)) {
          setFeatured(data.slice(0, 3));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching featured products:', err);
        setLoading(false);
      });
  }, []);

  const categories = [
    {
      name: 'Glass',
      description: 'Zero metallic taste. Pure borosilicate elegance.',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Steel',
      description: 'Double-wall thermal control. Steaming hot or ice-cold.',
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Plastic',
      description: 'Ultralight shatterproof Tritan. Engineered for adventure.',
      image: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <div className="space-y-20 pb-20 bg-[#FAF9F6]">
      
      {/* 1. Stunning Hero Block */}
      <section className="relative bg-white border border-[#E8E6E1] border-t-0 mx-4 sm:mx-6 lg:mx-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center border-r-0 lg:border-r border-[#E8E6E1]"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#A29F98] mb-6 block">
              Premium Series / 01
            </span>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl leading-[0.9] font-serif font-medium tracking-tighter mb-8 italic text-[#1A1A1A]">
              Refined<br/>Hydration.
            </h1>
            
            <p className="text-sm sm:text-base text-[#555] font-light leading-relaxed mb-10 max-w-xl">
              Meet AeroFlask: meticulously crafted vessels engineered with aerospace-grade vacuum performance, pure flavor extraction, and organic eco-conscious profiles designed for sustainable, modern hydration.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-black transition-all rounded-none shadow-none"
              >
                Explore Full Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#categories-section"
                className="inline-flex items-center gap-2 px-7 py-4 text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] bg-white border border-[#E8E6E1] hover:bg-[#FAF9F6] transition-all rounded-none"
              >
                Browse Materials
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:col-span-5 lg:flex flex-col justify-between p-8 sm:p-12 bg-white"
          >
            <div className="aspect-[3/4] bg-[#FAF9F6] border border-[#E8E6E1] p-3 flex flex-col justify-between group overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600"
                alt="Premium Steel Flask" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 max-h-[350px]"
                referrerPolicy="no-referrer"
              />
              <div className="pt-4 border-t border-[#E8E6E1] flex justify-between items-end">
                <div>
                  <span className="text-amber-700 text-[9px] font-bold uppercase tracking-wider block mb-0.5">BEST SELLER</span>
                  <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">Element Copper Thermo</h3>
                </div>
                <span className="text-[10px] font-mono font-medium text-stone-500">KEPT CHILLED 24H</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Brand highlights bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4 p-6 bg-white border border-[#E8E6E1] rounded-none">
            <div className="p-2.5 border border-[#E8E6E1] bg-[#FAF9F6] text-[#1A1A1A] shrink-0 rounded-none">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">Vacuum Thermal Shield</h4>
              <p className="text-xs text-[#666] leading-relaxed mt-1 font-sans font-light">Dual-layer copper insulation holds chill for full day cycles.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-[#E8E6E1] rounded-none">
            <div className="p-2.5 border border-[#E8E6E1] bg-[#FAF9F6] text-[#1A1A1A] shrink-0 rounded-none">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">100% Toxin-Free</h4>
              <p className="text-xs text-[#666] leading-relaxed mt-1 font-sans font-light">Pure Tritan and medical-grade steel block micro-contaminants.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-[#E8E6E1] rounded-none">
            <div className="p-2.5 border border-[#E8E6E1] bg-[#FAF9F6] text-[#1A1A1A] shrink-0 rounded-none">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">Featherweight</h4>
              <p className="text-xs text-[#666] leading-relaxed mt-1 font-sans font-light">Optimized walls mean 30% reduction in weight for active use.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-white border border-[#E8E6E1] rounded-none">
            <div className="p-2.5 border border-[#E8E6E1] bg-[#FAF9F6] text-[#1A1A1A] shrink-0 rounded-none">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">Lifecycle Promise</h4>
              <p className="text-xs text-[#666] leading-relaxed mt-1 font-sans font-light">Durable architectural finishes replace up to 5,000 single-use plastics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Matrix section */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-md mx-auto space-y-2">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#A29F98] uppercase">Materials Overview</span>
          <h2 className="text-2xl font-serif text-[#1A1A1A] tracking-tight italic">Structured by Material Purpose</h2>
          <div className="w-12 h-[1px] bg-[#E8E6E1] mx-auto my-3"></div>
          <p className="text-xs text-stone-500">Pick the build properties tailored perfectly to your daily environmental routines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name}
              to={`/products?material=${cat.name}`}
              className="group relative bg-white border border-[#E8E6E1] p-8 hover:border-[#1A1A1A] transition-all duration-500 rounded-none flex flex-col justify-between aspect-video md:aspect-[4/3] cursor-pointer"
            >
              {/* Background illustrative bottle snippet */}
              <div className="absolute right-0 bottom-0 w-32 h-32 opacity-25 group-hover:opacity-40 rounded-none overflow-hidden transition-all duration-500 bg-[#FAF9F6] border-t border-l border-[#E8E6E1] p-1.5">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="z-10">
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#A29F98] block mb-1">
                  Premium Series
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1A1A1A] group-hover:translate-x-1 transition-transform duration-300">{cat.name}</h3>
                <p className="text-xs text-[#555] mt-1.5 max-w-[180px] leading-relaxed font-sans font-light">{cat.description}</p>
              </div>

              <div className="mt-8 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] group-hover:text-black transition-colors z-10">
                Browse Collection
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Home Featured Products Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-[#E8E6E1] pb-4">
          <div>
            <span className="text-[10px] font-bold text-[#A29F98] uppercase tracking-[0.2em]">Top Rated Hydration</span>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mt-1 italic">Featured Bottle Models</h2>
          </div>
          <Link 
            to="/products"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-stone-600 transition-colors"
          >
            All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-[#E8E6E1] h-96 bg-white animate-pulse"></div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#E8E6E1] rounded-none">
            <p className="text-stone-500 text-xs uppercase tracking-wider">No products added yet. Visit Admin Panel to seed initial inventory!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((product) => (
              <div key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Sleek design testimonials banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#1A1A1A] p-8 sm:p-12 rounded-none flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 font-bold">LASER ENGRAVING SOLUTIONS</span>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1A1A1A] italic">
              Need custom team laser engravings?
            </h3>
            <p className="text-xs text-[#555] leading-relaxed font-sans font-light">
              Provide corporate identification or fitness clubs alignment models. We offer tailored precision-machined logo laser engraving for volume orders of 25+ flasks.
            </p>
          </div>
          <Link 
            to="/products"
            className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-black transition-all text-center shrink-0 rounded-none border border-transparent"
          >
            Explore Corporate Catalog
          </Link>
        </div>
      </section>

    </div>
  );
}
