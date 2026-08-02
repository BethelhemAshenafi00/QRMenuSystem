import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/categories';
import { getMenuItems } from '../../api/menuItems';
import { getOrders } from '../../api/orders';
import { getTables } from '../../api/tables';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import type { Order, OrderStatus } from '../../types';

/* ============================================================
   Small line sparkline (inline SVG, no dependencies)
   ============================================================ */
function Sparkline({ data, color = '#f97316' }: { data: number[]; color?: string }) {
  const w = 96;
  const h = 30;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((value - min) / range) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const area = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   KPI stat card
   ============================================================ */
interface Kpi {
  label: string;
  value: number;
  icon: string;
  trend: string;
  trendUp: boolean;
  spark: number[];
  color: string;
}

const kpiMeta: { label: string; icon: string; color: string }[] = [
  { label: 'Total Categories', icon: '🗂️', color: '#6366f1' },
  { label: 'Menu Items', icon: '🍽️', color: '#f97316' },
  { label: 'Tables', icon: '🪑', color: '#0ea5e9' },
  { label: 'Pending Orders', icon: '📋', color: '#d97706' },
];

function StatCard({ kpi, index }: { kpi: Kpi; index: number }) {
  return (
    <div
      className="anim-rise-in rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)] sm:p-5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-lg">
            {kpi.icon}
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-gray-800">
            {kpi.value}
          </p>
          <p className="text-sm text-gray-500">{kpi.label}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Sparkline data={kpi.spark} color={kpi.color} />
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
              kpi.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
            }`}
          >
            {kpi.trendUp ? '▲' : '▼'} {kpi.trend}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Order status → functional color mapping
   ============================================================ */
const statusColor: Record<OrderStatus, string> = {
  Pending: '#d97706', // amber — awaiting
  Confirmed: '#2563eb', // blue
  Preparing: '#ea6a0f', // orange
  Ready: '#16a34a', // green
  Delivered: '#16a34a', // green
  Cancelled: '#dc2626', // red — critical
};

const badgeColor: Record<OrderStatus, 'amber' | 'blue' | 'orange' | 'green' | 'red' | 'gray'> = {
  Pending: 'amber',
  Confirmed: 'blue',
  Preparing: 'orange',
  Ready: 'green',
  Delivered: 'gray',
  Cancelled: 'red',
};

/* ============================================================
   Dashboard page
   ============================================================ */
export default function DashboardPage() {
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data: menuItems } = useQuery({ queryKey: ['menuItems'], queryFn: getMenuItems });
  const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: getOrders });
  const { data: tables } = useQuery({ queryKey: ['tables'], queryFn: getTables });

  const kpis: Kpi[] = useMemo(() => {
    const pendingOrders = orders?.filter((o) => o.status === 'Pending').length ?? 0;

    return [
      {
        label: kpiMeta[0].label,
        value: categories?.length ?? 0,
        icon: kpiMeta[0].icon,
        color: kpiMeta[0].color,
        trend: categories?.length ? '+12%' : '0%',
        trendUp: (categories?.length ?? 0) >= 1,
        spark: [2, 3, 2, 4, 3, 5, 4],
      },
      {
        label: kpiMeta[1].label,
        value: menuItems?.length ?? 0,
        icon: kpiMeta[1].icon,
        color: kpiMeta[1].color,
        trend: menuItems?.length ? '+8%' : '0%',
        trendUp: (menuItems?.length ?? 0) >= 1,
        spark: [4, 4, 6, 5, 7, 8, 9],
      },
      {
        label: kpiMeta[2].label,
        value: tables?.length ?? 0,
        icon: kpiMeta[2].icon,
        color: kpiMeta[2].color,
        trend: tables?.length ? '+4%' : '0%',
        trendUp: (tables?.length ?? 0) >= 1,
        spark: [3, 3, 4, 4, 4, 5, 5],
      },
      {
        label: kpiMeta[3].label,
        value: pendingOrders,
        icon: kpiMeta[3].icon,
        color: kpiMeta[3].color,
        trend: pendingOrders ? '+2' : '0',
        trendUp: pendingOrders >= 1,
        spark: [1, 2, 2, 3, 2, 2, pendingOrders || 1],
      },
    ];
  }, [categories, menuItems, orders, tables]);

  // Status distribution for progress bars
  const statusCounts = useMemo(() => {
    const counts = new Map<OrderStatus, number>();
    (Object.keys(statusColor) as OrderStatus[]).forEach((s) => counts.set(s, 0));
    orders?.forEach((o) => counts.set(o.status, (counts.get(o.status) ?? 0) + 1));
    return counts;
  }, [orders]);

  const totalOrders = orders?.length ?? 0;

  // Finance summary
  const finance = useMemo(() => {
    const dineIn = orders?.filter((o) => o.orderType?.toLowerCase().includes('dine')).reduce((s, o) => s + Number(o.totalAmount || 0), 0) ?? 0;
    const takeaway = orders?.filter((o) => o.orderType?.toLowerCase().includes('take')).reduce((s, o) => s + Number(o.totalAmount || 0), 0) ?? 0;
    const total = dineIn + takeaway;
    return { dineIn, takeaway, total };
  }, [orders]);

  const maxRevenue = Math.max(finance.dineIn, finance.takeaway, 1);

  // Recent activities (latest orders, most recent first)
  const recent = useMemo(() => [...(orders ?? [])].slice(-5).reverse(), [orders]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="anim-fade-in">
        <h1 className="text-xl font-bold tracking-tight text-gray-800 sm:text-2xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your restaurant performance today.
        </p>
      </div>

      {/* KPI Statistics — 4 cols inline → 1 col stacked */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => (
          <StatCard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main column (2/3) */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          {/* Order Fulfillment — dynamic progress bars */}
          <Card
            as="section"
            title="Order Fulfillment"
            subtitle="Progress across order statuses"
            action={
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {totalOrders} total
              </span>
            }
          >
            <div className="space-y-4">
              {(Object.keys(statusColor) as OrderStatus[]).map((status) => {
                const count = statusCounts.get(status) ?? 0;
                const pct = totalOrders ? Math.round((count / totalOrders) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-gray-700">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: statusColor[status] }}
                        />
                        {status}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {count} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="anim-grow-bar h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: statusColor[status],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Finance Summary — revenue split + bar chart */}
          <Card
            as="section"
            title="Finance Summary"
            subtitle="Revenue by order type"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Total Revenue
                </p>
                <p className="mt-1 text-xl font-bold text-gray-800 sm:text-2xl">
                  Birr {finance.total.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Dine In
                </p>
                <p className="mt-1 text-lg font-bold text-gray-800">
                  Birr {finance.dineIn.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Takeaway
                </p>
                <p className="mt-1 text-lg font-bold text-gray-800">
                  Birr {finance.takeaway.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Bar chart */}
            <div className="mt-5">
              <div className="flex h-40 items-end gap-6 rounded-xl border border-gray-100 bg-white px-4 py-3 sm:gap-10">
                {[
                  { label: 'Dine In', value: finance.dineIn },
                  { label: 'Takeaway', value: finance.takeaway },
                ].map((bar) => (
                  <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">
                      Birr {bar.value.toFixed(0)}
                    </span>
                    <div
                      className="anim-grow-bar w-full max-w-[80px] rounded-t-lg"
                      style={{
                        height: `${Math.max((bar.value / maxRevenue) * 100, 6)}%`,
                        backgroundColor: '#f97316',
                      }}
                    />
                    <span className="text-xs font-medium text-gray-500">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right rail (1/3) — Recent Activities */}
        <div className="lg:col-span-1">
          <Card
            as="section"
            title="Recent Activities"
            subtitle="Latest customer orders"
            className="lg:sticky lg:top-24"
          >
            {!recent.length ? (
              <p className="text-sm text-gray-400">No activity yet.</p>
            ) : (
              <ul className="space-y-4">
                {recent.map((order: Order) => (
                  <li key={order.id} className="flex items-start gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: statusColor[order.status] }}
                    >
                      {order.tableNumber ? `T${order.tableNumber}` : 'TA'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          Order #{order.id}
                        </p>
                        <span className="shrink-0 text-xs text-gray-400">
                          {order.orderType?.toLowerCase().includes('dine') ? 'Dine In' : 'Takeaway'}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {order.tableNumber
                          ? `Table ${order.tableNumber}`
                          : 'Takeaway'}{' '}
                        · Birr {Number(order.totalAmount || 0).toFixed(2)}
                      </p>
                      <div className="mt-1.5">
                        <Badge label={order.status} color={badgeColor[order.status]} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

