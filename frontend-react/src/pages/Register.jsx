import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../services/authService';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await registerUser(email, password, fullName);
      if (data && data.token) {
        login(data);
        toast.success('Account created & logged in successfully!');
      } else {
        toast.success('Account created! Please sign in.');
        navigate('/login');
      }
    } catch (err) {
      triggerShake();
      const errorMsg = err.response?.data?.message || 'Registration failed. Email might be already in use.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Ambient Floating Gradient Orbs Background */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-float-orb"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-float-orb-slow"></div>

      <div className={`max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 animate-slide-up-fade transition-all duration-300 relative z-10 ${isShaking ? 'animate-shake' : ''}`}>
        <div>
          <div className="mx-auto w-12 h-12 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 transition-transform duration-300 hover:scale-110">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-white tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-xs text-slate-400">
            Join IntelliHireX AI Recruitment Portal today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 bg-slate-950 border border-slate-800 placeholder-slate-500 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-xs transition-all duration-300 hover:border-slate-700"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 bg-slate-950 border border-slate-800 placeholder-slate-500 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-xs transition-all duration-300 hover:border-slate-700"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 pr-10 bg-slate-950 border border-slate-800 placeholder-slate-500 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-xs transition-all duration-300 hover:border-slate-700"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-xs font-semibold rounded-xl text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg shadow-purple-600/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Sign up</span>
              )}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
