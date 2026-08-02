import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Close the drawer when resizing up to desktop.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setDrawerOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      {/* Desktop persistent sidebar (lg breakpoint = 1024px) */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="anim-fade-in fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar onMenuClick={() => setDrawerOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

        <footer className="px-4 pb-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} QRMenu Admin
          </p>
        </footer>
      </div>
    </div>
  );
}

