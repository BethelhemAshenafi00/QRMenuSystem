import { Beef, Coffee, Flame, IceCreamBowl, Pizza, Salad, Soup, Zap } from "lucide-react";

interface CategoryCardProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const getIconElement = (name: string) => {
  const value = name.toLowerCase();
  const props = { size: 31, strokeWidth: 2 };
  if (value === "all") return <Flame {...props} />;
  if (value.includes("burger")) return <Beef {...props} />;
  if (value.includes("pizza")) return <Pizza {...props} />;
  if (value.includes("drink") || value.includes("coffee")) {
    return <Coffee {...props} />;
  }
  if (value.includes("dessert") || value.includes("ice")) {
    return <IceCreamBowl {...props} />;
  }
  if (value.includes("salad")) return <Salad {...props} />;
  if (value.includes("quick") || value.includes("speed")) return <Zap {...props} />;
  return <Soup {...props} />;
};

function CategoryCard({ name, isActive, onClick }: CategoryCardProps) {
  const icon = getIconElement(name);

  return (
    <button
      onClick={onClick}
      className="group w-20 shrink-0 text-center transition-all duration-300 sm:w-24 lg:w-28 animate-scale-in"
    >
      <span
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ring-1 transition-all duration-300 hover:scale-110 active:scale-95 sm:h-16 sm:w-16 ${
        isActive
          ? "bg-gradient-to-br from-marigold to-sunset text-white shadow-md shadow-marigold/40 scale-105 ring-transparent"
          : "bg-surface text-sunset ring-hair hover:bg-cream hover:text-marigold hover:shadow-sm hover:shadow-marigold/20"
      }`}
      >
        <span className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
          {icon}
        </span>
      </span>
      <span className="mt-2 block truncate text-xs font-bold text-ink transition-all duration-300 group-hover:text-sunset group-hover:scale-110 group-hover:-translate-y-1 sm:mt-3 origin-bottom">
        {name}
      </span>
    </button>
  );
}

export default CategoryCard;
