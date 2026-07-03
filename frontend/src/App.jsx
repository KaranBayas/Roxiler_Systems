import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StoreList } from './pages/StoreList';
import { StoreDetail } from './pages/StoreDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { StoreOwnerDashboard } from './pages/StoreOwnerDashboard';
import './App.css';

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/user/stores"
            element={
              <ProtectedRoute requiredRole="USER">
                <StoreList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores/:storeId"
            element={
              <ProtectedRoute>
                <StoreDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store-owner/dashboard"
            element={
              <ProtectedRoute requiredRole="STORE_OWNER">
                <StoreOwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/" element={<Navigate to="/user/stores" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

function UnauthorizedPage() {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>Unauthorized</h1>
      <p>You don&apos;t have permission to access this page.</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
