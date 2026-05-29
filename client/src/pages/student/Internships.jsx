import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiDollarSign, FiCalendar, FiSend, FiStar, FiX } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentInternships = () => {
  const { theme } = useTheme();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ATS Modal state
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState(null);

  useEffect(() => { fetchInternships(); }, []);

  const fetchInternships = async () => {
    try {
      const res = await api.get('/internships');
      setInternships(res.data.internships);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleApply = async (internshipId) => {
    try {
      await api.post('/applications', { internshipId, isCustom: false });
      toast.success('Application submitted!');
    } catch (err) { toast.error(err.response?.data?.message || 'Already applied or failed'); }
  };

  const handleCheckATS = async (internship) => {
    setSelectedInternship(internship);
    setIsAtsModalOpen(true);
    setAtsLoading(true);
    setAtsResult(null);

    try {
      const res = await api.post('/resume/ats', { internshipId: internship._id });
      setAtsResult(res.data.atsResult);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to calculate ATS score. Ensure your resume is uploaded.');
      setIsAtsModalOpen(false);
    } finally {
      setAtsLoading(false);
    }
  };

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-48 skeleton rounded-2xl"></div>)}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Available Internships</h1>
        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{internships.length} internships posted</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {internships.map((intern, i) => (
          <motion.div key={intern._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`p-5 rounded-2xl flex flex-col justify-between ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50 hover:border-dark-600' : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'} transition-all`}>
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center shrink-0">
                    <FiBriefcase className="text-primary-400" size={18} />
                  </div>
                  <div>
                    <h3 className={`font-semibold line-clamp-1 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{intern.title}</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{intern.company}</p>
                  </div>
                </div>
              </div>
              <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{intern.description}</p>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className={`flex items-center gap-1 text-xs ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
                  <FiMapPin size={12} /> {intern.location}
                </span>
                <span className={`flex items-center gap-1 text-xs ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
                  <FiDollarSign size={12} /> {intern.stipend}
                </span>
                <span className={`flex items-center gap-1 text-xs ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
                  <FiCalendar size={12} /> {new Date(intern.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button onClick={() => handleCheckATS(intern)}
                className="w-full py-2.5 rounded-xl text-sm font-medium bg-dark-700 text-yellow-400 hover:bg-dark-600 transition-all flex items-center justify-center gap-2 border border-dark-600">
                <FiStar size={14} /> ATS Score
              </button>
              <button onClick={() => handleApply(intern._id)}
                className="w-full py-2.5 rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/20 transition-all flex items-center justify-center gap-2">
                <FiSend size={14} /> Apply
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ATS Score Modal */}
      <AnimatePresence>
        {isAtsModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${theme === 'dark' ? 'bg-dark-900 border border-dark-700' : 'bg-white'}`}>
              
              <div className={`p-5 flex justify-between items-center border-b ${theme === 'dark' ? 'border-dark-800' : 'border-gray-100'}`}>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiStar className="text-yellow-400" /> ATS Compatibility
                </h2>
                <button onClick={() => setIsAtsModalOpen(false)} className={`p-1.5 rounded-lg ${theme === 'dark' ? 'hover:bg-dark-800 text-gray-400' : 'hover:bg-gray-100'}`}>
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {atsLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      Analyzing Resume against {selectedInternship?.title}...
                    </p>
                  </div>
                ) : atsResult ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" className="text-dark-700" strokeWidth="8" fill="none" stroke="currentColor"/>
                          <circle 
                            cx="48" cy="48" r="40" strokeWidth="8" fill="none" 
                            className={atsResult.matchScore >= 75 ? 'text-green-500' : atsResult.matchScore >= 50 ? 'text-yellow-500' : 'text-red-500'} 
                            stroke="currentColor" 
                            strokeDasharray={251.2} 
                            strokeDashoffset={251.2 - (251.2 * atsResult.matchScore) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-bold leading-none">{atsResult.matchScore}%</span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Match</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{selectedInternship?.title}</h3>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {atsResult.recommendation}
                        </p>
                      </div>
                    </div>

                    {atsResult.missingKeywords?.length > 0 && (
                      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                        <h4 className="text-sm font-semibold text-red-400 mb-2">Missing Skills/Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {atsResult.missingKeywords.map(kw => (
                            <span key={kw} className="px-2.5 py-1 bg-red-500/20 text-red-300 text-xs rounded-lg border border-red-500/20">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {atsResult.matchingKeywords?.length > 0 && (
                      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100'}`}>
                        <h4 className="text-sm font-semibold text-green-400 mb-2">Matching Keywords found</h4>
                        <div className="flex flex-wrap gap-2">
                          {atsResult.matchingKeywords.map(kw => (
                            <span key={kw} className="px-2.5 py-1 bg-green-500/20 text-green-300 text-xs rounded-lg border border-green-500/20">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {atsResult && (
                <div className={`p-4 border-t flex justify-end gap-3 ${theme === 'dark' ? 'border-dark-800 bg-dark-900' : 'border-gray-100'}`}>
                  <button onClick={() => setIsAtsModalOpen(false)}
                    className="px-5 py-2 rounded-xl text-sm font-medium bg-dark-700 text-white hover:bg-dark-600 transition-colors">
                    Close
                  </button>
                  <button onClick={() => { setIsAtsModalOpen(false); handleApply(selectedInternship._id); }}
                    className="px-5 py-2 rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20">
                    Apply Anyway
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudentInternships;
