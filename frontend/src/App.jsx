import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExperimentDetail from './pages/ExperimentDetail';
import Compare from './pages/Compare';
import Analytics from './pages/Analytics';
import LiveMonitoring from './pages/LiveMonitoring';
import PredictionEngine from './pages/PredictionEngine';
import SmartRecommendations from './pages/SmartRecommendations';
import ExperimentTemplates from './pages/ExperimentTemplates';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Activity from './pages/Activity';
import DataDriftDetection from './pages/DataDriftDetection';
import CollaborativeFeatures from './pages/CollaborativeFeatures';

import 'react-toastify/dist/ReactToastify.css';

// Component to handle conditional root route
const RootRoute = () => {
  const { user } = useAuth();
  
  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If not authenticated, show home page
  return <Home />;
};

// Component to handle dynamic ToastContainer theme
const ThemedToastContainer = () => {
  const { theme } = useTheme();
  
  const toastTheme = theme === 'light' ? 'light' : 'dark';
  
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={toastTheme}
    />
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RootRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Private Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/experiments/:id" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <ExperimentDetail />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/experiments/compare" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <Compare />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <Analytics />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/monitoring" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <LiveMonitoring />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/predictions" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <PredictionEngine />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/recommendations" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <SmartRecommendations />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/templates" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <ExperimentTemplates />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <Settings />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/activity" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <Activity />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/data-drift" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <DataDriftDetection />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/collaboration" 
              element={
                <PrivateRoute>
                  <Navbar />
                  <CollaborativeFeatures />
                </PrivateRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <ThemedToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;