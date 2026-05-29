import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminInternships = () => {
  const { theme } = useTheme();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', company: '', location: '', stipend: '', deadline: '', description: '' });

  useEffect(() => { fetch(); }, []);
  const fetch = async () => { try { const r = await api.get('/internships'); setInternships(r.data.internships); } catch(e){} finally { setLoading(false); } };

  const openAdd = () => { setEditing(null); setFormData({ title: '', company: '', location: '', stipend: '', deadline: '', description: '' }); setShowModal(true); };
  const openEdit = (i) => { setEditing(i._id); setFormData({ title: i.title, company: i.company, location: i.location, stipend: i.stipend, deadline: i.deadline?.split('T')[0] || '', description: i.description }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/internships/${editing}`, formData); toast.success('Updated!'); }
      else { await api.post('/internships', formData); toast.success('Created!'); }
      setShowModal(false); fetch();
    } catch (err) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this internship?')) return;
    try { await api.delete(`/internships/${id}`); toast.success('Deleted'); fetch(); } catch(e) { toast.error('Failed'); }
  };

  const inputClass = `w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all
    ${theme === 'dark' ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500' : 'bg-white border border-gray-200 focus:border-primary-500'}`;

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 skeleton rounded-xl"></div>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Internships</h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{internships.length} listings</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium shadow-lg shadow-primary-500/25">
          <FiPlus size={16} /> Add Internship
        </button>
      </div>

      <div className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className={theme === 'dark' ? 'bg-dark-800' : 'bg-gray-50'}>
              {['Title', 'Company', 'Location', 'Stipend', 'Deadline', 'Actions'].map(h => (
                <th key={h} className={`px-5 py-3.5 text-left text-xs font-semibold uppercase ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-dark-700/30">
              {internships.map((i, idx) => (
                <motion.tr key={i._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                  className={`${theme === 'dark' ? 'hover:bg-dark-700/30' : 'hover:bg-gray-50'}`}>
                  <td className={`px-5 py-4 text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{i.title}</td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>{i.company}</td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{i.location}</td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>{i.stipend}</td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{new Date(i.deadline).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4 flex gap-1">
                    <button onClick={() => openEdit(i)} className="p-1.5 rounded-lg text-primary-400 hover:bg-primary-500/10"><FiEdit2 size={14} /></button>
                    <button onClick={() => handleDelete(i._id)} className="p-1.5 rounded-lg text-danger-400 hover:bg-danger-500/10"><FiTrash2 size={14} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className={`w-full max-w-lg p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-900 border border-dark-700' : 'bg-white shadow-2xl'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{editing ? 'Edit' : 'Add'} Internship</h2>
                  <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-dark-700"><FiX size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[['Title', 'title'], ['Company', 'company']].map(([l, k]) => (
                    <div key={k}><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>{l} *</label>
                      <input required value={formData[k]} onChange={e => setFormData({...formData, [k]: e.target.value})} className={inputClass} /></div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Location</label>
                      <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={inputClass} placeholder="Remote" /></div>
                    <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Stipend</label>
                      <input value={formData.stipend} onChange={e => setFormData({...formData, stipend: e.target.value})} className={inputClass} placeholder="₹50,000/month" /></div>
                  </div>
                  <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Deadline *</label>
                    <input type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className={inputClass} /></div>
                  <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Description</label>
                    <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputClass} resize-none`} /></div>
                  <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/25">
                    {editing ? 'Update' : 'Create'} Internship
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

export default AdminInternships;
