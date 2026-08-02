import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../api/menuItems";

import type { MenuItemPayload } from "../../api/menuItems";
import { getCategories } from "../../api/categories";
import type { MenuItem } from "../../types";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

const empty: MenuItemPayload = {
  name: "",
  description: "",
  price: 0,
  image: undefined,
  isAvailable: true,
  categoryId: 0,
};

export default function MenuItemsPage() {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuItemPayload>({
    ...empty,
  });

  // ============================
  // LOAD MENU ITEMS
  // ============================

  const { data: items, isLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
  });

  // ============================
  // LOAD CATEGORIES
  // ============================

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // ============================
  // SAVE MENU ITEM
  // ============================

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => {
      if (editing) {
        return updateMenuItem(editing.id, form);
      }

      return createMenuItem(form);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["menuItems"],
      });

      closeModal();
    },

    onError: (error) => {
      console.error("Failed to save menu item:", error);
      alert("Failed to save menu item.");
    },
  });

  // ============================
  // DELETE MENU ITEM
  // ============================

  const { mutate: remove } = useMutation({
    mutationFn: deleteMenuItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["menuItems"],
      });
    },

    onError: (error) => {
      console.error("Failed to delete menu item:", error);
      alert("Failed to delete menu item.");
    },
  });

  // ============================
  // CREATE
  // ============================

  const openCreate = () => {
    setEditing(null);

    setForm({
      ...empty,
    });

    setShowModal(true);
  };

  // ============================
  // EDIT
  // ============================

  const openEdit = (menuItem: MenuItem) => {
    setEditing(menuItem);

    setForm({
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,

      // Do NOT put imageUrl here.
      // The user can optionally select
      // a new image file.
      image: undefined,

      isAvailable: menuItem.isAvailable,
      categoryId: menuItem.categoryId,
    });

    setShowModal(true);
  };

  // ============================
  // CLOSE MODAL
  // ============================

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);

    setForm({
      ...empty,
    });
  };

  // ============================
  // UPDATE FORM
  // ============================

  const set = (
    key: keyof MenuItemPayload,
    value: string | number | boolean | File | undefined,
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // ============================
  // IMAGE FILE
  // ============================

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      set("image", undefined);
      return;
    }

    // Optional validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    set("image", file);
  };

  // ============================
  // SAVE VALIDATION
  // ============================

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("Please enter a menu item name.");
      return;
    }

    if (form.categoryId === 0) {
      alert("Please select a category.");
      return;
    }

    if (form.price < 0) {
      alert("Price cannot be negative.");
      return;
    }

    save();
  };

  // ============================
  // UI
  // ============================

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Menu Items</h1>

        <Button onClick={openCreate}>+ Add Item</Button>
      </div>

      {/* MENU ITEMS */}
      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* TABLE HEADER */}
          <div className="hidden grid-cols-[1.3fr_0.9fr_0.6fr_0.7fr_1fr] bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-500 md:grid">
            <div>Name</div>
            <div>Category</div>
            <div>Price</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {/* TABLE BODY */}
          <div className="divide-y divide-gray-100">
            {items?.map((menuItem) => (
              <div
                key={menuItem.id}
                className="flex flex-col gap-3 px-4 py-4 md:grid md:grid-cols-[1.3fr_0.9fr_0.6fr_0.7fr_1fr] md:items-center md:px-6"
              >
                {/* NAME */}
                <div className="font-medium text-gray-800">{menuItem.name}</div>

                {/* CATEGORY */}
                <div className="text-sm text-gray-500">
                  {menuItem.categoryName}
                </div>

                {/* PRICE */}
                <div className="text-sm text-gray-700">
                  Birr {menuItem.price.toFixed(2)}
                </div>

                {/* STATUS */}
                <div>
                  <Badge
                    label={menuItem.isAvailable ? "Available" : "Unavailable"}
                    color={menuItem.isAvailable ? "green" : "red"}
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => openEdit(menuItem)}
                  >
                    Edit
                  </Button>

                  <Button variant="danger" onClick={() => remove(menuItem.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <Modal
          title={editing ? "Edit Menu Item" : "New Menu Item"}
          onClose={closeModal}
        >
          <div className="space-y-3">
            {/* NAME */}
            <Input
              label="Name"
              value={form.name}
              onChange={(event) => set("name", event.target.value)}
            />

            {/* DESCRIPTION */}
            <Input
              label="Description"
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
            />

            {/* PRICE */}
            <Input
              label="Price"
              type="number"
              value={form.price}
              onChange={(event) => {
                const next = parseFloat(event.target.value);

                set("price", Number.isFinite(next) ? next : 0);
              }}
            />

            {/* IMAGE FILE */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />

              {/* SELECTED FILE */}
              {form.image && (
                <p className="text-xs text-green-600">
                  Selected: {form.image.name}
                </p>
              )}

              {/* EDITING WITHOUT NEW IMAGE */}
              {editing && !form.image && (
                <p className="text-xs text-gray-500">
                  Leave empty to keep the existing image.
                </p>
              )}
            </div>

            {/* CATEGORY */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                aria-label="Category"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.categoryId}
                onChange={(event) => {
                  const next = parseInt(event.target.value, 10);

                  set("categoryId", Number.isFinite(next) ? next : 0);
                }}
              >
                <option value={0}>Select category</option>

                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* AVAILABLE */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(event) => set("isAvailable", event.target.checked)}
              />
              Available
            </label>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>

              <Button loading={saving} onClick={handleSave}>
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
