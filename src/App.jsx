import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { PlatformProvider } from './context/PlatformContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import StudentLayout from './components/layouts/StudentLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import ExploreCourses from './pages/public/ExploreCourses';
import CourseDetails from './pages/public/CourseDetails';
import HowItWorks from './pages/public/HowItWorks';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import ForgotPassword from './pages/public/ForgotPassword';

// Student Pages
import Dashboard from './pages/student/Dashboard';
import MyLearning from './pages/student/MyLearning';
import CoursePlayer from './pages/student/CoursePlayer';
import MyProgress from './pages/student/MyProgress';
import Assignments from './pages/student/Assignments';
import Quizzes from './pages/student/Quizzes';
import Certificates from './pages/student/Certificates';
import Wishlist from './pages/student/Wishlist';
import Notifications from './pages/student/Notifications';
import ProfileSettings from './pages/student/ProfileSettings';

// Instructor / Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import CourseEditor from './pages/admin/CourseEditor';
import ManageStudents from './pages/admin/ManageStudents';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <PlatformProvider>
            <BrowserRouter>
              <Routes>
                {/* A. Public Website Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<ExploreCourses />} />
                  <Route path="/courses/:id" element={<CourseDetails />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

                {/* B. Student Portal Routes */}
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute allowedRole="student">
                      <StudentLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="courses" element={<ExploreCourses />} />
                  <Route path="courses/:id" element={<CourseDetails />} />
                  <Route path="my-learning" element={<MyLearning />} />
                  <Route path="player/:courseId" element={<CoursePlayer />} />
                  <Route path="progress" element={<MyProgress />} />
                  <Route path="assignments" element={<Assignments />} />
                  <Route path="quizzes" element={<Quizzes />} />
                  <Route path="certificates" element={<Certificates />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="profile" element={<ProfileSettings />} />
                </Route>

                {/* C. Instructor / Admin Studio Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRole="admin">
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="courses" element={<ManageCourses />} />
                  <Route path="courses/new" element={<CourseEditor />} />
                  <Route path="courses/:id/edit" element={<CourseEditor />} />
                  <Route path="students" element={<ManageStudents />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </PlatformProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
