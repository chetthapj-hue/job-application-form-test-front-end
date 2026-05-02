import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../services/api';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Corrected: formData now contains { email, password }
      const { data } = await loginAdmin(formData);
      localStorage.setItem('adminToken', data.token);
      navigate('/admin');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="bg-slate-800 p-8 text-center text-white">
          <h2 className="text-3xl font-bold">Admin Portal</h2>
          <p className="text-slate-400 mt-2">Sign in to manage your recruitment system</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center text-red-700 rounded-r-lg">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="text-sm">{apiError}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Email Address</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-indigo-500'}`}
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-indigo-500'}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
