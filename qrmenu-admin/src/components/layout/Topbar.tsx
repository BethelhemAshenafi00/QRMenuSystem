import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/** Demo tenants for the global switcher. */

interface Props {
  onMenuClick: () => void;
}

/** Initials avatar for the signed-in user. */
function initialsOf(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Topbar({ onMenuClick }: Props) {
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const tenantRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click / Escape.
  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (tenantRef.current?.contains(target)) return;
      if (notifRef.current?.contains(target)) return;
      if (profileRef.current?.contains(target)) return;
      setNotifOpen(false);
      setProfileOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

 

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-orange-500 lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              aria-label="Notifications"
              aria-expanded={notifOpen}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M10 2.5a5 5 0 0 0-5 5v2.2l-1.1 2.2a.8.8 0 0 0 .7 1.1h10.8a.8.8 0 0 0 .7-1.1L15 9.7V7.5a5 5 0 0 0-5-5z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path d="M8.2 15a2 2 0 0 0 3.6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {notifOpen && (
              <div className="anim-fade-in absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-800">Notifications</p>
                </div>
                <div className="divide-y divide-gray-50">
                  <div className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700">Pending order awaiting confirmation</p>
                      <p className="text-xs text-gray-400">Just now</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700">Order #12 marked as delivered</p>
                      <p className="text-xs text-gray-400">12 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700">Menu item "Margherita" is running low</p>
                      <p className="text-xs text-gray-400">1 hr ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
              }}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              className="flex h-9 items-center gap-2 rounded-lg px-1.5 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                {initialsOf(user?.fullName ?? 'U')}
              </span>
              <span className="hidden min-w-0 text-left md:block">
                <span className="block max-w-[140px] truncate text-sm font-medium leading-tight">
                  {user?.fullName}
                </span>
                <span className="block text-[11px] leading-tight text-gray-400">
                  {user?.role ?? 'Admin'}
                </span>
              </span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="hidden text-gray-400 md:block" aria-hidden="true">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {profileOpen && (
              <div className="anim-fade-in absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-gray-800">{user?.fullName}</p>
                  <p className="truncate text-xs text-gray-400">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
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
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

