import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      // error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@interntrack.com');
      setPassword('admin123');
    } else {
      setEmail('rahul@test.com');
      setPassword('password123');
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-dark-950' : 'bg-gray-50'}`}>
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500 rounded-full blur-3xl"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-xl">IT</span>
            </div>
            <h1 className="text-3xl font-bold text-white">InternTrack Pro</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Track Your Internship Journey Like a Pro
          </h2>
          <p className="text-lg text-primary-200 leading-relaxed">
            Manage applications, track tasks, submit work, and monitor your progress — all in one beautiful platform.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { num: '500+', label: 'Students' },
              { num: '150+', label: 'Internships' },
              { num: '98%', label: 'Placement' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.num}</p>
                <p className="text-sm text-primary-300 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold">IT</span>
            </div>
            <span className="text-xl font-bold gradient-text">InternTrack Pro</span>
          </div>

          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
            Welcome back
          </h2>
          <p className={`mb-8 ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
            Sign in to continue to your dashboard
          </p>

          {/* Demo credentials */}
          <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700' : 'bg-primary-50 border border-primary-100'}`}>
            <p className={`text-xs font-semibold mb-3 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>🎯 DEMO CREDENTIALS</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="flex-1 py-2 px-3 text-xs font-medium rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
              >
                Admin Login
              </button>
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="flex-1 py-2 px-3 text-xs font-medium rounded-lg bg-accent-500/10 text-accent-400 hover:bg-accent-500/20 transition-colors"
              >
                Student Login
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <FiMail className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`} size={16} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none
                    ${theme === 'dark' 
                      ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20' 
                      : 'bg-white border border-gray-200 text-dark-900 placeholder-dark-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20'}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>
                Password
              </label>
              <div className="relative">
                <FiLock className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`} size={16} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className={`w-full pl-10 pr-12 py-3 rounded-xl text-sm transition-all duration-200 outline-none
                    ${theme === 'dark' 
                      ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20' 
                      : 'bg-white border border-gray-200 text-dark-900 placeholder-dark-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-dark-500 hover:text-dark-300' : 'text-dark-400 hover:text-dark-600'}`}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-dark-600 text-primary-500 focus:ring-primary-500" />
                <span className={`text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm 
                hover:from-primary-500 hover:to-primary-400 transition-all duration-200 flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Sign In <FiArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-semibold">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
