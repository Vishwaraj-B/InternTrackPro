import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { FiSun, FiMoon, FiLogOut, FiBell } from 'react-icons/fi';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-6 
      ${theme === 'dark' 
        ? 'bg-dark-900/80 border-b border-dark-700/50' 
        : 'bg-white/80 border-b border-gray-200'} 
      backdrop-blur-xl`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className={`lg:hidden p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-dark-700' : 'hover:bg-gray-100'}`}
        >
          <HiOutlineMenuAlt2 size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">IT</span>
          </div>
          <h1 className="text-lg font-bold hidden sm:block">
            <span className="gradient-text">InternTrack</span> Pro
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className={`p-2.5 rounded-xl transition-all duration-200 ${theme === 'dark' ? 'hover:bg-dark-700 text-dark-300' : 'hover:bg-gray-100 text-dark-500'}`}
          title="Notifications"
        >
          <FiBell size={18} />
        </button>
        
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl transition-all duration-200 ${theme === 'dark' ? 'hover:bg-dark-700 text-yellow-400' : 'hover:bg-gray-100 text-dark-600'}`}
          title="Toggle theme"
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div className={`hidden md:flex items-center gap-3 ml-2 pl-4 border-l ${theme === 'dark' ? 'border-dark-700' : 'border-gray-200'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div className="text-sm">
            <p className="font-semibold leading-tight">{user?.name}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'} capitalize`}>{user?.role}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2.5 rounded-xl text-danger-400 hover:bg-danger-500/10 transition-all duration-200"
          title="Logout"
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
