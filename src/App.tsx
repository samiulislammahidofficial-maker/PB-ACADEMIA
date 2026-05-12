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
import QAHub from './components/dashboards/QAHub';
import VideoClasses from './components/dashboards/VideoClasses';
import CourseView from './components/CourseView';
import ExamView from './components/ExamView';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuizBlustDashboard from './components/dashboards/QuizBlustDashboard';
import BrainTeasers from './components/BrainTeasers';
import PracticeExamList from './components/PracticeExamList';
import PracticeExamSession from './components/PracticeExamSession';
import ScrollToTop from './components/common/ScrollToTop';
import ChatBot from './components/ChatBot';
import GraphCalculator from './components/GraphCalculator';
import ScientificCalculator from './components/tools/ScientificCalculator';
import Shapes3D from './components/tools/Shapes3D';
import CircuitSimulator from './components/tools/CircuitSimulator';
import GrammarChecker from './components/tools/GrammarChecker';
import Paraphraser from './components/tools/Paraphraser';
import VocabBuilder from './components/tools/VocabBuilder';
import Translator from './components/tools/Translator';
import SocialPostWriter from './components/tools/SocialPostWriter';
import TypingPractice from './components/tools/TypingPractice';
import { useLocation } from 'react-router-dom';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { user, profile, loading } = useAuth();
  
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (role && profile?.role !== role) return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/quizblust') ||
                          location.pathname.startsWith('/exams') ||
                          location.pathname.startsWith('/practice-exams') ||
                          location.pathname.startsWith('/brain-teasers') ||
                          location.pathname.startsWith('/graph-calculator') ||
                          location.pathname.startsWith('/scientific-calculator') ||
                          location.pathname.startsWith('/3d-shapes') ||
                          location.pathname.startsWith('/circuit-simulator') ||
                          location.pathname.startsWith('/grammar-checker') ||
                          location.pathname.startsWith('/paraphraser') ||
                          location.pathname.startsWith('/translator') ||
                          location.pathname.startsWith('/social-post-writer') ||
                          location.pathname.startsWith('/typing-practice') ||
                          location.pathname.startsWith('/vocab-builder');

  return (
    <div className={`relative min-h-screen flex flex-col selection:bg-blue-500/30 bg-[#050505]`}>
      {!isDashboardRoute && <Navbar />}
      <SpeedInsights />
      <Analytics />
      <main className="flex-1 w-full relative z-10">
        <AppRoutes />
      </main>
      <FooterWrapper />
      {!location.pathname.startsWith('/exams') && 
       !location.pathname.startsWith('/graph-calculator') && 
       !location.pathname.startsWith('/scientific-calculator') &&
       !location.pathname.startsWith('/3d-shapes') &&
       !location.pathname.startsWith('/circuit-simulator') &&
       !location.pathname.startsWith('/grammar-checker') &&
       !location.pathname.startsWith('/paraphraser') &&
       !location.pathname.startsWith('/translator') &&
       !location.pathname.startsWith('/social-post-writer') &&
       !location.pathname.startsWith('/typing-practice') &&
       !location.pathname.startsWith('/vocab-builder') && <ChatBot />}
    </div>
  );
}

function FooterWrapper() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/quizblust') ||
                          location.pathname.startsWith('/exams') ||
                          location.pathname.startsWith('/practice-exams') ||
                          location.pathname.startsWith('/brain-teasers') ||
                          location.pathname.startsWith('/graph-calculator') ||
                          location.pathname.startsWith('/scientific-calculator') ||
                          location.pathname.startsWith('/3d-shapes') ||
                          location.pathname.startsWith('/translator') ||
                          location.pathname.startsWith('/social-post-writer') ||
                          location.pathname.startsWith('/typing-practice') ||
                          location.pathname.startsWith('/circuit-simulator');
  
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
        path="/dashboard/qa" 
        element={
          <ProtectedRoute>
            <QAHub />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/classes" 
        element={
          <ProtectedRoute>
            <VideoClasses />
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
      <Route path="/graph-calculator" element={<GraphCalculator />} />
      <Route path="/scientific-calculator" element={<ScientificCalculator />} />
      <Route path="/3d-shapes" element={<Shapes3D />} />
      <Route path="/circuit-simulator" element={<CircuitSimulator />} />
      <Route path="/grammar-checker" element={<GrammarChecker />} />
      <Route path="/paraphraser" element={<Paraphraser />} />
      <Route path="/vocab-builder" element={<VocabBuilder />} />
      <Route path="/translator" element={<Translator />} />
      <Route path="/social-post-writer" element={<SocialPostWriter />} />
      <Route path="/typing-practice" element={<TypingPractice />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
