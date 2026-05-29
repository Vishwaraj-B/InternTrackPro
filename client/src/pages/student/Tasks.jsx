import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiAlertTriangle, FiCheckCircle, FiSend, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PRIORITY_COLORS = {
  High: 'bg-red-500/10 text-red-400 border-red-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Low: 'bg-green-500/10 text-green-400 border-green-500/20',
};
const STATUS_COLORS = {
  Pending: 'bg-gray-500/10 text-gray-400',
  'In Progress': 'bg-blue-500/10 text-blue-400',
  Completed: 'bg-green-500/10 text-green-400',
};

const StudentTasks = () => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);
  const [submitModal, setSubmitModal] = useState(null);
  const [submitData, setSubmitData] = useState({ content: '', file: null });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [taskRes, subRes] = await Promise.all([api.get('/tasks'), api.get('/submissions')]);
      setTasks(taskRes.data.tasks);
      setSubmissions(subRes.data.submissions);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getSubmission = (taskId) => submissions.find(s => s.task?._id === taskId || s.task === taskId);

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      toast.success(`Task marked as ${status}`);
      fetchData();
    } catch (err) { toast.error('Failed to update'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('taskId', submitModal);
      formData.append('content', submitData.content);
      if (submitData.file) formData.append('file', submitData.file);
      await api.post('/submissions', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Work submitted!');
      setSubmitModal(null);
      setSubmitData({ content: '', file: null });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Submission failed'); }
  };

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (loading) {
    return <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-24 skeleton rounded-xl"></div>)}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>My Tasks</h1>
        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{total} tasks assigned</p>
      </div>

      {/* Progress Bar */}
      <div className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>Overall Progress</span>
          <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{progress}%</span>
        </div>
        <div className={`h-3 rounded-full ${theme === 'dark' ? 'bg-dark-700' : 'bg-gray-200'}`}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"></motion.div>
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-xs ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>{completed} completed</span>
          <span className={`text-xs ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>{total - completed} remaining</span>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {tasks.map((task, i) => {
          const sub = getSubmission(task._id);
          const isExpanded = expandedTask === task._id;
          return (
            <motion.div key={task._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
              <div className="p-5 cursor-pointer" onClick={() => setExpandedTask(isExpanded ? null : task._id)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{task.title}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_COLORS[task.status]}`}>{task.status}</span>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
                      <FiClock className="inline mr-1" size={12} />
                      Due: {new Date(task.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub && <span className={`text-xs font-medium ${sub.status === 'Graded' ? 'text-green-400' : 'text-blue-400'}`}>
                      {sub.status === 'Graded' ? `Grade: ${sub.grade}` : 'Submitted'}
                    </span>}
                    {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className={`px-5 pb-5 border-t ${theme === 'dark' ? 'border-dark-700/50' : 'border-gray-100'}`}>
                      <p className={`mt-4 text-sm leading-relaxed ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>{task.description}</p>
                      
                      <div className="flex items-center gap-3 mt-4 flex-wrap">
                        {task.status !== 'Completed' && (
                          <>
                            {task.status === 'Pending' && (
                              <button onClick={(e) => { e.stopPropagation(); handleStatusChange(task._id, 'In Progress'); }}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                                Start Task
                              </button>
                            )}
                            {task.status === 'In Progress' && (
                              <button onClick={(e) => { e.stopPropagation(); handleStatusChange(task._id, 'Completed'); }}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                                <FiCheckCircle className="inline mr-1" size={12} /> Mark Complete
                              </button>
                            )}
                          </>
                        )}
                        {!sub && (
                          <button onClick={(e) => { e.stopPropagation(); setSubmitModal(task._id); }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors">
                            <FiSend className="inline mr-1" size={12} /> Submit Work
                          </button>
                        )}
                      </div>

                      {sub && (
                        <div className={`mt-4 p-3 rounded-xl ${theme === 'dark' ? 'bg-dark-900' : 'bg-gray-50'}`}>
                          <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>YOUR SUBMISSION</p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>{sub.content}</p>
                          {sub.feedback && (
                            <div className="mt-3 pt-3 border-t border-dark-700/30">
                              <p className="text-xs font-semibold text-primary-400 mb-1">ADMIN FEEDBACK</p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>{sub.feedback}</p>
                              {sub.grade && <p className="text-sm font-bold text-green-400 mt-1">Grade: {sub.grade}</p>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-sm ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>No tasks assigned yet</p>
          </div>
        )}
      </div>

      {/* Submit Modal */}
      <AnimatePresence>
        {submitModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setSubmitModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className={`w-full max-w-lg p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-900 border border-dark-700' : 'bg-white shadow-2xl'}`}
                onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Submit Work</h2>
                  <button onClick={() => setSubmitModal(null)} className="p-1.5 rounded-lg hover:bg-dark-700"><FiX size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Your Work</label>
                    <textarea rows="4" value={submitData.content} onChange={(e) => setSubmitData({...submitData, content: e.target.value})}
                      placeholder="Describe your work, paste links, etc."
                      className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none ${theme === 'dark' ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500' : 'bg-white border border-gray-200 focus:border-primary-500'}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Attach File (optional)</label>
                    <input type="file" onChange={(e) => setSubmitData({...submitData, file: e.target.files[0]})}
                      className={`w-full text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`} />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/25">
                    <FiSend className="inline mr-2" size={14} /> Submit
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

export default StudentTasks;
