/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import CourseView from './components/CourseView';
import ExamView from './components/ExamView';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuizBlustDashboard from './components/dashboards/QuizBlustDashboard';
import BrainTeasers from './components/BrainTeasers';
import PracticeExamList from './components/PracticeExamList';
import PracticeExamSession from './components/PracticeExamSession';
import ScrollToTop from './components/common/ScrollToTop';
import { useLocation } from 'react-router-dom';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { user, profile, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen bg-[#050505]">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && profile?.role !== role) return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
}

function AppContent() {
  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col selection:bg-blue-500/30">
      <Navbar />
      <SpeedInsights />
      <Analytics />
      <main className="flex-1 w-full relative z-10">
        <AppRoutes />
      </main>
      <FooterWrapper />
    </div>
  );
}

function FooterWrapper() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/quizblust') ||
                          location.pathname.startsWith('/exams') ||
                          location.pathname.startsWith('/practice-exams');
  
  if (isDashboardRoute) return null;
  return <Footer />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/quizblust" 
        element={
          <ProtectedRoute>
            <QuizBlustDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/practice-exams" 
        element={
          <ProtectedRoute role="student">
            <PracticeExamList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/practice-exams/:setId" 
        element={
          <ProtectedRoute role="student">
            <PracticeExamSession />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/brain-teasers" 
        element={
          <ProtectedRoute>
            <BrainTeasers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/courses/:id" 
        element={
          <ProtectedRoute>
            <CourseView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/exams/:id" 
        element={
          <ProtectedRoute role="student">
            <ExamView />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
