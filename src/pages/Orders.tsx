import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { Link } from 'react-router-dom';
import { ClipboardList, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch('/api/orders/my-orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 bg-[#FAF9F6]">
        <div className="w-8 h-8 rounded-none border-t-2 border-r-2 border-black animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#A29F98]">Compiling order records...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-12 text-center bg-white border border-[#E8E6E1] rounded-none space-y-6">
        <div className="inline-flex p-4 bg-[#FAF9F6] border border-[#E8E6E1] rounded-none text-stone-500">
          <ClipboardList className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 focus:outline-hidden">
          <h2 className="text-xl font-serif font-bold text-gray-950 italic">No Orders Logged</h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed font-light">
            You haven't placed any hydration purchases yet. Browse the catalog and place an order to get started!
          </p>
        </div>
        <Link 
          to="/products"
          className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-none text-[10px] font-bold uppercase tracking-widest transition-colors inline-block"
        >
          Check out Active Models
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 bg-[#FAF9F6]">
      
      <div className="border-b border-[#E8E6E1] pb-4">
        <span className="text-[10px] font-bold text-[#A29F98] uppercase tracking-[0.2em] block mb-1">Purchasing Records</span>
        <h1 className="text-3.5xl font-serif text-[#1A1A1A] italic">
          Hydration Orders History
        </h1>
        <p className="text-xs text-stone-500 font-light mt-1">
          Review shipping times and active shipment states.
        </p>
      </div>

      <div className="space-y-8">
        {orders.map((order) => {
          const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
            <motion.div 
              key={order._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#E8E6E1] rounded-none overflow-hidden shadow-none hover:border-[#1A1A1A] transition-all space-y-6 p-6 sm:p-8"
            >
              {/* Header: order date and status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6E1] pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#FAF9F6] border border-[#E8E6E1] text-[#1A1A1A] rounded-none shrink-0">
                    <Calendar className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">
                      Invoice ID: #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5 font-light">
                      Placed on {orderDate}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Status:</span>
                  <span className={`px-3 py-1 rounded-none text-[9px] font-bold uppercase tracking-wider ${
                    order.orderStatus === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-805 border border-emerald-200'
                      : order.orderStatus === 'Processing'
                      ? 'bg-white text-stone-800 border border-[#1A1A1A]'
                      : 'bg-[#FAF9F6] text-stone-700 border border-[#E8E6E1]'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Body: Items list */}
              <div className="space-y-4 pt-1 divide-y divide-[#E8E6E1]/50">
                {order.items.map((item, idx) => (
                  <div key={item.productId} className={`flex items-center gap-4 ${idx > 0 ? 'pt-4' : ''}`}>
                    <div className="w-12 h-12 bg-[#FAF9F6] rounded-none border border-[#E8E6E1] p-1 overflow-hidden shrink-0">
                      <img src={item.productImage} alt={item.name} className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold uppercase tracking-tight text-[#1A1A1A] truncate pr-4">{item.name}</h4>
                      <span className="text-[10px] text-stone-500 mt-1 block uppercase tracking-wider">Qty {item.quantity}x @ Rs. {item.price.toFixed(2)} each</span>
                    </div>
                    <span className="text-sm font-serif font-bold text-[#1A1A1A] shrink-0">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Footer: delivery details and totals */}
              <div className="pt-4 border-t border-[#E8E6E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left space-y-1 text-xs">
                  <p className="flex items-center gap-1.5 text-[#555] font-light">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate max-w-[280px]">
                      Delivered to: {order.shippingAddress.address}, {order.shippingAddress.city}
                    </span>
                  </p>
                  <p className="text-stone-400 font-light text-[11px] pl-5">
                    Contact: {order.shippingAddress.phone}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold text-[#A29F98] uppercase tracking-wider block">Total Paid</span>
                  <span className="text-lg font-serif font-black text-[#1A1A1A] block mt-0.5">
                    Rs. {order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
