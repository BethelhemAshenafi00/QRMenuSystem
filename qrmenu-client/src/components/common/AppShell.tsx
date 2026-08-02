import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

function AppShell({ children, className = "" }: AppShellProps) {
  return (
    <main className={`min-h-screen bg-canvas text-ink ${className}`}>
      {/* Animated Background Elements — muted amber organic blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-marigold to-sunset opacity-[0.06] blur-3xl animate-float"></div>
        <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-gradient-to-tl from-marigold to-sunset opacity-[0.06] blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Phone-like frame — hairline border, hyper-rounded */}
      <div className="relative mx-auto min-h-screen w-full max-w-5xl overflow-hidden rounded-3xl bg-surface shadow-[0_1px_0_#fff_inset,0_8px_30px_-12px_rgba(42,33,24,0.08)] ring-1 ring-hair lg:my-3 lg:min-h-[calc(100vh-1.5rem)] lg:rounded-[2rem] animate-fade-in transition-all duration-500">
        {children}
      </div>
    </main>
  );
}

export default AppShell;
