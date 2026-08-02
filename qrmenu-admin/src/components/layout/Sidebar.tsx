import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/',           label: 'Dashboard',  icon: '📊' },
  { to: '/categories', label: 'Categories', icon: '🗂️' },
  { to: '/menu-items', label: 'Menu Items', icon: '🍽️' },
  { to: '/orders',     label: 'Orders',     icon: '📋' },
  { to: '/tables',     label: 'Tables',     icon: '🪑' },
];

const NAV_ITEM =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset';

const NAV_ACTIVE = 'bg-orange-500/10 text-orange-600 font-semibold';
const NAV_IDLE = 'text-gray-300 hover:bg-white/5 hover:text-white';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full w-64 flex-col bg-gray-900 text-white">
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-white/10 px-5 sm:h-16">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-lg shadow-lg shadow-orange-500/20">
          🍴
        </span>
        <div className="min-w-0">
          <h1 className="text-base font-bold tracking-tight text-white">QRMenu</h1>
          <p className="text-[11px] text-gray-400">Admin Console</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
          Main
        </p>
        <div className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `${NAV_ITEM} ${isActive ? NAV_ACTIVE : NAV_IDLE}`
              }
            >
              <span className="text-base leading-none">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Account */}
      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
            {user?.fullName
              ?.split(' ')
              .map((p) => p[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')
              .toUpperCase() || 'U'}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-100">{user?.fullName}</p>
            <p className="truncate text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M7.5 5.5a2.5 2.5 0 1 1 5 0v2a2.5 2.5 0 0 1-5 0v-2z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M4 8.5h7.5M10 6.5l-1.5 1.5M10 6.5l-1.5 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}

