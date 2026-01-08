import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Dashboard from './pages/dashboard';
import AdminLayout from './components/layout/admin-layout';
import UserList from './pages/users/user-list';
import ProductList from './pages/products/product-list';
import CategoryList from './pages/categories/category-list';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="categories" element={<CategoryList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
