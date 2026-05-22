import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  PlusCircle, 
  Package, 
  Boxes, 
  ClipboardList, 
  Users, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    {
      to: '/admin/dashboard',
      label: 'Stats & Overview',
      icon: BarChart3,
    },
    {
      to: '/admin/add-product',
      label: 'Add Flask Model',
      icon: PlusCircle,
    },
    {
      to: '/admin/manage-products',
      label: 'Product Catalog',
      icon: Package,
    },
    {
      to: '/admin/inventory',
      label: 'Inventory Control',
      icon: Boxes,
    },
    {
      to: '/admin/orders',
      label: 'Customer Orders',
      icon: ClipboardList,
    },
    {
      to: '/admin/users',
      label: 'User Base',
      icon: Users,
    },
  ];

  return (
    <div className="bg-[#1A1A1A] text-[#FAF9F6] w-full md:w-64 shrink-0 flex flex-col md:min-h-screen border-r border-[#2C2A29]">
      
      {/* Title block */}
      <div className="p-6 border-b border-[#2C2A29] flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
            Control Panel
          </h2>
          <span className="text-xs font-serif italic text-white mt-1 block">
            System Administrator
          </span>
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = path === link.to;

          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center justify-between px-3.5 py-3 rounded-none text-[10px] font-bold uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? 'bg-[#2C2A29] text-white border-l-2 border-[#FAF9F6]'
                  : 'text-stone-400 hover:text-white hover:bg-[#2C2A29]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                <span>{link.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
            </Link>
          );
        })}
      </nav>

      {/* Back to Client Web */}
      <div className="p-4 border-t border-[#2C2A29]">
        <Link
          to="/"
          className="flex items-center gap-2 justify-center w-full px-4 py-3 rounded-none text-[10px] font-bold uppercase tracking-widest text-[#FAF9F6] bg-[#2C2A29] hover:bg-[#3E3A39] transition-all border border-[#3E3A39]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back Component
        </Link>
      </div>

    </div>
  );
}
