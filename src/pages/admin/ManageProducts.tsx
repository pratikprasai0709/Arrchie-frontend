import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { Trash2, Edit3, Plus, Package, Check, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ManageProducts() {
  const { token } = useAuth();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error fetching admin products list:', e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!token) return;
    const confirmDelete = window.confirm(`Are you sure you want to securely delete model "${name}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Delete failed');
      }

      setAlertMsg(`Securely discarded "${name}".`);
      setTimeout(() => setAlertMsg(null), 3000);
      fetchProducts(); // Refresh list
    } catch (e) {
      console.error(e);
      alert('Failed to delete product. Please retry.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-10 overflow-y-auto animate-fade-in">
        
        {/* Title action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight font-sans">
              Flask Catalog Registry
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Modify descriptions or delete deprecated e-commerce inventory items.
            </p>
          </div>
          
          <Link
            to="/admin/add-product"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-xl tracking-tight transition-all shrink-0 font-sans"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            Add New Flask Block
          </Link>
        </div>

        {/* Global Notifications */}
        <AnimatePresence>
          {alertMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-amber-500" />
              {alertMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-slate-900 border border-slate-805 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center p-12 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-3">
            <Package className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="font-bold text-white text-sm">No Bottle Models Added</h3>
            <p className="text-xs text-slate-500 font-sans max-w-xs mx-auto">
              You haven't instantiated any product catalogs yet. Choose Add Flask Model above to seed items!
            </p>
          </div>
        ) : (
          /* Products Grid list */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-850 border-b border-sidebar-slate text-slate-350 font-bold font-mono">
                    <th className="p-4 uppercase">Bottle Detail</th>
                    <th className="p-4 uppercase">Capacity</th>
                    <th className="p-4 uppercase">Material</th>
                    <th className="p-4 uppercase">Base Price</th>
                    <th className="p-4 uppercase">Stock (Units)</th>
                    <th className="p-4 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {products.map((prod) => {
                    const isOutOfStock = prod.stockQuantity <= 0;
                    return (
                      <tr key={prod._id} className="hover:bg-slate-800/20 transition-colors">
                        
                        {/* Image + Title */}
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 border border-slate-800 rounded overflow-hidden shrink-0 bg-slate-950">
                            <img src={prod.productImage} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">{prod.brand}</span>
                            <h4 className="font-bold text-white max-w-[180px] sm:max-w-xs truncate">{prod.name}</h4>
                          </div>
                        </td>

                        <td className="p-4 text-slate-300 font-semibold">{prod.capacity}</td>
                        <td className="p-4 text-slate-350">{prod.material}</td>
                        <td className="p-4 text-white font-mono font-bold">Rs. {prod.price.toFixed(2)}</td>
                        
                        <td className="p-4">
                          {isOutOfStock ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-500/10 text-red-400">
                              OUT OF STOCK
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-500/10 text-emerald-400">
                              {prod.stockQuantity} items
                            </span>
                          )}
                        </td>

                        {/* Control buttons */}
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              to={`/admin/edit-product/${prod._id}`}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-705"
                              title="Edit specifications"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(prod._id, prod.name)}
                              className="p-2 bg-red-950/25 hover:bg-red-900 border border-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
