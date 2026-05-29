import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiFileText, FiCheckSquare, FiUser, FiBriefcase,
  FiUsers, FiClipboard, FiStar, FiX, FiInbox
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const studentLinks = [
    { to: '/student', icon: FiHome, label: 'Dashboard', end: true },
    { to: '/student/applications', icon: FiFileText, label: 'Applications' },
    { to: '/student/tasks', icon: FiCheckSquare, label: 'My Tasks' },
    { to: '/student/internships', icon: FiBriefcase, label: 'Internships' },
    { to: '/student/resume-analyzer', icon: FiStar, label: 'AI Analyzer' },
    { to: '/student/profile', icon: FiUser, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: FiHome, label: 'Dashboard', end: true },
    { to: '/admin/students', icon: FiUsers, label: 'Students' },
    { to: '/admin/internships', icon: FiBriefcase, label: 'Internships' },
    { to: '/admin/tasks', icon: FiClipboard, label: 'Tasks' },
    { to: '/admin/applications', icon: FiFileText, label: 'Applications' },
    { to: '/admin/submissions', icon: FiInbox, label: 'Submissions' },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const sidebarContent = (
    <div className={`w-64 h-[calc(100vh-4rem)] fixed top-16 left-0 z-40 flex flex-col
      ${theme === 'dark' 
        ? 'bg-dark-900/95 border-r border-dark-700/50' 
        : 'bg-white/95 border-r border-gray-200'} 
      backdrop-blur-xl`}>
      
      <div className="flex-1 py-4 px-3 overflow-y-auto">
        <div className={`px-3 mb-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>
          {user?.role === 'admin' ? 'Admin Panel' : 'Student Panel'}
        </div>

        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? `bg-primary-500/10 text-primary-400 ${theme === 'dark' ? '' : 'text-primary-600 bg-primary-50'}` 
                  : `${theme === 'dark' ? 'text-dark-300 hover:bg-dark-800 hover:text-white' : 'text-dark-600 hover:bg-gray-100 hover:text-dark-900'}`
                }`
              }
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={`p-4 border-t ${theme === 'dark' ? 'border-dark-700/50' : 'border-gray-200'}`}>
        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-dark-800' : 'bg-gray-50'}`}>
          <p className="text-xs font-medium truncate">{user?.email}</p>
          <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'} capitalize`}>
            {user?.role} Account
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 z-50 h-full"
            >
              <div className={`w-64 h-full flex flex-col pt-4
                ${theme === 'dark' ? 'bg-dark-900' : 'bg-white'}`}>
                <div className="flex items-center justify-between px-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">IT</span>
                    </div>
                    <span className="font-bold gradient-text">InternTrack Pro</span>
                  </div>
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-dark-700">
                    <FiX size={18} />
                  </button>
                </div>
                <div className="flex-1 py-2 px-3 overflow-y-auto">
                  <nav className="space-y-1">
                    {links.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                          ${isActive 
                            ? 'bg-primary-500/10 text-primary-400' 
                            : `${theme === 'dark' ? 'text-dark-300 hover:bg-dark-800' : 'text-dark-600 hover:bg-gray-100'}`
                          }`
                        }
                      >
                        <link.icon size={18} />
                        <span>{link.label}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
