import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import ShoppingList from '@/pages/ShoppingList';
import Suppliers from '@/pages/Suppliers';
import Quotes from '@/pages/Quotes';
import Orders from '@/pages/Orders';
import Settings from '@/pages/Settings';
import Admin from '@/pages/Admin';
import Business from '@/pages/Business';
import SupabasePrivateRoute from '@/components/auth/SupabasePrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <SupabasePrivateRoute>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shopping" element={<ShoppingList />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/business" element={<Business />} />
          </Routes>
        </AppLayout>
      </SupabasePrivateRoute>
      <Toaster />
      <SonnerToaster />
    </Router>
  );
}

export default App;