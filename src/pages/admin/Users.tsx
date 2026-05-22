import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { Users, Calendar, ShieldCheck, Mail, Sparkles } from 'lucide-react';

export default function UsersList() {
  const { token } = useAuth();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error fetching admin system users list:', e);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-10 overflow-y-auto animate-fade-in font-sans">
        
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-sans">
            Client Account User Base
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Audit registered purchasers and administrative privilege states.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-16 bg-slate-900 border border-slate-805 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl max-w-4xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-850 border-b border-slate-800 text-slate-355 font-bold font-mono">
                    <th className="p-4 uppercase">Name & Avatar</th>
                    <th className="p-4 uppercase">Email Address</th>
                    <th className="p-4 uppercase">Privilege Level</th>
                    <th className="p-4 uppercase">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {users.map((item) => {
                    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <tr key={item._id} className="hover:bg-slate-800/15 transition-colors">
                        
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-center font-bold text-white uppercase text-xs">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-100">{item.name}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {item._id}</span>
                          </div>
                        </td>

                        <td className="p-4 text-slate-300 font-mono flex items-center gap-1.5 focus:outline-hidden">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          {item.email}
                        </td>

                        <td className="p-4">
                          {item.role === 'admin' ? (
                            <span className="px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/10 flex items-center gap-1 w-fit">
                              <ShieldCheck className="w-3 h-3 text-amber-500 shrink-0" />
                              System Admin
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 flex items-center gap-1 w-fit">
                              Buyer Partner
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-slate-400 font-mono pr-4 flex items-center gap-1 text-[11px] h-full self-center">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {formattedDate}
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
