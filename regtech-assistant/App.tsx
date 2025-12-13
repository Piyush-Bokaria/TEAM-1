import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUploadPage } from './pages/AdminUploadPage';
import { UserDashboard } from './pages/UserDashboard';
import { SearchPage } from './pages/SearchPage';
import { DocumentViewer } from './components/DocumentViewer';
import { UserDocuments } from './pages/UserDocuments';
import { AskAI } from './pages/AskAI';
import { ChecklistGenerator } from './pages/ChecklistGenerator';
import { VersionComparison } from './pages/VersionComparison';
import { UserRole } from './types';

function App() {
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <Layout role={UserRole.ADMIN} setRole={setRole}>
              <AdminDashboard />
            </Layout>
          } 
        />
        <Route 
          path="/admin/upload" 
          element={
            <Layout role={UserRole.ADMIN} setRole={setRole}>
              <AdminUploadPage />
            </Layout>
          } 
        />
        
        {/* User Routes */}
        <Route 
          path="/dashboard" 
          element={
            <Layout role={UserRole.USER} setRole={setRole}>
              <UserDashboard />
            </Layout>
          } 
        />
        <Route 
          path="/documents" 
          element={
            <Layout role={UserRole.USER} setRole={setRole}>
              <UserDocuments />
            </Layout>
          } 
        />
        <Route 
          path="/ask-ai" 
          element={
            <Layout role={UserRole.USER} setRole={setRole}>
              <AskAI />
            </Layout>
          } 
        />
        <Route 
          path="/checklists" 
          element={
            <Layout role={UserRole.USER} setRole={setRole}>
              <ChecklistGenerator />
            </Layout>
          } 
        />
        <Route 
          path="/compare" 
          element={
            <Layout role={UserRole.USER} setRole={setRole}>
              <VersionComparison />
            </Layout>
          } 
        />

        {/* Shared Routes */}
        <Route 
          path="/search" 
          element={
            <Layout role={role} setRole={setRole}>
              <SearchPage />
            </Layout>
          } 
        />
        <Route 
          path="/documents/:id" 
          element={
            <Layout role={role} setRole={setRole}>
              <DocumentViewer />
            </Layout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;