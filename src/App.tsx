/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import type { ReactNode } from 'react';
import Layout from './components/Layout';
import { StudentProvider, useStudent } from './contexts/StudentContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import NotificationCenter from './components/NotificationCenter';

// Lazy loading pages for performance optimization
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Practice = React.lazy(() => import('./pages/Practice'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const PaperGen = React.lazy(() => import('./pages/PaperGen'));
const Flashcards = React.lazy(() => import('./pages/Flashcards'));
const GamifiedLearning = React.lazy(() => import('./pages/GamifiedLearning'));
const Courses = React.lazy(() => import('./pages/Courses'));
const Doubts = React.lazy(() => import('./pages/Doubts'));
const Login = React.lazy(() => import('./pages/Login'));
const Home = React.lazy(() => import('./pages/Home'));
const StudyPlansPage = React.lazy(() => import('./pages/StudyPlansPage'));

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { studentInfo } = useStudent();
  if (!studentInfo) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="w-10 h-10 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <StudentProvider>
      <ThemeProvider>
        <NotificationProvider>
          <BrowserRouter>
            <NotificationCenter />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="courses" element={<Courses />} />
                  <Route path="practice" element={<Practice />} />
                  <Route path="practice/:subjectId/:chapterId" element={<Practice />} />
                  <Route path="flashcards" element={<Flashcards />} />
                  <Route path="doubts" element={<Doubts />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="paper-gen" element={<PaperGen />} />
                  <Route path="gamified-learning" element={<GamifiedLearning />} />
                  <Route path="study-plans" element={<StudyPlansPage />} />
                </Route>
                <Route path="/dashboard" element={<Navigate to="/app" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </StudentProvider>
  );
}
