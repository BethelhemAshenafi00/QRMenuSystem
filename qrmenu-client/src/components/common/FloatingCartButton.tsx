import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/useCart";

function FloatingCartButton() {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <button
      className="group fixed bottom-16 left-1/2 z-30 flex w-[calc(100%-1rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-hair bg-surface px-4 py-3 text-ink shadow-[0_8px_30px_-12px_rgba(42,33,24,0.18)] transition-all duration-300 hover:shadow-[0_12px_36px_-12px_rgba(232,118,45,0.35)] hover:scale-105 active:scale-95 sm:bottom-24 sm:px-5 sm:py-4 animate-slide-in-up"
      onClick={() => navigate("/cart")}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Cart icon */}
        <div className="rounded-full bg-gradient-to-br from-marigold to-sunset p-2 text-white shadow-sm ring-1 ring-sunset/40 transition-all duration-300 hover:scale-125 animate-pulse-soft sm:p-2.5">
          <ShoppingCart size={16} className="sm:size-5" />
        </div>

        {/* Item count — crimson alert bubble (Contrast Isolation) */}
        <div className="relative flex items-center gap-2">
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-alert px-2 text-xs font-extrabold text-white shadow-sm ring-2 ring-white">
            {totalItems}
          </span>
          <span className="text-xs font-bold text-ink-muted sm:text-sm transition-all duration-300 group-hover:scale-110">
            {totalItems === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      <span className="rounded-full bg-gradient-to-r from-marigold to-sunset px-3 py-1 text-xs font-extrabold text-white shadow-sm ring-1 ring-sunset/40 transition-all duration-300 hover:scale-110 sm:px-3 sm:py-1 sm:text-sm">
        ETB {totalPrice.toFixed(2)}
      </span>
    </button>
  );
}

export default FloatingCartButton;
