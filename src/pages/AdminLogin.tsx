import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'admin' && password === 'admin123') {
      onLogin();
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="bg-slate-50">
      {/* Page Banner */}
      <div
        className="bg-cover bg-center py-16 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.65)), url(https://images.pexels.com/photos/4170172/pexels-photo-4170172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1920)`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Admin Portal</h1>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-red-500">Admin Login</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded shadow-lg border-t-4 border-red-600 p-8 w-full max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-red-50 rounded flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-red-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Sign In to Atrans Admin</h1>
            <p className="text-slate-500 text-sm mt-1">Manage shipments and tracking</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full px-4 py-2.5 pr-10 rounded border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Sign In
            </button>
          </form>

          <div className="mt-6 p-3 bg-slate-50 rounded text-xs text-slate-500 text-center border border-slate-200">
            <p className="font-bold text-slate-600 mb-1">Demo Credentials</p>
            <p>Username: <span className="font-mono text-slate-700">admin</span></p>
            <p>Password: <span className="font-mono text-slate-700">admin123</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
