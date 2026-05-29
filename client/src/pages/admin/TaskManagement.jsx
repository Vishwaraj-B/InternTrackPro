import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminTaskManagement = () => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '', priority: 'Medium', assignedTo: [] });

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try {
      const [tRes, sRes] = await Promise.all([api.get('/tasks'), api.get('/users/students')]);
      setTasks(tRes.data.tasks); setStudents(sRes.data.students);
    } catch(e){} finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', formData);
      toast.success('Task created!');
      setShowModal(false);
      setFormData({ title: '', description: '', deadline: '', priority: 'Medium', assignedTo: [] });
      fetchData();
    } catch (err) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/tasks/${id}`); toast.success('Deleted'); fetchData(); } catch(e) { toast.error('Failed'); }
  };

  const toggleStudent = (id) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(id) ? prev.assignedTo.filter(s => s !== id) : [...prev.assignedTo, id]
    }));
  };

  const selectAll = () => setFormData(prev => ({ ...prev, assignedTo: students.map(s => s._id) }));

  const inputClass = `w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all
    ${theme === 'dark' ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500' : 'bg-white border border-gray-200 focus:border-primary-500'}`;

  const PRIORITY_COLORS = { High: 'bg-red-500/10 text-red-400', Medium: 'bg-yellow-500/10 text-yellow-400', Low: 'bg-green-500/10 text-green-400' };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 skeleton rounded-xl"></div>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Task Management</h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{tasks.length} tasks created</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium shadow-lg shadow-primary-500/25">
          <FiPlus size={16} /> Assign Task
        </button>
      </div>

      <div className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className={theme === 'dark' ? 'bg-dark-800' : 'bg-gray-50'}>
              {['Title', 'Priority', 'Deadline', 'Assigned To', 'Status', 'Actions'].map(h => (
                <th key={h} className={`px-5 py-3.5 text-left text-xs font-semibold uppercase ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-dark-700/30">
              {tasks.map((task, i) => (
                <motion.tr key={task._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className={`${theme === 'dark' ? 'hover:bg-dark-700/30' : 'hover:bg-gray-50'}`}>
                  <td className={`px-5 py-4 text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{task.title}</td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span></td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{new Date(task.deadline).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <div className="flex -space-x-2">
                      {(task.assignedTo || []).slice(0, 3).map((s, si) => (
                        <div key={si} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center border-2 border-dark-800 text-[10px] text-white font-semibold" title={s.name}>
                          {s.name?.charAt(0)}
                        </div>
                      ))}
                      {(task.assignedTo || []).length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-dark-600 flex items-center justify-center border-2 border-dark-800 text-[10px] text-white">
                          +{task.assignedTo.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${task.status === 'Completed' ? 'bg-green-500/10 text-green-400' : task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}`}>{task.status}</span></td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleDelete(task._id)} className="p-1.5 rounded-lg text-danger-400 hover:bg-danger-500/10"><FiTrash2 size={14} /></button>
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
              <div className={`w-full max-w-lg p-6 rounded-2xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-dark-900 border border-dark-700' : 'bg-white shadow-2xl'}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Assign New Task</h2>
                  <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-dark-700"><FiX size={18} /></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Title *</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} /></div>
                  <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Description</label>
                    <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputClass} resize-none`} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Deadline *</label>
                      <input type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className={inputClass} /></div>
                    <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Priority</label>
                      <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className={inputClass}>
                        {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
                      </select></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`text-sm font-medium ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Assign To</label>
                      <button type="button" onClick={selectAll} className="text-xs text-primary-400 hover:text-primary-300">Select All</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {students.map(s => (
                        <label key={s._id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm transition-colors
                          ${formData.assignedTo.includes(s._id) ? 'bg-primary-500/10 text-primary-400' : `${theme === 'dark' ? 'text-dark-300 hover:bg-dark-800' : 'text-dark-600 hover:bg-gray-100'}`}`}>
                          <input type="checkbox" checked={formData.assignedTo.includes(s._id)} onChange={() => toggleStudent(s._id)} className="rounded" />
                          {s.name}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/25">
                    Create Task
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

export default AdminTaskManagement;
