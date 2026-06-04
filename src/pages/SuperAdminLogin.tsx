import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Lock, Eye, EyeOff, ChevronRight, ShieldAlert } from 'lucide-react';
import { api, setAuth, clearAuth } from '../utils/api';

interface SuperAdminLoginProps {
  onLogin: () => void;
}

export default function SuperAdminLogin({ onLogin }: SuperAdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api<{ token: string; role: string }>('/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      if (res.role !== 'superadmin') {
        clearAuth();
        setError('This account does not have super admin access');
        return;
      }
      setAuth(res.token, res.role);
      onLogin();
      navigate('/super-admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="bg-slate-50">
      {/* Page Banner */}
      <div
        className="bg-cover bg-center py-16 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.75)), url(https://images.pexels.com/photos/4170172/pexels-photo-4170172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1920)`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-500 p-1.5 rounded">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Super Admin Portal</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-yellow-500">Super Admin Login</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded shadow-lg border-t-4 border-yellow-500 p-8 w-full max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-yellow-50 rounded flex items-center justify-center mx-auto mb-4">
              <Crown className="w-7 h-7 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Super Admin Access</h1>
            <p className="text-slate-500 text-sm mt-1">Manage site-wide settings & content</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-6 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800">
              Super admin has elevated privileges to modify global site content. Changes affect all visitors.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2.5 rounded border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 pr-10 rounded border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-700 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Access Super Admin
            </button>
          </form>


        </motion.div>
      </div>
    </div>
  );
}
