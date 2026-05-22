import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, BadgeCheck, Save, Sparkles } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, token } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setSuccess(false);
    setErrorMsg(null);

    const ok = await updateProfile(name, email);
    setLoading(false);

    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setErrorMsg('Failed to update profile. Email might already be registered.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8 bg-[#FAF9F6]">
      
      <div className="border-b border-[#E8E6E1] pb-4">
        <span className="text-[10px] font-bold text-[#A29F98] uppercase tracking-[0.2em] block mb-1">Customer Settings</span>
        <h1 className="text-3.5xl font-serif text-[#1A1A1A] italic">
          Customer Account
        </h1>
        <p className="text-xs text-stone-500 font-light font-sans mt-1">
          Review credentials and modify contact settings.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-150 text-emerald-800 text-[10px] uppercase font-bold tracking-wider rounded-none flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-emerald-800" />
          Account updated successfully!
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-[10px] uppercase font-bold tracking-wider rounded-none">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="bg-white border border-[#E8E6E1] rounded-none p-6 sm:p-8 shadow-none space-y-8">
        
        {/* Avatar Presentation */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-[#1A1A1A] text-white flex items-center justify-center text-xl font-bold rounded-none uppercase">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold uppercase tracking-tight text-[#1A1A1A]">{user?.name}</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono leading-none border border-[#E8E6E1] bg-[#FAF9F6] text-stone-700 mt-1 uppercase tracking-wider rounded-none">
              {user?.role === 'admin' ? 'SYSTEM ADMIN' : 'CUSTOMER PARTNER'}
            </span>
          </div>
        </div>

        {/* Edit fields form */}
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-[#A29F98] uppercase tracking-wider block">
              Display Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-3 text-xs bg-white border border-[#E8E6E1] rounded-none focus:outline-none focus:border-black transition-all"
              />
              <User className="absolute left-3 top-3.5 w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-[#A29F98] uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-3 text-xs bg-white border border-[#E8E6E1] rounded-none focus:outline-none focus:border-black transition-all"
              />
              <Mail className="absolute left-3 top-3.5 w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-none shadow-none disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Committing changes...' : 'Save Account Updates'}
          </button>
        </form>

        {/* Environmental impact tracker */}
        <div className="p-5 bg-white border border-[#1A1A1A] rounded-none flex items-start gap-4">
          <div className="p-1 bg-white border border-[#1A1A1A] rounded-none shrink-0">
            <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">AeroFlask Green Partner Badge</h4>
            <p className="text-xs text-stone-500 font-light leading-relaxed mt-1">
              Because you choose metal and glass flask components, your account is marked certified. Thank you for conserving up to 15 kg of chemical waste this calendar year!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
