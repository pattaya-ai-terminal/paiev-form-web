import { ConfigProvider, theme } from 'antd';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Survey from './pages/Survey.jsx';
import PublicSurvey from './pages/PublicSurvey.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import SurveyCrud from './pages/SurveyCrud.jsx';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0f5b5d',
          colorInfo: '#0f5b5d',
          borderRadius: 12,
          fontFamily: '"IBM Plex Sans Thai", "Noto Sans Thai", "Sarabun", sans-serif'
        }
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/survey-crud"
          element={
            <AppLayout>
              <SurveyCrud />
            </AppLayout>
          }
        />
        <Route path="/survey" element={<Survey />} />
        <Route path="/public/survey" element={<PublicSurvey />} />
        <Route path="/public/survey/:token" element={<PublicSurvey />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ConfigProvider>
  );
}
