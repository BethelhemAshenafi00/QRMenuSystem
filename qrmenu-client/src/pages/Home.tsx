import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "../components/common/Header";
import AppShell from "../components/common/AppShell";
import CategoryList from "../components/menu/CategoryList";
import FoodGrid from "../components/menu/FoodGrid";
import FloatingCartButton from "../components/common/FloatingCartButton";

import { useCart } from "../context/useCart";

import {
  getCategories,
  getFoodItems,
} from "../api/api";

import type {
  Category,
  FoodItem,
  RestaurantInfo,
} from "../types";

import {
  getSavedTableNumber,
  getTableNumberFromSearchParams,
  saveTableNumber,
} from "../utils/tableSession";

function Home() {
  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] =
    useState(0);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [foods, setFoods] =
    useState<FoodItem[]>([]);

  // Temporary restaurant information
  // until the backend has a restaurant endpoint.
  const [restaurant] =
    useState<RestaurantInfo>({
      name: "My Restaurant",
      tagline: "Welcome to our menu",
    });

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const { addToCart } = useCart();

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  // =====================================
  // TABLE NUMBER
  // =====================================

  const scannedTableNumber =
    getTableNumberFromSearchParams(
      searchParams
    );

  const tableNumber =
    scannedTableNumber ||
    getSavedTableNumber();

  // =====================================
  // SAVE TABLE NUMBER
  // =====================================

  useEffect(() => {
    if (scannedTableNumber) {
      saveTableNumber(
        scannedTableNumber
      );
    }
  }, [scannedTableNumber]);

  // =====================================
  // LOAD CATEGORIES + MENU
  // =====================================

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load only APIs that currently exist
        const [
          categoryData,
          foodData,
        ] = await Promise.all([
          getCategories(),
          getFoodItems(),
        ]);

        // Add "All" category
        setCategories([
          {
            id: 0,
            name: "All",
          },
          ...categoryData.filter(
            (category) =>
              category.name
                .toLowerCase() !==
              "all"
          ),
        ]);

        // Real menu items created by Admin
        setFoods(foodData);

      } catch (error) {
        console.error(
          "Failed to load menu:",
          error
        );

        setError(
          "Unable to load the menu. Please try again."
        );

        setFoods([]);

      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();
  }, []);

  // =====================================
  // FILTER FOOD ITEMS
  // =====================================

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {

      const matchesCategory =
        activeCategory === 0 ||
        food.categoryId ===
          activeCategory;

      const matchesSearch =
        food.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        matchesCategory &&
        matchesSearch
      );
    });

  }, [
    activeCategory,
    foods,
    search,
  ]);

  // =====================================
  // RENDER
  // =====================================

  return (
    <AppShell className="lg:py-1">

      {/* =========================
          HEADER
      ========================= */}

      <Header
        restaurantName={
          restaurant.name
        }
        logoUrl={
          restaurant.logoUrl
        }
        tagline={
          restaurant.tagline
        }
        searchValue={search}
        onSearchChange={
          setSearch
        }
        tableLabel={
          tableNumber
            ? `Table ${tableNumber}`
            : "Menu"
        }
      />

      {/* =========================
          CATEGORIES
      ========================= */}

      {!isLoading &&
        categories.length > 0 && (
          <CategoryList
            categories={
              categories
            }
            activeId={
              activeCategory
            }
            onSelect={
              setActiveCategory
            }
          />
        )}

      {/* =========================
          LOADING
      ========================= */}

      {isLoading && (
        <p className="px-4 py-6 text-sm font-semibold text-ink-muted">
          Loading today's menu...
        </p>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {!isLoading && error && (
        <div className="px-4 py-8 text-center">

          <p className="text-sm font-semibold text-alert">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-4 rounded-full bg-gradient-to-r from-marigold to-sunset px-6 py-3 text-sm font-bold text-white shadow-sm ring-1 ring-sunset/40"
          >
            Try Again
          </button>

        </div>
      )}

      {/* =========================
          EMPTY MENU
      ========================= */}

      {!isLoading &&
        !error &&
        foods.length === 0 && (
          <div className="px-4 py-10 text-center">

            <p className="text-lg font-bold text-ink">
              Menu is currently empty
            </p>

            <p className="mt-2 text-sm text-ink-muted">
              Please check back later.
            </p>

          </div>
        )}

      {/* =========================
          FOOD GRID
      ========================= */}

      {!isLoading &&
        !error &&
        filteredFoods.length > 0 && (
          <FoodGrid
            items={
              filteredFoods
            }
            onItemClick={(
              item
            ) =>
              navigate(
                `/items/${item.id}`
              )
            }
            onAdd={(
              item
            ) =>
              addToCart(item)
            }
          />
        )}

      {/* =========================
          NO SEARCH RESULT
      ========================= */}

      {!isLoading &&
        !error &&
        foods.length > 0 &&
        filteredFoods.length ===
          0 && (
          <div className="px-4 py-10 text-center">

            <p className="text-sm font-semibold text-ink-muted">
              No menu items found.
            </p>

          </div>
        )}

      {/* =========================
          FLOATING CART
      ========================= */}

      <FloatingCartButton />

    </AppShell>
  );
}

export default Home;