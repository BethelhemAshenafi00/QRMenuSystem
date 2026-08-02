import { useCart } from "../../context/useCart";
import { Home, ReceiptText, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  restaurantName: string;
  logoUrl?: string;
  tagline?: string;
  tableLabel?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

function Header({ restaurantName, logoUrl, tagline, tableLabel, searchValue = "", onSearchChange }: HeaderProps) {
  const { totalItems, totalPrice } = useCart();

  return (
    <header className="relative border-b border-hair bg-cream px-4 pb-6 pt-4 text-ink sm:px-6 sm:pb-8 sm:pt-6 lg:px-10 animate-fade-in">
      {/* Animated Background Glow — muted amber */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-b-[2rem]">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-marigold to-sunset opacity-[0.07] blur-3xl"></div>
      </div>

      {/* Top Bar - Home and Search */}
      <div className="mb-4 flex items-center justify-between gap-2 sm:gap-3 animate-slide-down">
        <Link
          to="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-marigold to-sunset text-white shadow-sm ring-1 ring-sunset/40 transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-marigold/40 active:scale-90 sm:h-11 sm:w-11"
        >
          <Home size={20} className="sm:size-5" />
        </Link>
        <div className="flex flex-1 items-center gap-2 rounded-full border border-hair bg-surface px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-marigold/10 focus-within:ring-2 focus-within:ring-marigold/40 sm:px-4 sm:py-2.5 group">
          <Search size={18} className="shrink-0 text-ink-muted sm:size-5 transition-transform duration-300 group-hover:scale-110" />
          <input 
            placeholder="find what you crave" 
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="min-w-0 w-full bg-transparent text-xs font-semibold text-ink outline-none placeholder:text-ink-muted/50 sm:text-sm transition-colors duration-300" 
            type="text" 
          />
        </div>
        <Link
          to="/orders/current/progress"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted/60 transition-all duration-300 hover:bg-cream-deep hover:text-sunset hover:scale-110 active:scale-90 sm:h-11 sm:w-11 ring-1 ring-hair bg-surface"
        >
          <ReceiptText size={20} className="sm:size-5" />
        </Link>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-3xl border border-hair bg-surface p-4 shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-marigold/10 sm:p-5 animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
        {/* Logo & Name Section */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Logo */}
          <div className="relative shrink-0 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-marigold to-sunset opacity-20 blur-lg transition-all duration-300 group-hover:opacity-40"></div>
            <img
              src={logoUrl || "https://placehold.co/96x96?text=R"}
              alt={restaurantName}
              className="relative h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-hair transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-marigold/30 sm:h-20 sm:w-20"
            />
          </div>

          {/* Text Content */}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-marigold mb-0.5 animate-slide-right">
              Restaurant
            </p>
            <h1 className="line-clamp-2 text-lg font-extrabold leading-tight text-ink sm:text-2xl transition-all duration-300 origin-left" style={{ animationDelay: "0.2s" }}>
              {restaurantName}
            </h1>
            <p className="line-clamp-2 text-xs font-medium text-ink-muted mt-0.5 sm:text-sm">
              {tagline || "Fresh food, delivered fast"}
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          <div className="rounded-2xl border border-hair bg-cream p-2.5 text-center transition-all duration-300 hover:shadow-sm hover:shadow-marigold/15 hover:scale-105 sm:p-3 group animate-bounce-in" style={{ animationDelay: "0.3s" }}>
            <p className="text-xs font-bold text-sunset mb-1 transition-transform duration-300 group-hover:scale-110">Items in Cart</p>
            <p className="text-lg font-extrabold text-ink sm:text-xl">{totalItems}</p>
          </div>
          <div className="rounded-2xl border border-hair bg-cream p-2.5 text-center transition-all duration-300 hover:shadow-sm hover:shadow-marigold/15 hover:scale-105 sm:p-3 group animate-bounce-in" style={{ animationDelay: "0.4s" }}>
            <p className="text-xs font-bold text-sunset mb-1 transition-transform duration-300 group-hover:scale-110">Total</p>
            <p className="text-lg font-extrabold text-ink sm:text-xl">ETB {totalPrice.toFixed(2)}</p>
          </div>
          <div className="col-span-2 rounded-2xl bg-gradient-to-br from-marigold to-sunset p-2.5 text-center transition-all duration-300 hover:shadow-md hover:shadow-marigold/40 hover:scale-105 sm:col-span-1 sm:p-3 group animate-bounce-in" style={{ animationDelay: "0.5s" }}>
            <p className="text-xs font-bold text-white/90 mb-1 transition-transform duration-300 group-hover:scale-110">Table No.</p>
            <p className="text-lg font-extrabold text-white sm:text-xl">
              {tableLabel ? tableLabel.replace("Table ", "") : "—"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
