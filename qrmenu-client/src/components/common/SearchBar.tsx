import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative z-10 px-4 py-3 sm:px-6 lg:px-10 animate-fade-in">
      <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-full border border-hair bg-surface px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-marigold/10 focus-within:ring-2 focus-within:ring-marigold/40 sm:px-5 sm:py-4">
        <Search size={20} className="shrink-0 text-sunset transition-transform duration-300 sm:size-6" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="find what you crave"
          className="min-w-0 w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-ink-muted/50 sm:text-base lg:text-lg transition-colors duration-300"
        />
      </div>
    </div>
  );
}

export default SearchBar;
