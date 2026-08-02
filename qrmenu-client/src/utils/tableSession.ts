const TABLE_ID_KEY = "qrmenu.tableId";
const TABLE_NUMBER_KEY = "qrmenu.tableNumber";

// =====================================
// TABLE ID FROM QR CODE
// =====================================

export const getTableIdFromSearchParams = (
  searchParams: URLSearchParams,
): number | null => {
  const value = searchParams.get("tableId");

  if (!value) return null;

  const tableId = Number(value);

  return Number.isInteger(tableId) && tableId > 0 ? tableId : null;
};

// =====================================
// TABLE NUMBER FROM QR CODE
// Optional display value
// =====================================

export const getTableNumberFromSearchParams = (
  searchParams: URLSearchParams,
): string => {
  return (
    searchParams.get("tableNumber") ??
    searchParams.get("table") ??
    searchParams.get("tableNo") ??
    ""
  );
};

// =====================================
// SAVED TABLE ID
// =====================================

export const getSavedTableId = (): number | null => {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(TABLE_ID_KEY);

  if (!value) return null;

  const tableId = Number(value);

  return Number.isInteger(tableId) && tableId > 0 ? tableId : null;
};

// =====================================
// SAVED TABLE NUMBER
// =====================================

export const getSavedTableNumber = (): string => {
  if (typeof window === "undefined") return "";

  return window.sessionStorage.getItem(TABLE_NUMBER_KEY) ?? "";
};

// =====================================
// SAVE TABLE ID
// =====================================

export const saveTableId = (tableId: number) => {
  if (typeof window === "undefined") return;

  if (Number.isInteger(tableId) && tableId > 0) {
    window.sessionStorage.setItem(TABLE_ID_KEY, String(tableId));
  }
};

// =====================================
// SAVE TABLE NUMBER
// =====================================

export const saveTableNumber = (tableNumber: string) => {
  if (typeof window === "undefined") return;

  const cleanValue = tableNumber.trim();

  if (cleanValue) {
    window.sessionStorage.setItem(TABLE_NUMBER_KEY, cleanValue);
  }
};
