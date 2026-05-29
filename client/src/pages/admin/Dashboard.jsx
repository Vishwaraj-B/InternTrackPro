import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiBriefcase, FiFileText, FiCheckSquare, FiTrendingUp } from 'react-icons/fi';
import api from '../../services/api';

const COLORS = ['#6366f1', '#0ea5e9', '#f59e0b', '#22c55e', '#ef4444'];

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [data, setData] = useState({ students: 0, internships: 0, applications: 0, tasks: 0, appStats: null, taskStats: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [studRes, intRes, appRes, taskRes, appStatRes, taskStatRes] = await Promise.all([
        api.get('/users/students'),
        api.get('/internships'),
        api.get('/applications'),
        api.get('/tasks'),
        api.get('/applications/stats'),
        api.get('/tasks/stats')
      ]);
      setData({
        students: studRes.data.count,
        internships: intRes.data.count,
        applications: appRes.data.count,
        tasks: taskRes.data.count,
        appStats: appStatRes.data.stats,
        taskStats: taskStatRes.data.stats
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const cards = [
    { title: 'Total Students', value: data.students, icon: FiUsers, color: 'primary' },
    { title: 'Internships', value: data.internships, icon: FiBriefcase, color: 'accent' },
    { title: 'Applications', value: data.applications, icon: FiFileText, color: 'warning' },
    { title: 'Tasks', value: data.tasks, icon: FiCheckSquare, color: 'success' },
  ];

  const appPie = data.appStats?.byStatus?.map(s => ({ name: s._id, value: s.count })) || [];
  const taskPie = data.taskStats?.byStatus?.map(s => ({ name: s._id, value: s.count })) || [];

  if (loading) {
    return <div className="space-y-6"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="h-28 skeleton rounded-2xl"></div>)}
    </div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1,2].map(i => <div key={i} className="h-80 skeleton rounded-2xl"></div>)}
    </div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Admin Dashboard</h1>
        <p className={`mt-1 ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>Overview of all platform activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-2xl card-hover ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{card.title}</p>
                <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-${card.color}-500/10 flex items-center justify-center`}>
                <card.icon className={`text-${card.color}-500`} size={22} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>📊 Application Status Breakdown</h3>
          {appPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={appPie} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {appPie.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', border: 'none', borderRadius: '12px', color: theme === 'dark' ? '#fff' : '#000' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-[280px] flex items-center justify-center"><p className="text-sm text-dark-500">No data</p></div>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>✅ Task Completion Rate</h3>
          {taskPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={taskPie}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', border: 'none', borderRadius: '12px', color: theme === 'dark' ? '#fff' : '#000' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[280px] flex items-center justify-center"><p className="text-sm text-dark-500">No data</p></div>}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
