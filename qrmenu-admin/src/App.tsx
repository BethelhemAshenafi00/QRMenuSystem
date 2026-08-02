import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import MenuItemsPage from './pages/menuitems/MenuItemsPage';
import OrdersPage from './pages/orders/OrdersPage';
import TablesPage from './pages/tables/TablesPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route path="/"             element={<DashboardPage />} />
              <Route path="/categories"   element={<CategoriesPage />} />
              <Route path="/menu-items"   element={<MenuItemsPage />} />
              <Route path="/orders"       element={<OrdersPage />} />
              <Route path="/tables"       element={<TablesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}