import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { Boxes, Edit, Check, AlertCircle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Inventory() {
  const { token } = useAuth();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track currently edited values in temp memory
  const [tempQtys, setTempQtys] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          
          // Initialize values inside temp state mapping
          const qtys: Record<string, string> = {};
          data.forEach((p) => {
            qtys[p._id] = String(p.stockQuantity);
          });
          setTempQtys(qtys);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error fetching inventory counts:', e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleQtyEdit = (productId: string, val: string) => {
    setTempQtys((prev) => ({
      ...prev,
      [productId]: val,
    }));
  };

  const handleUpdateStock = async (id: string, name: string) => {
    if (!token) return;
    
    const countVal = parseInt(tempQtys[id], 10);
    if (isNaN(countVal) || countVal < 0) {
      alert('Please enter a valid non-negative integer stock level.');
      return;
    }

    setSavingId(id);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          stockQuantity: countVal,
        }),
      });

      if (!res.ok) {
        throw new Error('Stock save failed');
      }

      setToastMsg(`Updated inventory count for model: "${name}" to ${countVal}.`);
      setTimeout(() => setToastMsg(null), 3000);
      
      // Gentle refresh
      const updatedProducts = products.map((p) =>
        p._id === id ? { ...p, stockQuantity: countVal, availabilityStatus: countVal > 0 ? 'In Stock' : 'Out of Stock' } : p
      );
      setProducts(updatedProducts);

    } catch (e) {
      console.error(e);
      alert('Failed to update inventory count. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-10 overflow-y-auto animate-fade-in">
        
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-sans">
            Inventory Tracking Control
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Directly adjust stock tallies to reflect physical warehouse levels.
          </p>
        </div>

        {/* Action toast */}
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
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-20 bg-slate-900 border border-slate-805 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-850 border-b border-slate-800 text-slate-350 font-bold font-mono">
                    <th className="p-4 uppercase">Bottle Title</th>
                    <th className="p-4 uppercase">Brand</th>
                    <th className="p-4 uppercase">Material</th>
                    <th className="p-4 uppercase">Status Indicator</th>
                    <th className="p-4 uppercase w-48">Edit Count (Physical Tally)</th>
                    <th className="p-4 uppercase text-right w-28">Commit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/45">
                  {products.map((p) => {
                    const countVal = parseInt(tempQtys[p._id] || '0', 10);
                    const isEmptied = p.stockQuantity <= 0;
                    const isLow = p.stockQuantity > 0 && p.stockQuantity <= 10;

                    return (
                      <tr key={p._id} className="hover:bg-slate-800/15 transition-colors">
                        
                        <td className="p-4 font-semibold text-white">
                          <span className="block max-w-xs truncate">{p.name}</span>
                          <span className="font-mono text-[9px] text-slate-500 block">ID: {p._id}</span>
                        </td>

                        <td className="p-4 text-slate-400 font-mono font-medium lowercase uppercase">{p.brand}</td>
                        <td className="p-4 text-slate-305">{p.material}</td>

                        {/* Status Label */}
                        <td className="p-4">
                          {isEmptied ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-500/15 text-rose-450 flex items-center gap-1 w-fit border border-rose-500/10">
                              <AlertCircle className="w-3 h-3 text-rose-500" />
                              EMPTY / SOLD OUT
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/15 text-amber-450 flex items-center gap-1 w-fit border border-amber-500/10">
                              <AlertCircle className="w-3 h-3 text-amber-500" />
                              LOW STOCK CRITICAL
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 flex items-center gap-1 w-fit">
                              HEALTHY SUPPLY ({p.stockQuantity})
                            </span>
                          )}
                        </td>

                        {/* Editable Field input */}
                        <td className="p-4">
                          <input
                            type="number"
                            min="0"
                            value={tempQtys[p._id] || ''}
                            onChange={(e) => handleQtyEdit(p._id, e.target.value)}
                            className="w-28 px-3 py-1.5 text-sm bg-slate-950 text-white border border-slate-800 rounded-lg focus:border-amber-500 focus:outline-hidden transition-all text-center font-mono font-bold"
                          />
                        </td>

                        {/* Commiting Column */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleUpdateStock(p._id, p.name)}
                            disabled={savingId === p._id || String(p.stockQuantity) === tempQtys[p._id]}
                            className="px-3.5 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-850 text-slate-305 font-bold rounded-lg border border-slate-705 text-[10px] uppercase flex items-center gap-1.5 transition-all w-fit ml-auto cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5 shrink-0" />
                            {savingId === p._id ? 'Saving...' : 'Save'}
                          </button>
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
