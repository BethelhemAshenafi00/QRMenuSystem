import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  ShoppingCart,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { getFoodItem } from "../api/api";
import AppShell from "../components/common/AppShell";
import { useCart } from "../context/useCart";
import type { FoodItem } from "../types";

const API_BASE_URL = "http://localhost:5036";

function getImageUrl(
  imageUrl?: string,
  image?: string
): string {
  const value = imageUrl || image;

  if (!value) {
    return "/placeholder-food.jpg";
  }

  // Already a complete URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  // Backend returns something like:
  // /uploads/menu/image.jpg
  return `${API_BASE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [item, setItem] =
    useState<FoodItem | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    const loadItem = async () => {
      if (!id) {
        setLoading(false);
        setError(true);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const data = await getFoodItem(id);

        setItem(data);
      } catch (error) {
        console.error(
          "Failed to load menu item:",
          error
        );

        setItem(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <AppShell className="px-5 py-10">
        <p className="text-center text-sm font-semibold text-ink-muted">
          Loading menu item...
        </p>
      </AppShell>
    );
  }

  // =========================
  // ERROR / NOT FOUND
  // =========================

  if (error || !item) {
    return (
      <AppShell className="px-5 py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-full border border-hair bg-surface p-3 text-ink shadow-sm"
          aria-label="Go back"
          title="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <p className="text-center text-sm font-semibold text-ink-muted">
          Item not found.
        </p>
      </AppShell>
    );
  }

  // =========================
  // IMAGE URL
  // =========================

  const imageUrl = getImageUrl(
    item.imageUrl,
    item.image
  );

  // =========================
  // PAGE
  // =========================

  return (
    <AppShell>

      {/* =========================
          IMAGE — circular-offset, hyper-rounded
      ========================= */}

      <div className="relative bg-canvas pb-2 pt-2">
        <div className="mx-3 overflow-hidden rounded-[2rem] sm:mx-5 sm:rounded-[2.5rem] lg:mx-8">
          <img
            src={imageUrl}
            alt={item.name}
            className="h-80 w-full object-cover sm:h-96"
            onError={(event) => {
              event.currentTarget.src =
                "/placeholder-food.jpg";
            }}
          />
        </div>

        {/* BACK BUTTON — amber pill bubble */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-8 top-8 rounded-full bg-surface p-3 text-ink shadow-sm ring-1 ring-hair transition hover:scale-110 hover:shadow-md"
          aria-label="Go back"
          title="Go back"
        >
          <ArrowLeft size={20} />
        </button>

      </div>

      {/* =========================
          ITEM INFORMATION
      ========================= */}

      <section className="px-5 py-6 sm:px-8 lg:px-10">

        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">

          <div>

            <h1 className="text-4xl font-extrabold leading-tight text-ink">
              {item.name}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
              {item.description}
            </p>

          </div>

          <p className="shrink-0 rounded-full bg-gradient-to-r from-marigold to-sunset px-5 py-3 text-2xl font-extrabold text-white shadow-sm ring-1 ring-sunset/40">
            ETB {item.price.toFixed(2)}
          </p>

        </div>

      </section>

      {/* =========================
          ADD TO CART
      ========================= */}

      <div className="fixed bottom-0 left-1/2 w-full max-w-5xl -translate-x-1/2 rounded-t-[2rem] border-t border-hair bg-surface px-5 py-4 shadow-[0_-8px_30px_-12px_rgba(42,33,24,0.12)] sm:px-8 lg:absolute lg:left-0 lg:translate-x-0 lg:px-10">

        <button
          type="button"
          onClick={() => {
            addToCart(item);
            navigate("/cart");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-marigold to-sunset px-4 py-4 font-extrabold text-white shadow-sm ring-1 ring-sunset/40 active:scale-[0.98]"
        >
          <ShoppingCart size={18} />

          Add to cart

          <Plus size={16} />
        </button>

      </div>

    </AppShell>
  );
}

export default FoodDetails;