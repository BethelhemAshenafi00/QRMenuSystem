import { useState, type FormEvent } from "react";
import { ArrowLeft, Loader2, ShoppingBag, Utensils } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { placeOrder } from "../api/api";
import AppShell from "../components/common/AppShell";
import { useCart } from "../context/useCart";
import type { CheckoutCustomer } from "../types";

import {
  getSavedTableId,
  getSavedTableNumber,
  getTableIdFromSearchParams,
  getTableNumberFromSearchParams,
  saveTableId,
  saveTableNumber,
} from "../utils/tableSession";

function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // =====================================
  // TABLE FROM QR CODE / SESSION
  // =====================================

  const qrTableId = getTableIdFromSearchParams(searchParams);

  const qrTableNumber = getTableNumberFromSearchParams(searchParams);

  const savedTableId = getSavedTableId();

  const savedTableNumber = getSavedTableNumber();

  const tableId = qrTableId ?? savedTableId;

  const tableNumber = qrTableNumber || savedTableNumber || "";

  // =====================================
  // CART
  // =====================================

  const { items, totalPrice, clearCart } = useCart();

  // =====================================
  // CUSTOMER / ORDER STATE
  // =====================================

  const [customer, setCustomer] = useState<CheckoutCustomer>({
    name: "",
    phone: "",
    tableNumber,
    orderType: "dine_in",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  // =====================================
  // UPDATE FORM FIELD
  // =====================================

  const updateField = (field: keyof CheckoutCustomer, value: string) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================
  // SUBMIT ORDER
  // =====================================

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault();

    // -------------------------------------
    // CART VALIDATION
    // -------------------------------------

    if (items.length === 0) {
      navigate("/");
      return;
    }

    // -------------------------------------
    // TABLE VALIDATION
    // -------------------------------------

    if (!tableId) {
      setError(
        "This menu is not connected to a table. Please scan the table QR code again.",
      );

      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // -------------------------------------
      // SAVE TABLE INFORMATION
      // -------------------------------------

      saveTableId(tableId);

      if (tableNumber) {
        saveTableNumber(tableNumber);
      }

      // -------------------------------------
      // BACKEND ENUM
      //
      // DineIn = 0
      // Takeaway = 1
      // -------------------------------------

      const orderType = customer.orderType === "dine_in" ? 0 : 1;

      // -------------------------------------
      // IMPORTANT
      //
      // BOTH DINE-IN AND TAKEAWAY USE
      // THE TABLE FROM THE QR CODE.
      // -------------------------------------

      const payload = {
        orderType,
        totalAmount: totalPrice,

        // Database Table.Id
        tableId,

        items: items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      };

      console.log("Sending order payload:", JSON.stringify(payload, null, 2));

      // -------------------------------------
      // SEND TO API
      // -------------------------------------

      const order = await placeOrder(payload);

      console.log("Order created:", order);

      // -------------------------------------
      // ORDER ID
      // -------------------------------------

      const orderId = order.id;

      // -------------------------------------
      // CLEAR CART ONLY AFTER SUCCESS
      // -------------------------------------

      clearCart();

      // -------------------------------------
      // ORDER PROGRESS
      // -------------------------------------

      if (orderId) {
        navigate(`/orders/${orderId}/progress`, {
          state: {
            orderId: order.id,
            status: order.status,

            // Always show the QR table
            tableNumber: tableNumber || order.tableNumber || undefined,
          },
        });
      } else {
        navigate("/order-success");
      }
    } catch (err: unknown) {
      console.error("Failed to place order:", err);

      // -------------------------------------
      // READ API ERROR
      // -------------------------------------

      const errorResponse = err as {
        response?: {
          data?: {
            title?: string;
            message?: string;
            errors?: Record<string, string[]>;
          };
        };
      };

      const responseData = errorResponse.response?.data;

      console.log("FULL API ERROR:", JSON.stringify(responseData, null, 2));

      // -------------------------------------
      // ASP.NET VALIDATION ERRORS
      // -------------------------------------

      if (responseData?.errors) {
        const validationErrors = Object.values(responseData.errors)
          .flat()
          .join(" ");

        setError(validationErrors || "Invalid order information.");
      } else {
        setError(
          responseData?.message ||
            responseData?.title ||
            "Could not place the order. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <AppShell>
      {/* HEADER */}

      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-hair bg-cream px-5 py-5 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-sunset ring-1 ring-hair"
          aria-label="Go back"
          title="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-sunset">Almost there</p>

          <h1 className="text-2xl font-extrabold text-ink">Checkout</h1>
        </div>
      </header>

      {/* CHECKOUT FORM */}

      <form
        onSubmit={submitOrder}
        className="grid gap-5 px-5 py-6 pb-10 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10"
      >
        {/* ORDER INFORMATION */}

        <section className="rounded-3xl border border-hair bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-extrabold text-ink">
            Order information
          </h2>

          <div className="mt-4 space-y-3">
            {/* ORDER TYPE */}

            <div className="grid grid-cols-2 gap-3">
              {/* DINE IN */}

              <button
                type="button"
                onClick={() => updateField("orderType", "dine_in")}
                className={`flex items-center justify-center gap-2 rounded-full px-4 py-4 text-sm font-extrabold transition ${
                  customer.orderType === "dine_in"
                    ? "bg-gradient-to-r from-marigold to-sunset text-white shadow-sm ring-1 ring-sunset/40"
                    : "border border-hair bg-cream text-ink"
                }`}
              >
                <Utensils size={18} />
                Dine in
              </button>

              {/* TAKEAWAY */}

              <button
                type="button"
                onClick={() => updateField("orderType", "takeaway")}
                className={`flex items-center justify-center gap-2 rounded-full px-4 py-4 text-sm font-extrabold transition ${
                  customer.orderType === "takeaway"
                    ? "bg-gradient-to-r from-marigold to-sunset text-white shadow-sm ring-1 ring-sunset/40"
                    : "border border-hair bg-cream text-ink"
                }`}
              >
                <ShoppingBag size={18} />
                Takeaway
              </button>
            </div>

            {/* TABLE FROM QR */}

            <div className="rounded-3xl border border-hair bg-cream px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-wide text-sunset">
                Table
              </p>

              <p className="mt-1 text-lg font-extrabold text-ink">
                {tableNumber ? `Table ${tableNumber}` : "Table from QR code"}
              </p>

              <p className="mt-1 text-xs text-ink-muted">
                This table was automatically selected from the QR code.
              </p>
            </div>

            {/* NOTES */}

            <textarea
              value={customer.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Special notes"
              rows={4}
              className="w-full resize-none rounded-3xl border border-hair bg-cream px-4 py-4 text-sm font-semibold text-ink outline-none placeholder:text-ink-muted/40 focus:ring-2 focus:ring-marigold/50"
            />
          </div>
        </section>

        {/* ORDER SUMMARY */}

        <section className="rounded-3xl bg-gradient-to-br from-marigold to-sunset p-5 text-white shadow-md shadow-marigold/30">
          <h2 className="text-xl font-extrabold">Order summary</h2>

          <p className="mt-1 text-sm font-semibold text-white/80">
            {customer.orderType === "dine_in"
              ? "Dine-in order"
              : "Takeaway order"}
          </p>

          {/* CART ITEMS */}

          <div className="mt-3 space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="min-w-0 truncate text-white/80">
                  {item.quantity} x {item.name}
                </span>

                <span className="font-bold text-white">
                  ETB {(item.quantity * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* TOTAL */}

          <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-5">
            <span className="font-semibold text-white/80">Total</span>

            <span className="text-3xl font-extrabold text-white">
              ETB {totalPrice.toFixed(2)}
            </span>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-surface px-4 py-4 font-extrabold text-sunset shadow-sm disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-white/60"
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}

            {isSubmitting ? "Placing order..." : "Place order"}
          </button>
        </section>

        {/* ERROR — crimson alert bubble */}
        {error && (
          <div className="rounded-full bg-alert px-5 py-3 text-sm font-bold text-white shadow-sm ring-1 ring-alert/40 lg:col-span-2">
            <span className="mr-1">⚠</span>
            {error}
          </div>
        )}
      </form>
    </AppShell>
  );
}

export default Checkout;
