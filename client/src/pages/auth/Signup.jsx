import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const user = await signup({ name: formData.name, email: formData.email, password: formData.password });
      navigate(user.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      // handled
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none
    ${theme === 'dark'
      ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20'
      : 'bg-white border border-gray-200 text-dark-900 placeholder-dark-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20'}`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-dark-950' : 'bg-gray-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white font-bold">IT</span>
          </div>
          <span className="text-xl font-bold gradient-text">InternTrack Pro</span>
        </div>

        <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-dark-900 border border-dark-700/50' : 'bg-white border border-gray-200 shadow-xl'}`}>
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Create Account</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>Join InternTrack Pro to start tracking</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <FiUser className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`} size={16} />
                <input type="text" placeholder="Full Name" value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClass} />
              </div>
              {errors.name && <p className="text-danger-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <div className="relative">
                <FiMail className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`} size={16} />
                <input type="email" placeholder="Email Address" value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputClass} />
              </div>
              {errors.email && <p className="text-danger-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <div className="relative">
                <FiLock className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`} size={16} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})} className={`${inputClass} pr-12`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-danger-400 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <div className="relative">
                <FiLock className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`} size={16} />
                <input type="password" placeholder="Confirm Password" value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className={inputClass} />
              </div>
              {errors.confirmPassword && <p className="text-danger-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm 
                hover:from-primary-500 hover:to-primary-400 transition-all duration-200 flex items-center justify-center gap-2
                disabled:opacity-50 shadow-lg shadow-primary-500/25">
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                : <> Create Account <FiArrowRight size={16} /></>}
            </button>
          </form>

          <p className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
            Already have an account? <Link to="/login" className="text-primary-400 font-semibold">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
