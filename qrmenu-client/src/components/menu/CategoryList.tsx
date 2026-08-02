import CategoryCard from "./CategoryCard";
import type { Category } from "../../types";

interface CategoryListProps {
  categories: Category[];
  activeId: number;
  onSelect: (id: number) => void;
}

function CategoryList({ categories, activeId, onSelect }: CategoryListProps) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-5 sm:gap-4 sm:px-6 sm:py-6 lg:px-10 animate-fade-in">
      {categories.map((cat, index) => (
        <div
          key={cat.id}
          style={{
            animation: `slideInDown 0.5s ease-out ${index * 0.08}s backwards`,
          }}
        >
          <CategoryCard
            name={cat.name}
            isActive={cat.id === activeId}
            onClick={() => onSelect(cat.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default CategoryList;
