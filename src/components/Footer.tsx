import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-[#1A1A1A] border-t border-[#E8E6E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Presentation */}
          <div className="md:col-span-1 space-y-4">
            <span className="font-serif font-black text-2xl tracking-tighter text-[#1A1A1A] block">
              AERO<span className="text-[#A29F98]">.FLASK</span>
            </span>
            <p className="text-xs text-[#555] leading-relaxed font-sans">
              Designing premium, non-toxic, eco-conscious hydration flasks for active, sustainable, and modern lifestyles. Pure taste, perfect temperatures.
            </p>
          </div>

          {/* Quick links catalog navigation */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-4">
              Explore Products
            </h4>
            <ul className="space-y-2 text-xs text-[#555]">
              <li>
                <Link to="/products?category=Glass" className="hover:text-black transition-colors border-b border-transparent hover:border-black">
                  Pure Borosilicate Glass
                </Link>
              </li>
              <li>
                <Link to="/products?category=Steel" className="hover:text-black transition-colors border-b border-transparent hover:border-black">
                  Insulated Stainless Steel
                </Link>
              </li>
              <li>
                <Link to="/products?category=Plastic" className="hover:text-black transition-colors border-b border-transparent hover:border-black">
                  BPA-Free Tritan Copolyester
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-black transition-colors border-b border-transparent hover:border-black">
                  View Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Values / Support */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-4">
              Our Guarantee
            </h4>
            <ul className="space-y-2.5 text-xs text-[#555]">
              <li className="flex items-center gap-2 focus:outline-hidden">
                <Sparkles className="w-3 h-3 text-[#A29F98] shrink-0" />
                100% BPA & BPS Free
              </li>
              <li className="flex items-center gap-2 focus:outline-hidden">
                <Sparkles className="w-3 h-3 text-[#A29F98] shrink-0" />
                No Sweat Powder Coat
              </li>
              <li className="flex items-center gap-2 focus:outline-hidden">
                <Sparkles className="w-3 h-3 text-[#A29F98] shrink-0" />
                Eco-Friendly Recycled Metal
              </li>
              <li className="flex items-center gap-2 focus:outline-hidden">
                <Sparkles className="w-3 h-3 text-[#A29F98] shrink-0" />
                Triple-Lock Leakproof Cap
              </li>
            </ul>
          </div>

          {/* Direct Support Contacts */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-4">
              Contact AeroSupport
            </h4>
            <div className="space-y-3 text-xs text-[#555]">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#A29F98] shrink-0" />
                <span className="truncate">support@aeroflask.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#A29F98] shrink-0" />
                <span>+1 (234) 567-890</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#A29F98] shrink-0 mt-0.5" />
                <span>Silicon Valley Headquarters, San Francisco, CA</span>
              </p>
            </div>
          </div>

        </div>

        {/* Cohesive copyright line at bottom */}
        <div className="mt-16 pt-8 border-t border-[#E8E6E1] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase font-bold tracking-widest text-[#A29F98]">
          <p>© 2026 AeroFlask Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 font-normal tracking-wide text-stone-500 hover:text-[#1A1A1A] transition-colors">
            Premium hydration line. Engineered for modern performance.
          </p>
        </div>
      </div>
    </footer>
  );
}
