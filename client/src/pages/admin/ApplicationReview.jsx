import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  'Applied': 'bg-blue-500/10 text-blue-400',
  'Under Review': 'bg-yellow-500/10 text-yellow-400',
  'Interview': 'bg-purple-500/10 text-purple-400',
  'Accepted': 'bg-green-500/10 text-green-400',
  'Rejected': 'bg-red-500/10 text-red-400',
};

const AdminApplicationReview = () => {
  const { theme } = useTheme();
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      const r = await api.get('/applications');
      setApplications(r.data.applications);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      toast.success('Status updated');
      fetchApps();
    } catch(e) { toast.error('Failed to update'); }
  };

  const filtered = applications.filter(a =>
    (a.student?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.company || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-16 skeleton rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
            Application Review
          </h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
            {applications.length} total applications
          </p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={16} />
          <input
            type="text"
            placeholder="Search by student or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none w-72
              ${theme === 'dark'
                ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500'
                : 'bg-white border border-gray-200 focus:border-primary-500'}`}
          />
        </div>
      </div>

      <div className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={theme === 'dark' ? 'bg-dark-800' : 'bg-gray-50'}>
                {['Student', 'Company', 'Role', 'Date', 'Status', 'Update'].map(h => (
                  <th key={h} className={`px-5 py-3.5 text-left text-xs font-semibold uppercase ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/30">
              {filtered.map((app, i) => (
                <motion.tr
                  key={app._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={theme === 'dark' ? 'hover:bg-dark-700/30' : 'hover:bg-gray-50'}
                >
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
                      {app.student?.name}
                    </span>
                  </td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>
                    {app.company}
                  </td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
                    {app.role}
                  </td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
                    {new Date(app.dateApplied).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={app.status}
                      onChange={e => handleStatus(app._id, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-xs outline-none cursor-pointer
                        ${theme === 'dark'
                          ? 'bg-dark-700 text-dark-200 border border-dark-600'
                          : 'bg-gray-100 text-dark-700 border border-gray-200'}`}
                    >
                      {['Applied', 'Under Review', 'Interview', 'Accepted', 'Rejected'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationReview;
