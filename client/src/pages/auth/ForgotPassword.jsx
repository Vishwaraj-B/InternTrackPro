import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    toast.success('Password reset link sent to your email!');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-dark-950' : 'bg-gray-50'}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white font-bold">IT</span>
          </div>
          <span className="text-xl font-bold gradient-text">InternTrack Pro</span>
        </div>

        <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-dark-900 border border-dark-700/50' : 'bg-white border border-gray-200 shadow-xl'}`}>
          {!sent ? (
            <>
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Forgot Password?</h2>
              <p className={`mb-6 ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
                Enter your email and we'll send you a reset link
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <FiMail className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`} size={16} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all
                      ${theme === 'dark' ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500' 
                        : 'bg-white border border-gray-200 text-dark-900 placeholder-dark-400 focus:border-primary-500'}`} />
                </div>
                <button type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm 
                    flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:from-primary-500 hover:to-primary-400 transition-all">
                  <FiSend size={16} /> Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-500/10 flex items-center justify-center">
                <FiMail className="text-success-500" size={28} />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Check Your Email</h2>
              <p className={`mb-4 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
                We've sent a password reset link to <span className="font-semibold text-primary-400">{email}</span>
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>
                (This is a demo — no email is actually sent)
              </p>
            </div>
          )}

          <Link to="/login" className={`mt-6 flex items-center justify-center gap-2 text-sm font-medium ${theme === 'dark' ? 'text-dark-400 hover:text-white' : 'text-dark-500 hover:text-dark-900'} transition-colors`}>
            <FiArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
