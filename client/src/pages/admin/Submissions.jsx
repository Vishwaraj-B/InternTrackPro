import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMessageSquare } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminSubmissions = () => {
  const { theme } = useTheme();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeModal, setGradeModal] = useState(null);
  const [gradeData, setGradeData] = useState({ feedback: '', grade: '' });

  useEffect(() => { fetchSubs(); }, []);

  const fetchSubs = async () => {
    try {
      const r = await api.get('/submissions');
      setSubmissions(r.data.submissions);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/submissions/${gradeModal}`, gradeData);
      toast.success('Graded!');
      setGradeModal(null);
      setGradeData({ feedback: '', grade: '' });
      fetchSubs();
    } catch(e) { toast.error('Failed'); }
  };

  const openGrade = (sub) => {
    setGradeModal(sub._id);
    setGradeData({
      feedback: sub.feedback || '',
      grade: sub.grade || ''
    });
  };

  const inputClass = `w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all
    ${theme === 'dark'
      ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500'
      : 'bg-white border border-gray-200 focus:border-primary-500'}`;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-24 skeleton rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
          Submissions
        </h1>
        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
          {submissions.length} submissions received
        </p>
      </div>

      <div className="space-y-3">
        {submissions.map((sub, i) => (
          <motion.div
            key={sub._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {sub.student?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
                      {sub.student?.name}
                    </span>
                    <p className={`text-xs ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>
                      {sub.student?.email}
                    </p>
                  </div>
                </div>
                <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
                  Task: {sub.task?.title}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>
                  {sub.content}
                </p>
                {sub.fileUrl && (
                  <a href={sub.fileUrl} target="_blank" rel="noreferrer"
                    className="inline-block mt-2 text-xs text-accent-400 hover:underline">
                    📎 View Attachment
                  </a>
                )}
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>
                  Submitted: {new Date(sub.submittedAt).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium
                  ${sub.status === 'Graded'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-yellow-500/10 text-yellow-400'}`}>
                  {sub.status}
                </span>
                {sub.grade && (
                  <span className="text-lg font-bold text-green-400">
                    {sub.grade}
                  </span>
                )}
                <button
                  onClick={() => openGrade(sub)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
                >
                  <FiMessageSquare size={12} />
                  {sub.status === 'Graded' ? 'Update' : 'Grade'}
                </button>
              </div>
            </div>

            {sub.feedback && (
              <div className={`mt-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-dark-900' : 'bg-gray-50'}`}>
                <p className="text-xs font-semibold text-primary-400 mb-1">YOUR FEEDBACK</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>
                  {sub.feedback}
                </p>
              </div>
            )}
          </motion.div>
        ))}

        {submissions.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-sm ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>
              No submissions yet
            </p>
          </div>
        )}
      </div>

      {/* Grade Modal */}
      <AnimatePresence>
        {gradeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setGradeModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className={`w-full max-w-md p-6 rounded-2xl
                  ${theme === 'dark' ? 'bg-dark-900 border border-dark-700' : 'bg-white shadow-2xl'}`}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
                    Grade Submission
                  </h2>
                  <button
                    onClick={() => setGradeModal(null)}
                    className="p-1.5 rounded-lg hover:bg-dark-700"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <form onSubmit={handleGrade} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>
                      Grade / Score
                    </label>
                    <input
                      value={gradeData.grade}
                      onChange={e => setGradeData({...gradeData, grade: e.target.value})}
                      placeholder="e.g. A+, 95/100, etc."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>
                      Feedback
                    </label>
                    <textarea
                      rows="4"
                      value={gradeData.feedback}
                      onChange={e => setGradeData({...gradeData, feedback: e.target.value})}
                      placeholder="Write your feedback..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/25"
                  >
                    Submit Grade
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

export default AdminSubmissions;
