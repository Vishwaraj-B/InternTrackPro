import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import StudentDashboard from './pages/student/Dashboard';
import StudentApplications from './pages/student/Applications';
import StudentTasks from './pages/student/Tasks';
import StudentProfile from './pages/student/Profile';
import StudentInternships from './pages/student/Internships';
import StudentResumeAnalyzer from './pages/student/ResumeAnalyzer';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminStudentDetail from './pages/admin/StudentDetail';
import AdminInternships from './pages/admin/Internships';
import AdminTasks from './pages/admin/TaskManagement';
import AdminApplications from './pages/admin/ApplicationReview';
import AdminSubmissions from './pages/admin/Submissions';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="tasks" element={<StudentTasks />} />
        <Route path="internships" element={<StudentInternships />} />
        <Route path="resume-analyzer" element={<StudentResumeAnalyzer />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="students/:id" element={<AdminStudentDetail />} />
        <Route path="internships" element={<AdminInternships />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="submissions" element={<AdminSubmissions />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
