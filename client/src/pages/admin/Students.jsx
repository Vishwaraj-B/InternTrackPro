import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { FiSearch, FiUser, FiMail, FiEye } from 'react-icons/fi';
import api from '../../services/api';

const AdminStudents = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try { const res = await api.get('/users/students'); setStudents(res.data.students); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="space-y-4">{[1,2,3,4,5].map(i => <div key={i} className="h-16 skeleton rounded-xl"></div>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Students</h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{students.length} registered students</p>
        </div>
        <div className="relative">
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`} size={16} />
          <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)}
            className={`pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none w-64 ${theme === 'dark' ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500' : 'bg-white border border-gray-200 focus:border-primary-500'}`} />
        </div>
      </div>

      <div className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={theme === 'dark' ? 'bg-dark-800' : 'bg-gray-50'}>
                {['Student', 'Email', 'College', 'Branch', 'Semester', 'Actions'].map(h => (
                  <th key={h} className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/30">
              {filtered.map((student, i) => (
                <motion.tr key={student._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className={`${theme === 'dark' ? 'hover:bg-dark-700/30' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                  onClick={() => navigate(`/admin/students/${student._id}`)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">{student.name.charAt(0)}</span>
                      </div>
                      <span className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{student.name}</span>
                    </div>
                  </td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{student.email}</td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>{student.college || '-'}</td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>{student.branch || '-'}</td>
                  <td className={`px-5 py-4 text-sm ${theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}`}>{student.semester || '-'}</td>
                  <td className="px-5 py-4">
                    <button className="p-1.5 rounded-lg text-primary-400 hover:bg-primary-500/10"><FiEye size={16} /></button>
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

export default AdminStudents;
