import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiFileText, FiCheckCircle, FiClock, FiTrendingUp, FiAward, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/api';

const COLORS = ['#6366f1', '#0ea5e9', '#f59e0b', '#22c55e', '#ef4444'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const StudentDashboard = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, taskRes] = await Promise.all([
        api.get('/applications/stats'),
        api.get('/tasks/stats')
      ]);
      setStats(appRes.data.stats);
      setTaskStats(taskRes.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (status) => {
    if (!stats?.byStatus) return 0;
    const found = stats.byStatus.find(s => s._id === status);
    return found ? found.count : 0;
  };

  const getTaskStatusCount = (status) => {
    if (!taskStats?.byStatus) return 0;
    const found = taskStats.byStatus.find(s => s._id === status);
    return found ? found.count : 0;
  };

  const monthlyData = stats?.byMonth?.map(m => ({
    name: MONTHS[m._id.month - 1],
    applications: m.count
  })) || [];

  const pieData = stats?.byStatus?.map(s => ({
    name: s._id,
    value: s.count
  })) || [];

  const taskPieData = taskStats?.byStatus?.map(s => ({
    name: s._id,
    value: s.count
  })) || [];

  const cards = [
    { title: 'Total Applications', value: stats?.total || 0, icon: FiFileText, color: 'from-primary-500 to-primary-700', bg: 'bg-primary-500/10' },
    { title: 'Accepted', value: getStatusCount('Accepted'), icon: FiCheckCircle, color: 'from-success-500 to-success-600', bg: 'bg-success-500/10' },
    { title: 'Pending Tasks', value: getTaskStatusCount('Pending') + getTaskStatusCount('In Progress'), icon: FiClock, color: 'from-warning-500 to-warning-600', bg: 'bg-warning-500/10' },
    { title: 'Completed Tasks', value: getTaskStatusCount('Completed'), icon: FiAward, color: 'from-accent-500 to-accent-600', bg: 'bg-accent-500/10' },
  ];

  const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }) };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 skeleton rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1,2].map(i => <div key={i} className="h-80 skeleton rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className={`mt-1 ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>
          Here's an overview of your internship journey
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.title} custom={i} initial="hidden" animate="visible" variants={cardVariants}
            className={`p-5 rounded-2xl card-hover ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{card.title}</p>
                <p className={`text-3xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`text-${card.color.includes('primary') ? 'primary' : card.color.includes('success') ? 'success' : card.color.includes('warning') ? 'warning' : 'accent'}-500`} size={22} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
            📊 Applications per Month
          </h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', 
                  border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  color: theme === 'dark' ? '#fff' : '#000'
                }} />
                <Bar dataKey="applications" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className={`text-sm ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>No application data yet</p>
            </div>
          )}
        </motion.div>

        {/* Pie Chart - Application Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
            🎯 Application Status
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', border: 'none', borderRadius: '12px', color: theme === 'dark' ? '#fff' : '#000' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className={`text-sm ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>No data yet</p>
            </div>
          )}
        </motion.div>

        {/* Task Status Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
            ✅ Task Status Distribution
          </h3>
          {taskPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={taskPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {taskPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', border: 'none', borderRadius: '12px', color: theme === 'dark' ? '#fff' : '#000' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className={`text-sm ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>No tasks yet</p>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>
            📈 Quick Summary
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Interview Stage', count: getStatusCount('Interview'), color: 'bg-warning-500', total: stats?.total },
              { label: 'Under Review', count: getStatusCount('Under Review'), color: 'bg-accent-500', total: stats?.total },
              { label: 'Rejected', count: getStatusCount('Rejected'), color: 'bg-danger-500', total: stats?.total },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className={theme === 'dark' ? 'text-dark-300' : 'text-dark-600'}>{item.label}</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{item.count}</span>
                </div>
                <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-dark-700' : 'bg-gray-200'}`}>
                  <div className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.total ? (item.count / item.total) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
