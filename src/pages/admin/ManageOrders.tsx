import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { ClipboardList, Check, ArrowRight, Truck, MapPin, Calendar, Boxes } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ManageOrders() {
  const { token } = useAuth();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders', {
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
      .catch((e) => {
        console.error('Error fetching admin orders list:', e);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!token) return;

    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error('Status saving failed');
      }

      setToastMsg(`Invoice #${orderId} marked as "${newStatus}"!`);
      setTimeout(() => setToastMsg(null), 3000);
      
      // Local state updater
      const updatedOrders = orders.map((o) =>
        o._id === orderId ? { ...o, orderStatus: newStatus } : o
      );
      setOrders(updatedOrders);

    } catch (e) {
      console.error(e);
      alert('Failed to modify transaction active delivery status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-10 overflow-y-auto animate-fade-in">
        
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-sans">
            Customer Fulfillment Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Audit checkout invoices and update transit statuses.
          </p>
        </div>

        {/* Status updates notifications */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-amber-500" />
              {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((n) => (
              <div key={n} className="h-44 bg-slate-900 border border-slate-805 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center p-12 bg-slate-900/50 border border-slate-805 rounded-3xl space-y-3">
            <ClipboardList className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="font-bold text-white text-sm">No Invoices Received</h3>
            <p className="text-xs text-slate-500 font-sans max-w-xs mx-auto">
              No customer orders have been logged in checkout databases yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div 
                  key={order._id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl"
                >
                  
                  {/* Top line ID & date & Status controller */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-405 shrink-0">
                        <Calendar className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold font-mono text-slate-505 uppercase tracking-wide">
                          INVOICE: #{order._id}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium block mt-0.5">
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    {/* Status Select Controller */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-505 font-mono">FLOW:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-hidden transition-all bg-slate-950 border border-slate-800 text-white cursor-pointer ${
                          order.orderStatus === 'Delivered'
                            ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20'
                            : order.orderStatus === 'Processing'
                            ? 'text-sky-400 border-sky-500/20 bg-sky-950/20'
                            : 'text-amber-400 border-amber-500/20 bg-amber-950/20'
                        }`}
                      >
                        <option value="Pending">Pending Shipment</option>
                        <option value="Processing">In Processing Transit</option>
                        <option value="Delivered">Mark Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Information detail bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-950 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block">Recipient Details</span>
                      <p className="font-semibold text-slate-100">{order.customerName}</p>
                      <p className="text-slate-400 text-[11px]">{order.customerEmail}</p>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl space-y-1">
                      <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block">Fulfillment Target</span>
                      <p className="font-medium text-slate-100 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{order.shippingAddress.address}, {order.shippingAddress.city}</span>
                      </p>
                      <p className="text-[11px] text-slate-450 font-medium pl-5">ZIP: {order.shippingAddress.zipCode} • Tel: {order.shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Items spec block */}
                  <div className="space-y-2 border-t border-slate-800/60 pt-4">
                    <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block mb-1">Items Dispatched</span>
                    {order.items.map((it: any) => (
                      <div key={it.productId} className="flex gap-3 py-1 items-center bg-slate-950/30 px-3 py-2 rounded-lg text-xs leading-normal">
                        <div className="w-8 h-8 rounded border border-slate-800 overflow-hidden shrink-0 bg-slate-950">
                          <img src={it.productImage} alt={it.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-slate-205 truncate">{it.name}</h5>
                          <span className="text-[10px] text-slate-400">Qty {it.quantity}x • Rs. {it.price.toFixed(2)}</span>
                        </div>
                        <span className="font-bold text-white font-mono">Rs. {(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal Total Row */}
                  <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-sky-500 shrink-0" />
                      Courier partner delivery
                    </span>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-slate-400">Total Invoice Amount:</span>
                      <span className="text-base font-extrabold text-white font-mono">Rs. {order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
