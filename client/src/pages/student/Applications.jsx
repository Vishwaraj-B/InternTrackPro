import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiTrash2, FiExternalLink, FiX } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  'Applied': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Under Review': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Interview': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Accepted': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Rejected': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const StudentApplications = () => {
  const { theme } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ company: '', role: '', status: 'Applied', dateApplied: '', link: '' });

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');
      setApplications(res.data.applications);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/applications', { ...formData, isCustom: true });
      toast.success('Application added!');
      setShowModal(false);
      setFormData({ company: '', role: '', status: 'Applied', dateApplied: '', link: '' });
      fetchApplications();
    } catch (err) { toast.error('Failed to add application'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      toast.success('Application deleted');
      fetchApplications();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      toast.success('Status updated');
      fetchApplications();
    } catch (err) { toast.error('Failed to update'); }
  };

  const filtered = applications.filter(app => {
    const matchSearch = (app.company || '').toLowerCase().includes(search.toLowerCase()) ||
                       (app.role || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const inputClass = `w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all
    ${theme === 'dark' ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500' 
      : 'bg-white border border-gray-200 text-dark-900 placeholder-dark-400 focus:border-primary-500'}`;

  if (loading) {
    return <div className="space-y-4">{[1,2,3,4,5].map(i => <div key={i} className="h-16 skeleton rounded-xl"></div>)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>My Applications</h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{applications.length} total applications</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium 
            hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/25">
          <FiPlus size={16} /> Add Application
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`} size={16} />
          <input type="text" placeholder="Search by company or role..." value={search} onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none ${theme === 'dark' ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500' : 'bg-white border border-gray-200 focus:border-primary-500'}`} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Applied', 'Under Review', 'Interview', 'Accepted', 'Rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${statusFilter === s 
                ? 'bg-primary-500 text-white' 
                : `${theme === 'dark' ? 'bg-dark-800 text-dark-300 hover:bg-dark-700' : 'bg-gray-100 text-dark-600 hover:bg-gray-200'}`}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={theme === 'dark' ? 'bg-dark-800' : 'bg-gray-50'}>
                {['Company', 'Role', 'Date Applied', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/30">
              {filtered.length === 0 ? (
                <tr><td colSpan="5" className="px-5 py-12 text-center">
                  <p className={`text-sm ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>No applications found</p>
                </td></tr>
              ) : filtered.map((app, i) => (
                <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className={`${theme === 'dark' ? 'hover:bg-dark-700/30' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-400">{(app.company || '?')[0]}</span>
                      </div>
                      <span className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{app.company}</span>
                    </div>
                  </td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>{app.role}</td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
                    {new Date(app.dateApplied).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <select value={app.status} onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer outline-none ${STATUS_COLORS[app.status]} bg-transparent`}>
                      {['Applied', 'Under Review', 'Interview', 'Accepted', 'Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {app.link && (
                        <a href={app.link} target="_blank" rel="noreferrer"
                          className="p-1.5 rounded-lg text-accent-400 hover:bg-accent-500/10 transition-colors"><FiExternalLink size={14} /></a>
                      )}
                      <button onClick={() => handleDelete(app._id)}
                        className="p-1.5 rounded-lg text-danger-400 hover:bg-danger-500/10 transition-colors"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className={`w-full max-w-lg p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-900 border border-dark-700' : 'bg-white shadow-2xl'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Add Application</h2>
                  <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-dark-700"><FiX size={18} /></button>
                </div>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Company *</label>
                    <input required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className={inputClass} placeholder="e.g. Google" /></div>
                  <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Role *</label>
                    <input required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className={inputClass} placeholder="e.g. Frontend Developer Intern" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Date Applied</label>
                      <input type="date" value={formData.dateApplied} onChange={(e) => setFormData({...formData, dateApplied: e.target.value})} className={inputClass} /></div>
                    <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Status</label>
                      <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={inputClass}>
                        {['Applied', 'Under Review', 'Interview', 'Accepted', 'Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select></div>
                  </div>
                  <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Link</label>
                    <input value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className={inputClass} placeholder="https://..." /></div>
                  <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/25">
                    Add Application
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentApplications;
