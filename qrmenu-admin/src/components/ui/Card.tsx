import type { ReactNode } from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Defaults to `div`; set `section` when the card is a distinct page module. */
  as?: 'div' | 'section';
}

/**
 * Standard content container.
 * White card over the muted canvas with consistent padding:
 * 24px (p-6) on desktop, 16px (p-4) on mobile.
 */
export default function Card({
  title,
  subtitle,
  action,
  children,
  className = '',
  as: Tag = 'div',
}: Props) {
  return (
    <Tag
      className={[
        'rounded-2xl border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]',
        'p-4 sm:p-6',
        className,
      ].join(' ')}
    >
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            {title && (
              <h2 className="text-sm font-semibold tracking-tight text-gray-800 sm:text-base">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </Tag>
  );
}

