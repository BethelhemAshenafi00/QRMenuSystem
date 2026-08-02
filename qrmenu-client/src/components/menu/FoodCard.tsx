import { Plus } from "lucide-react";
import type { FoodItem } from "../../types";

interface FoodCardProps {
  item: FoodItem;
  onClick: () => void;
  onAdd: () => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") ||
  "http://localhost:5036";

function FoodCard({ item, onClick, onAdd }: FoodCardProps) {
  const imageUrl = item.imageUrl
    ? item.imageUrl.startsWith("http")
      ? item.imageUrl
      : `${API_BASE_URL}${item.imageUrl}`
    : "/placeholder-food.jpg";

  return (
    <div
      onClick={onClick}
      className="group relative min-h-72 cursor-pointer overflow-hidden rounded-3xl border border-hair bg-surface text-ink shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-marigold/15 hover:scale-[1.02] active:scale-[0.98] sm:min-h-64 animate-scale-in"
    >
      {/* Food Image */}
      <img
        src={imageUrl}
        alt={item.name}
        className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-36"
        onError={(e) => {
          e.currentTarget.src = "/placeholder-food.jpg";
        }}
      />

      {/* Image Overlay — soft cream fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />

      {/* Content */}
      <div className="relative z-20 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-base font-extrabold leading-5 text-ink sm:text-lg sm:leading-6">
          {item.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-4 text-ink-muted sm:leading-5">
          {item.description}
        </p>
      </div>

      {/* Price + Add Button */}
      <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between sm:inset-x-4 sm:bottom-4">
        <p className="rounded-full bg-gradient-to-r from-marigold to-sunset px-3 py-1 text-xs font-extrabold text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-marigold/40 sm:text-sm">
          ETB {item.price.toFixed(2)}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          aria-label="Add item"
          title="Add item"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hair bg-cream text-sunset shadow-sm transition-all duration-300 hover:bg-gradient-to-br hover:from-marigold hover:to-sunset hover:text-white hover:scale-110 hover:shadow-md hover:shadow-marigold/40 active:scale-90 sm:h-11 sm:w-11"
        >
          <Plus size={22} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

export default FoodCard;
