import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getOrders,
  updateOrder,
  deleteOrder,
} from "../../api/orders";

import type {
  Order,
  OrderStatus,
} from "../../types";

import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const statusColor: Record<
  string,
  "yellow" | "blue" | "orange" | "green" | "red" | "gray"
> = {
  Pending: "yellow",
  Confirmed: "blue",
  Preparing: "orange",
  Ready: "green",
  Delivered: "gray",
  Cancelled: "red",
};

const nextStatus: Partial<
  Record<OrderStatus, OrderStatus>
> = {
  Pending: "Confirmed",
  Confirmed: "Preparing",
  Preparing: "Ready",
  Ready: "Delivered",
};

/**
 * Convert backend order type into a
 * user-friendly admin display value.
 *
 * Backend:
 * DineIn
 * Takeaway
 *
 * Also supports:
 * dine_in
 * dinein
 * takeaway
 */
function formatOrderType(type: string) {
  const normalized = type
    .replace(/[_\s-]/g, "")
    .toLowerCase();

  if (normalized === "dinein") {
    return "Dine In";
  }

  if (normalized === "takeaway") {
    return "Takeaway";
  }

  return type;
}

export default function OrdersPage() {
  const queryClient = useQueryClient();

  // ==========================================
  // GET ORDERS
  // ==========================================

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // ==========================================
  // ADVANCE ORDER STATUS
  // ==========================================

  const {
    mutate: advance,
    isPending: isAdvancing,
  } = useMutation({
    mutationFn: async ({
      order,
    }: {
      order: Order;
    }) => {
      const next = nextStatus[order.status];

      if (!next) {
        throw new Error(
          "No next status available."
        );
      }

      /**
       * IMPORTANT:
       *
       * Do NOT send the complete Order object.
       *
       * The backend UpdateOrderRequest expects:
       *
       * {
       *   orderType,
       *   status,
       *   totalAmount,
       *   tableId
       * }
       *
       * Items are returned by the backend but
       * are not required when updating status.
       */

      const payload: {
        orderType: Order["orderType"];
        status: OrderStatus;
        totalAmount: Order["totalAmount"];
        tableId: Order["tableId"];
      } = {
        orderType: order.orderType,
        status: next,
        totalAmount: order.totalAmount,
        tableId: order.tableId,
      };

      // Type assertion: backend expects a partial payload for updates,
      // but updateOrder is typed to accept an Order. Cast to satisfy TS.
      return updateOrder(order.id, payload as unknown as Order);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },

    onError: (error) => {
      console.error(
        "Failed to update order:",
        error
      );
    },
  });

  // ==========================================
  // DELETE ORDER
  // ==========================================

  const {
    mutate: remove,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: deleteOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },

    onError: (error) => {
      console.error(
        "Failed to delete order:",
        error
      );
    },
  });

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Orders
        </h1>

        <p className="text-gray-400">
          Loading orders...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (isError) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Orders
        </h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          Failed to load orders.
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div>
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer orders and update
          their status.
        </p>
      </div>

      {/* ======================================
          EMPTY
      ====================================== */}

      {!orders?.length ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-400">
            No orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {orders.map((order) => {

            const next =
              nextStatus[order.status];

            const isThisOrderAdvancing =
              isAdvancing;

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >

                {/* =================================
                    ORDER HEADER
                ================================= */}

                <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">

                    {/* ORDER ID */}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Order ID
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-800">
                        #{order.id}
                      </p>
                    </div>

                    {/* TABLE */}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Table
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {order.tableNumber
                          ? `Table ${order.tableNumber}`
                          : "Takeaway"}
                      </p>
                    </div>

                    {/* TYPE */}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Type
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {formatOrderType(
                          order.orderType
                        )}
                      </p>
                    </div>

                    {/* STATUS */}

                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Status
                      </p>

                      <Badge
                        label={order.status}
                        color={
                          statusColor[
                            order.status
                          ] ?? "gray"
                        }
                      />
                    </div>

                    {/* AMOUNT */}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Amount
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-800">
                        Birr{" "}
                        {Number(
                          order.totalAmount
                        ).toFixed(2)}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Actions
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {next && (
                          <Button
                            variant="secondary"
                            disabled={
                              isThisOrderAdvancing ||
                              isDeleting
                            }
                            onClick={() =>
                              advance({
                                order,
                              })
                            }
                          >
                            →
                            {" "}
                            {next}
                          </Button>
                        )}

                        <Button
                          variant="danger"
                          disabled={
                            isThisOrderAdvancing ||
                            isDeleting
                          }
                          onClick={() =>
                            remove(order.id)
                          }
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </Button>

                      </div>
                    </div>

                  </div>

                </div>

                {/* =================================
                    ORDER ITEMS
                ================================= */}

                <div className="px-5 py-5">

                  <div className="mb-3 flex items-center justify-between">

                    <h2 className="text-sm font-bold text-gray-800">
                      Order Items
                    </h2>

                    <span className="text-xs font-medium text-gray-400">
                      {order.items?.length ?? 0}{" "}
                      item
                      {order.items?.length === 1
                        ? ""
                        : "s"}
                    </span>

                  </div>

                  {/* NO ITEMS */}

                  {!order.items?.length ? (
                    <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-400">
                      No item details available.
                    </div>
                  ) : (

                    /* ITEMS TABLE */

                    <div className="overflow-x-auto">

                      <table className="w-full min-w-[700px]">

                        <thead>

                          <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">

                            <th className="pb-3 pr-4">
                              Category
                            </th>

                            <th className="pb-3 pr-4">
                              Item
                            </th>

                            <th className="pb-3 pr-4">
                              Quantity
                            </th>

                            <th className="pb-3 pr-4">
                              Unit Price
                            </th>

                            <th className="pb-3 text-right">
                              Total
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {order.items.map(
                            (item, index) => (

                              <tr
                                key={`${order.id}-${item.menuItemId}-${index}`}
                                className="border-b border-gray-50 last:border-0"
                              >

                                {/* CATEGORY */}

                                <td className="py-3 pr-4 text-sm text-gray-500">
                                  {item.categoryName ||
                                    "—"}
                                </td>

                                {/* ITEM */}

                                <td className="py-3 pr-4">

                                  <p className="text-sm font-semibold text-gray-800">
                                    {item.itemName}
                                  </p>

                                </td>

                                {/* QUANTITY */}

                                <td className="py-3 pr-4">

                                  <span className="inline-flex rounded-lg bg-orange-50 px-2.5 py-1 text-sm font-bold text-orange-600">
                                    ×{" "}
                                    {item.quantity}
                                  </span>

                                </td>

                                {/* UNIT PRICE */}

                                <td className="py-3 pr-4 text-sm text-gray-600">
                                  Birr{" "}
                                  {Number(
                                    item.unitPrice
                                  ).toFixed(2)}
                                </td>

                                {/* TOTAL */}

                                <td className="py-3 text-right text-sm font-bold text-gray-800">
                                  Birr{" "}
                                  {Number(
                                    item.totalPrice
                                  ).toFixed(2)}
                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}
