import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary';
  loading?: boolean;
}

const variants = {
  primary:   'bg-orange-500 hover:bg-orange-600 text-white shadow-sm',
  danger:    'bg-red-500 hover:bg-red-600 text-white shadow-sm',
  secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm',
};

export default function Button({ variant = 'primary', loading, children, className = '', ...props }: Props) {
  return (
    <button
      disabled={loading || props.disabled}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
