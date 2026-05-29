import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMail, FiBook, FiFileText } from 'react-icons/fi';
import api from '../../services/api';

const AdminStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [stuRes, appRes] = await Promise.all([
        api.get(`/users/students/${id}`),
        api.get('/applications')
      ]);
      setStudent(stuRes.data.student);
      setApplications(appRes.data.applications.filter(a => a.student?._id === id));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 skeleton rounded-2xl"></div>)}</div>;
  if (!student) return <p>Student not found</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate('/admin/students')}
        className={`flex items-center gap-2 text-sm font-medium ${theme === 'dark' ? 'text-dark-400 hover:text-white' : 'text-dark-500 hover:text-dark-900'} transition-colors`}>
        <FiArrowLeft size={16} /> Back to Students
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{student.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{student.name}</h1>
            <p className={`text-sm flex items-center gap-1 ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}><FiMail size={13} /> {student.email}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className={theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}><FiBook className="inline mr-1" size={13} /> {student.college || 'N/A'}</span>
              <span className={theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}>{student.branch || 'N/A'}</span>
              <span className={theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}>Sem: {student.semester || 'N/A'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
          <FiFileText className="inline mr-2" size={18} /> Applications ({applications.length})
        </h2>
        {applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map(app => (
              <div key={app._id} className={`p-4 rounded-xl flex items-center justify-between ${theme === 'dark' ? 'bg-dark-900' : 'bg-gray-50'}`}>
                <div>
                  <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{app.company} — {app.role}</p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>
                    Applied: {new Date(app.dateApplied).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold
                  ${app.status === 'Accepted' ? 'bg-green-500/10 text-green-400' : 
                    app.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                    app.status === 'Interview' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-blue-500/10 text-blue-400'}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        ) : <p className={`text-sm ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>No applications</p>}
      </motion.div>
    </div>
  );
};

export default AdminStudentDetail;
