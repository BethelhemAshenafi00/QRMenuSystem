import FoodCard from "./FoodCard";
import type { FoodItem } from "../../types";

interface FoodGridProps {
  items: FoodItem[];
  onItemClick: (item: FoodItem) => void;
  onAdd: (item: FoodItem) => void;
}

function FoodGrid({ items, onItemClick, onAdd }: FoodGridProps) {
  if (items.length === 0) {
    return (
      <p className="mt-8 px-4 text-center text-sm font-semibold text-ink-muted animate-fade-in">
        No items found in this category.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-28 sm:grid-cols-2 sm:gap-5 sm:px-6 lg:grid-cols-3 lg:gap-6 lg:px-10">
      {items.map((item, index) => (
        <div
          key={item.id}
          style={{
            animation: `slideInUp 0.5s ease-out ${index * 0.1}s backwards`,
          }}
          className="transform-gpu transition-all duration-300 hover:z-10"
        >
          <FoodCard
            item={item}
            onClick={() => onItemClick(item)}
            onAdd={() => onAdd(item)}
          />
        </div>
      ))}
    </div>
  );
}

export default FoodGrid;
