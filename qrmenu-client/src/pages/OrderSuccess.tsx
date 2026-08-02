import { CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AppShell from "../components/common/AppShell";

function OrderSuccess() {
  const location = useLocation();
  const state = location.state as
    | { orderNumber?: string | number; customerName?: string }
    | undefined;

  return (
    <AppShell>
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="w-full max-w-sm rounded-[2rem] border border-hair bg-surface p-6 text-center shadow-sm">
          <CheckCircle2 size={54} className="mx-auto text-marigold" />
          <h1 className="mt-4 text-2xl font-extrabold text-ink">
            Order placed
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            {state?.customerName ? `${state.customerName}, your` : "Your"} order
            was sent to the restaurant.
          </p>
          {state?.orderNumber && (
            <p className="mt-4 rounded-full border border-hair bg-cream px-4 py-3 text-sm font-bold text-ink">
              Order #{state.orderNumber}
            </p>
          )}
          <Link
            to="/"
            className="mt-6 block rounded-full bg-gradient-to-r from-marigold to-sunset px-4 py-3 font-extrabold text-white shadow-sm ring-1 ring-sunset/40"
          >
            Back to menu
          </Link>
        </section>
      </main>
    </AppShell>
  );
}

export default OrderSuccess;
