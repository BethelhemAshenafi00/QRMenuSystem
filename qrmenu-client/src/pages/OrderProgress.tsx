import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChefHat, Clock3, ReceiptText } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getOrderProgress } from "../api/api";
import AppShell from "../components/common/AppShell";
import type { OrderProgress, OrderStatus } from "../types";

const steps: Array<{
  status: OrderStatus;
  label: string;
  description: string;
}> = [
  {
    status: "sent_to_kitchen",
    label: "Sent to kitchen",
    description: "The restaurant received your order.",
  },
  {
    status: "preparing",
    label: "Preparing",
    description: "The kitchen is preparing your food.",
  },
  {
    status: "ready",
    label: "Ready",
    description: "Your order is ready to serve.",
  },
  {
    status: "served",
    label: "Served",
    description: "Enjoy your meal.",
  },
];

const statusRank = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "received") return 0;
  const index = steps.findIndex((step) => step.status === normalized);
  return index >= 0 ? index + 1 : 1;
};

function OrderProgressPage() {
  const { id } = useParams();
  const location = useLocation();
  const initialState = location.state as
    | {
        orderNumber?: string | number;
        customerName?: string;
        status?: string;
        tableNumber?: string;
      }
    | undefined;
  const [order, setOrder] = useState<
    OrderProgress & { estimatedMinutes?: number; orderNumber?: string }
  >({
    orderNumber: String(initialState?.orderNumber ?? id ?? ""),
    status: initialState?.status ?? "sent_to_kitchen",
    tableNumber: initialState?.tableNumber,
  });

  useEffect(() => {
    if (!id) return;

    const loadProgress = async () => {
      try {
        const nextOrder = await getOrderProgress(id);
        setOrder((prev) => ({ ...prev, ...nextOrder }));
      } catch (error) {
        console.warn("Order progress is using the latest local status.", error);
      }
    };

    loadProgress();
    const intervalId = window.setInterval(loadProgress, 5000);
    return () => window.clearInterval(intervalId);
  }, [id]);

  const activeRank = useMemo(
    () => statusRank(order.status || "sent_to_kitchen"),
    [order.status]
  );

  return (
    <AppShell>
      <section className="border-b border-hair bg-cream px-5 pb-12 pt-8 sm:px-8 lg:px-10">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-gradient-to-br from-marigold to-sunset p-3 text-white shadow-sm ring-1 ring-sunset/40">
            <ReceiptText size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sunset">
              {order.tableNumber ? `Table ${order.tableNumber}` : "Order"}
            </p>
            <h1 className="text-3xl font-extrabold text-ink">
              Order progress
            </h1>
            {order.orderNumber && (
              <p className="mt-1 text-sm text-ink-muted">
                Order #{order.orderNumber}
              </p>
            )}
          </div>
        </div>

      </section>

      <section className="mx-5 -mt-7 rounded-3xl border border-hair bg-surface p-5 shadow-sm sm:mx-8 lg:mx-10">
        <div className="space-y-5">
          {steps.map((step, index) => {
            const stepRank = index + 1;
            const isDone = activeRank > stepRank;
            const isActive = activeRank === stepRank;
            return (
              <div key={step.status} className="flex gap-3">
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ${
                    isDone || isActive
                      ? "bg-gradient-to-br from-marigold to-sunset text-white ring-transparent"
                      : "border border-hair bg-cream text-ink-muted/50"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 size={18} />
                  ) : isActive ? (
                    <ChefHat size={18} />
                  ) : (
                    <Clock3 size={18} />
                  )}
                </div>
                <div>
                  <h2
                    className={`text-sm font-extrabold ${
                      isDone || isActive ? "text-ink" : "text-ink-muted/50"
                    }`}
                  >
                    {step.label}
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-ink-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {order.estimatedMinutes && (
          <p className="mt-6 rounded-full border border-hair bg-cream px-4 py-3 text-sm font-bold text-ink">
            Estimated time: {order.estimatedMinutes} minutes
          </p>
        )}
      </section>

      <Link
        to="/"
        className="mx-5 mt-5 block rounded-full bg-gradient-to-r from-marigold to-sunset px-4 py-4 text-center font-extrabold text-white shadow-sm ring-1 ring-sunset/40 sm:mx-8 lg:mx-10"
      >
        Back to menu
      </Link>
    </AppShell>
  );
}

export default OrderProgressPage;
