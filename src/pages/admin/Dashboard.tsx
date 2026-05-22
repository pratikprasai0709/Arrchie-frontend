import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { 
  DollarSign, 
  ShoppingBag, 
  ClipboardList, 
  Users, 
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { token } = useAuth();
  
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    // Parallel fetch system metrics data
    Promise.all([
      fetch('/api/products').then((res) => res.json()),
      fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
      fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
    ])
      .then(([productsData, ordersData, usersData]) => {
        if (Array.isArray(productsData)) setProducts(productsData);
        if (Array.isArray(ordersData)) setOrders(ordersData);
        if (Array.isArray(usersData)) setUsers(usersData);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error fetching admin stats:', e);
        setLoading(false);
      });
  }, [token]);

  // Metric Math
  const totalRevenues = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const outOfStockModels = products.filter((p) => p.stockQuantity <= 0).length;
  const totalStockItemsCount = products.reduce((acc, p) => acc + p.stockQuantity, 0);

  const stats = [
    {
      label: 'Gross Revenue',
      value: `$${totalRevenues.toFixed(2)}`,
      subtext: 'Accumulated secure orders net',
      icon: DollarSign,
    },
    {
      label: 'Orders Placed',
      value: String(orders.length),
      subtext: 'Checkout completions matched',
      icon: ClipboardList,
    },
    {
      label: 'Products Managed',
      value: String(products.length),
      subtext: `${totalStockItemsCount} units in stock`,
      icon: ShoppingBag,
    },
    {
      label: 'Registered Users',
      value: String(users.length),
      subtext: 'B2B/B2C accounts active',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-10 overflow-y-auto">
        
        {/* Banner header title */}
        <div className="border-b border-[#E8E6E1] pb-4">
          <span className="text-[10px] font-bold text-[#A29F98] uppercase tracking-[0.2em] block mb-1">Administrative Matrix</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] italic">
            Business Administration Panel
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1 font-sans">
            E-Commerce system inventory control and core catalog management console.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-28 bg-white border border-[#E8E6E1] rounded-none animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Stats widgets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((st, idx) => {
                const Icon = st.icon;
                return (
                  <motion.div
                    key={st.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 bg-white border border-[#E8E6E1] rounded-none shadow-none relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 focus:outline-hidden">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#A29F98] block">{st.label}</span>
                        <h2 className="text-2xl font-serif font-black text-[#1A1A1A]">{st.value}</h2>
                      </div>
                      <div className="p-2.5 bg-[#FAF9F6] border border-[#E8E6E1] text-[#1A1A1A] rounded-none shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-[9px] uppercase tracking-wider font-bold text-stone-400 mt-4">{st.subtext}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick alert bar if stock is low or empty */}
            {outOfStockModels > 0 && (
              <div className="p-5 bg-white border border-[#1A1A1A] rounded-none flex items-start gap-4 text-xs leading-relaxed text-stone-500 font-light">
                <AlertTriangle className="w-5 h-5 text-[#1A1A1A] shrink-0" />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-[#1A1A1A]">Inventory Warning Trace: Stock Depleted</h4>
                  <p className="mt-1">
                    There are currently <span className="font-bold text-[#1A1A1A]">{outOfStockModels} flask models</span> indicating completely empty inventory counts (0 items). Customers are blocked from ordering these items in frontends until stock is replenished.
                  </p>
                </div>
              </div>
            )}

            {/* Recent Orders List teaser */}
            <div className="bg-white border border-[#E8E6E1] rounded-none p-8 shadow-none space-y-6">
              <h3 className="font-bold text-xs uppercase tracking-widest text-[#1A1A1A]">Recent Transactions Log</h3>
              {orders.length === 0 ? (
                <p className="text-xs text-stone-500 font-light">No checkout transactions received yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E8E6E1] text-[#A29F98] font-bold uppercase tracking-wider text-[9px]">
                        <th className="pb-3 px-1">Order Invoice</th>
                        <th className="pb-3">Customer Name</th>
                        <th className="pb-3 text-right">Amount</th>
                        <th className="pb-3 pl-6">Shipping Destination</th>
                        <th className="pb-3 text-right">Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E6E1]/50 text-stone-600 font-light">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord._id} className="hover:bg-[#FAF9F6] transition-colors">
                          <td className="py-4 px-1 font-mono text-stone-400 text-[11px]">#{ord._id.substring(ord._id.length - 8).toUpperCase()}</td>
                          <td className="py-4 font-bold text-[#1A1A1A]">{ord.customerName}</td>
                          <td className="py-4 font-serif font-black text-[#1A1A1A] text-right">${ord.totalAmount.toFixed(2)}</td>
                          <td className="py-4 pl-6 truncate max-w-[150px]">{ord.shippingAddress.address}, {ord.shippingAddress.city}</td>
                          <td className="py-4 text-right">
                            <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-none ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-805 border border-emerald-250'
                                : ord.orderStatus === 'Processing'
                                ? 'bg-white text-stone-800 border border-[#1A1A1A]'
                                : 'bg-[#FAF9F6] text-stone-700 border border-[#E8E6E1]'
                            }`}>
                              {ord.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
