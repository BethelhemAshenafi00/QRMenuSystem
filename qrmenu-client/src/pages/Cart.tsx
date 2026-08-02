import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppShell from "../components/common/AppShell";
import { useCart } from "../context/useCart";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, "") ||
  "http://localhost:5036";

function getImageUrl(imageUrl?: string, image?: string): string {
  const value = imageUrl || image;

  if (!value) {
    return "/placeholder-food.jpg";
  }

  // Already a complete URL
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  // Backend returns:
  // /uploads/menu/image.jpg
  return `${API_BASE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

function Cart() {
  const navigate = useNavigate();

  const { items, increaseQty, decreaseQty, removeFromCart, totalPrice } =
    useCart();

  return (
    <AppShell>
      {/* =========================
          HEADER
      ========================= */}

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
          <p className="text-xs font-bold uppercase tracking-widest text-sunset">
            Review order
          </p>

          <h1 className="text-2xl font-extrabold text-ink">Your cart</h1>
        </div>
      </header>

      {/* =========================
          EMPTY CART
      ========================= */}

      {items.length === 0 ? (
        <section className="mx-auto max-w-md px-5 py-20 text-center">
          <h2 className="text-3xl font-extrabold text-ink">Cart is empty</h2>

          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Add a dish from the menu to start your order.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-7 rounded-full bg-gradient-to-r from-marigold to-sunset px-7 py-4 text-sm font-extrabold text-white shadow-sm ring-1 ring-sunset/40"
          >
            Browse menu
          </button>
        </section>
      ) : (
        /* =========================
           CART ITEMS
        ========================= */

        <section className="grid gap-4 px-5 py-6 pb-36 sm:px-8 lg:grid-cols-2 lg:px-10">
          {items.map((item) => {
            const imageUrl = getImageUrl(item.imageUrl, item.image);

            return (
              <article
                key={item.id}
                className="flex gap-4 rounded-3xl border border-hair bg-surface p-4 shadow-sm"
              >
                {/* =========================
                    FOOD IMAGE
                ========================= */}

                <img
                  src={imageUrl}
                  alt={item.name}
                  className="h-28 w-28 shrink-0 rounded-[1.25rem] object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "/placeholder-food.jpg";
                  }}
                />

                {/* =========================
                    ITEM INFORMATION
                ========================= */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="truncate text-base font-extrabold text-ink">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-lg font-extrabold text-sunset">
                        ETB {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-full p-2 text-ink-muted/50 transition hover:bg-cream-deep hover:text-alert"
                      aria-label={`Remove ${item.name}`}
                      title={`Remove ${item.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  {/* =========================
                      QUANTITY CONTROLS
                  ========================= */}

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decreaseQty(item.id)}
                      className="rounded-full border border-hair bg-cream p-2 text-ink transition hover:bg-cream-deep active:scale-90"
                      aria-label={`Decrease ${item.name}`}
                      title={`Decrease ${item.name}`}
                    >
                      <Minus size={15} />
                    </button>

                    <span className="w-6 text-center text-sm font-extrabold text-ink">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => increaseQty(item.id)}
                      className="rounded-full bg-gradient-to-br from-marigold to-sunset p-2 text-white transition hover:shadow-md hover:shadow-marigold/40 active:scale-90"
                      aria-label={`Increase ${item.name}`}
                      title={`Increase ${item.name}`}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* =========================
          CHECKOUT FOOTER
      ========================= */}

      {items.length > 0 && (
        <footer className="fixed bottom-0 left-1/2 w-full max-w-5xl -translate-x-1/2 rounded-t-[2rem] border-t border-hair bg-surface px-5 py-4 shadow-[0_-8px_30px_-12px_rgba(42,33,24,0.12)] sm:px-8 lg:absolute lg:left-0 lg:translate-x-0 lg:px-10">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold text-ink-muted">Total</span>

            <span className="text-2xl font-extrabold text-sunset">
              ETB {totalPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="w-full rounded-full bg-gradient-to-r from-marigold to-sunset px-4 py-4 font-extrabold text-white shadow-sm ring-1 ring-sunset/40 active:scale-[0.98]"
          >
            Checkout
          </button>
        </footer>
      )}
    </AppShell>
  );
}

export default Cart;
