import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User } from 'lucide-react';

export default function Register() {
  const { register, error, clearError, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registering, setRegistering] = useState(false);

  // Redirect if user is already signed in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setRegistering(true);

    await register(name, email, password);
    setRegistering(false);
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4 space-y-8 bg-[#FAF9F6]">
      
      <div className="text-center space-y-1.5 border-b border-[#E8E6E1] pb-6">
        <span className="text-[10px] font-bold text-[#A29F98] uppercase tracking-[0.2em] block">Create credentials</span>
        <h1 className="text-3.5xl font-serif text-[#1A1A1A] italic">
          Join AeroFlask
        </h1>
        <p className="text-xs text-stone-500 font-light font-sans max-w-xs mx-auto">
          Create an account and start funding coastal ocean purification on each order.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-55 border border-red-200 text-red-800 text-[10px] font-bold uppercase tracking-wider rounded-none">
          ⚠️ {error}
        </div>
      )}

      {/* Main Register Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E8E6E1] rounded-none p-8 space-y-5 shadow-none">
        
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-[#A29F98] uppercase tracking-wider block">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Jenkins"
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
              placeholder="sarah@example.com"
              className="w-full pl-9 pr-3.5 py-3 text-xs bg-white border border-[#E8E6E1] rounded-none focus:outline-none focus:border-black transition-all"
            />
            <Mail className="absolute left-3 top-3.5 w-3.5 h-3.5 text-stone-400" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-[#A29F98] uppercase tracking-wider block">
            Secure Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3.5 py-3 text-xs bg-white border border-[#E8E6E1] rounded-none focus:outline-none focus:border-black transition-all"
            />
            <Lock className="absolute left-3 top-3.5 w-3.5 h-3.5 text-stone-400" />
          </div>
        </div>

        <button
          type="submit"
          disabled={registering}
          className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-none shadow-none cursor-pointer transition-all duration-300"
        >
          {registering ? 'Creating Secure Account...' : 'Register New Account'}
        </button>

        <p className="text-xs text-center text-stone-500 font-light">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1A1A1A] font-bold underline hover:text-stone-600">
            Log In here
          </Link>
        </p>

      </form>

    </div>
  );
}
