import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Board from './components/Board';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/boards" element={<ProtectedRoute element={<Board />} />} />
          {/* Redirect from root to /boards */}
          <Route path="/" element={<Navigate to="/boards" />} />
          {/* Catch-all route for any undefined routes */}
          <Route path="*" element={<Navigate to="/boards" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;