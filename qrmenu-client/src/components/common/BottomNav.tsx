import { Home, ReceiptText, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { label: "Search", icon: Search, action: "search" },
  { to: "/orders/current/progress", label: "Orders", icon: ReceiptText },
];

function BottomNav() {
  const location = useLocation();

  const handleSearch = () => {
    const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.action === "search") {
      handleSearch();
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 w-full">
      <div className="mx-auto grid grid-cols-3 items-center rounded-t-3xl border-t border-hair bg-surface px-2 py-2 text-ink-muted shadow-[0_-4px_20px_-8px_rgba(42,33,24,0.1)] backdrop-blur-md sm:px-3 sm:py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.to && location.pathname === item.to;
          
          if (item.action === "search") {
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                type="button"
                aria-label={item.label}
                title={item.label}
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-90 sm:h-11 sm:w-11 ${
                  isActive ? "bg-gradient-to-br from-marigold to-sunset text-white shadow-md shadow-marigold/40" : "text-ink-muted/60 hover:bg-cream-deep hover:text-sunset"
                }`}
              >
                <Icon size={20} className="sm:size-5" />
              </button>
            );
          }

          if (!item.to) {
            return null;
          }

          return (
            <Link
              key={item.label}
              to={item.to}
              aria-label={item.label}
              title={item.label}
              className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-90 sm:h-11 sm:w-11 ${
                isActive ? "bg-gradient-to-br from-marigold to-sunset text-white shadow-md shadow-marigold/40" : "text-ink-muted/60 hover:bg-cream-deep hover:text-sunset"
              }`}
            >
              <Icon size={20} className="sm:size-5" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
