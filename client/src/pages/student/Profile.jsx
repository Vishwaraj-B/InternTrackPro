import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiBook, FiUpload, FiSave, FiFileText } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', college: '', branch: '', semester: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', college: user.college || '', branch: user.branch || '', semester: user.semester || '' });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', formData);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      const res = await api.post('/users/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(res.data.user);
      toast.success('Resume uploaded!');
    } catch (err) { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
    ${theme === 'dark' ? 'bg-dark-800 border border-dark-700 text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20' 
      : 'bg-white border border-gray-200 text-dark-900 placeholder-dark-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20'}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>My Profile</h1>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-white">{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>{user?.name}</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-dark-500'}`}>{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-400 capitalize">{user?.role}</span>
          </div>
        </div>
      </motion.div>

      {/* Edit Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Edit Details</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}><FiUser className="inline mr-1" size={14} /> Full Name</label>
            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClass} /></div>
          <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}><FiBook className="inline mr-1" size={14} /> College</label>
            <input value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})} className={inputClass} placeholder="e.g. IIT Delhi" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Branch</label>
              <input value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} className={inputClass} placeholder="e.g. Computer Science" /></div>
            <div><label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-dark-300' : 'text-dark-700'}`}>Semester</label>
              <input value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} className={inputClass} placeholder="e.g. 7th" /></div>
          </div>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiSave size={16} />}
            Save Changes
          </button>
        </form>
      </motion.div>

      {/* Resume */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-dark-800/50 border border-dark-700/50' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark-900'}`}>Resume</h3>
        {user?.resumeUrl ? (
          <div className="flex items-center gap-3 mb-4">
            <FiFileText className="text-primary-400" size={20} />
            <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-primary-400 hover:underline">View Resume</a>
          </div>
        ) : (
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-dark-500' : 'text-dark-400'}`}>No resume uploaded yet</p>
        )}
        <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all
          ${theme === 'dark' ? 'bg-dark-700 hover:bg-dark-600 text-dark-200' : 'bg-gray-100 hover:bg-gray-200 text-dark-700'}`}>
          {uploading ? <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div> : <FiUpload size={16} />}
          {uploading ? 'Uploading...' : 'Upload PDF'}
          <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
        </label>
      </motion.div>
    </div>
  );
};

export default StudentProfile;
