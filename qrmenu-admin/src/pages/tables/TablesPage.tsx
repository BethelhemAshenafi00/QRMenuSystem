import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";

import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} from "../../api/tables";

import type { Table } from "../../types";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";

const clientBaseUrl = "http://localhost:5174/";

function buildClientUrl(table: Table) {
  const params = new URLSearchParams();

  params.set("tableId", String(table.id));
  params.set("tableNumber", table.tableNumber);

  return `${clientBaseUrl}?${params.toString()}`;
}

export default function TablesPage() {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Table | null>(null);

  const [tableNumber, setTableNumber] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const [copiedId, setCopiedId] = useState<number | null>(null);

  // ==========================================
  // GET TABLES
  // ==========================================

  const {
    data: tables,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  // ==========================================
  // PREVIEW URL
  //
  // For NEW tables we don't have the database
  // ID yet, so don't generate a fake URL.
  // ==========================================

  const generatedQrValue = useMemo(() => {
    if (!editing) {
      return "";
    }

    if (!tableNumber.trim()) {
      return "";
    }

    const previewTable: Table = {
      ...editing,
      tableNumber: tableNumber.trim(),
    };

    return buildClientUrl(previewTable);
  }, [editing, tableNumber]);

  // ==========================================
  // CREATE / UPDATE TABLE
  // ==========================================

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: async () => {
      const cleanTableNumber = tableNumber.trim();

      if (!cleanTableNumber) {
        throw new Error("Table number is required.");
      }

      // ========================================
      // UPDATE EXISTING TABLE
      // ========================================

      if (editing) {
        const updatedTable = await updateTable(
          editing.id,
          cleanTableNumber,
          buildClientUrl({
            ...editing,
            tableNumber: cleanTableNumber,
          }),
        );

        return updatedTable;
      }

      // ========================================
      // CREATE NEW TABLE
      //
      // First create the table without depending
      // on an ID that doesn't exist yet.
      // ========================================

      const createdTable = await createTable(cleanTableNumber, "");

      // ========================================
      // NOW WE HAVE THE DATABASE ID
      //
      // Example:
      // id = 7
      // tableNumber = "1"
      //
      // Generate:
      // ?tableId=7&tableNumber=1
      // ========================================

      const generatedUrl = buildClientUrl(createdTable);

      // ========================================
      // SAVE QR URL
      // ========================================

      const updatedTable = await updateTable(
        createdTable.id,
        createdTable.tableNumber,
        generatedUrl,
      );

      return updatedTable;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });

      closeModal();
    },

    onError: (error) => {
      console.error("Failed to save table:", error);
    },
  });

  // ==========================================
  // DELETE TABLE
  // ==========================================

  const { mutate: remove, isPending: deleting } = useMutation({
    mutationFn: deleteTable,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },

    onError: (error) => {
      console.error("Failed to delete table:", error);
    },
  });

  // ==========================================
  // CREATE MODAL
  // ==========================================

  const openCreate = () => {
    setEditing(null);
    setTableNumber("");
    setQrCodeUrl("");
    setShowModal(true);
  };

  // ==========================================
  // EDIT MODAL
  // ==========================================

  const openEdit = (table: Table) => {
    setEditing(table);
    setTableNumber(table.tableNumber);

    setQrCodeUrl(table.qrCodeUrl || buildClientUrl(table));

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setTableNumber("");
    setQrCodeUrl("");
    setCopiedId(null);
  };

  // ==========================================
  // COPY QR LINK
  // ==========================================

  const copyLink = async (table: Table) => {
    const link = table.qrCodeUrl || buildClientUrl(table);

    await navigator.clipboard.writeText(link);

    setCopiedId(table.id);

    window.setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  // ==========================================
  // DOWNLOAD QR
  // ==========================================

  const downloadQr = (table: Table) => {
    const svg = document.getElementById(`qr-${table.id}`);

    if (!svg) {
      console.error("QR code SVG not found.");
      return;
    }

    const serializer = new XMLSerializer();

    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `table-${table.tableNumber}.svg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Tables</h1>

        <p className="text-gray-400">Loading tables...</p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (isError) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Tables</h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          Failed to load tables.
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

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tables</h1>

          <p className="mt-1 text-sm text-gray-500">
            Create tables and generate QR codes automatically for each table.
          </p>
        </div>

        <Button onClick={openCreate}>+ Add Table</Button>
      </div>

      {/* ======================================
          TABLE CARDS
      ====================================== */}

      {!tables?.length ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-400">No tables yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tables.map((table) => {
            const link = table.qrCodeUrl || buildClientUrl(table);

            return (
              <div
                key={table.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                {/* TABLE HEADER */}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                      Table
                    </p>

                    <h2 className="text-lg font-semibold text-gray-800">
                      {table.tableNumber}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Database ID: {table.id}
                    </p>
                  </div>

                  <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    QR ready
                  </div>
                </div>

                {/* QR */}

                <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3">
                  <div
                    id={`qr-${table.id}`}
                    className="rounded-lg bg-white p-2"
                  >
                    <QRCodeSVG
                      value={link}
                      size={140}
                      level="M"
                      includeMargin
                    />
                  </div>

                  <p className="mt-3 text-center text-xs text-gray-500">
                    Scan to open the menu for Table {table.tableNumber}
                  </p>
                </div>

                {/* CLIENT URL */}

                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Client URL</p>

                  <p className="break-all text-xs text-gray-500">{link}</p>
                </div>

                {/* ACTIONS */}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => openEdit(table)}>
                    Edit
                  </Button>

                  <Button variant="secondary" onClick={() => copyLink(table)}>
                    {copiedId === table.id ? "Copied!" : "Copy link"}
                  </Button>

                  <Button variant="secondary" onClick={() => downloadQr(table)}>
                    Download SVG
                  </Button>

                  <Button
                    variant="danger"
                    loading={deleting}
                    onClick={() => remove(table.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================
          CREATE / EDIT MODAL
      ====================================== */}

      {showModal && (
        <Modal
          title={editing ? "Edit Table" : "New Table"}
          onClose={closeModal}
        >
          <div className="space-y-4">
            {/* TABLE NUMBER */}

            <Input
              label="Table Number"
              value={tableNumber}
              onChange={(event) => setTableNumber(event.target.value)}
              placeholder="e.g. 1"
            />

            {/* QR URL */}

            {editing && (
              <Input
                label="QR Destination URL"
                value={qrCodeUrl || generatedQrValue}
                onChange={(event) => setQrCodeUrl(event.target.value)}
                placeholder="https://..."
              />
            )}

            {/* NEW TABLE MESSAGE */}

            {!editing && (
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 text-sm text-orange-800">
                <p className="font-semibold">QR code</p>

                <p className="mt-1">
                  The QR code will be generated automatically after the table is
                  created.
                </p>
              </div>
            )}

            {/* EDIT PREVIEW */}

            {editing && (
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 text-sm text-orange-800">
                <p className="font-semibold">Client QR preview</p>

                <p className="mt-1 break-all">
                  {generatedQrValue ||
                    "Enter a table number to generate the client link"}
                </p>
              </div>
            )}

            {/* BUTTONS */}

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>

              <Button loading={saving} onClick={() => save()}>
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
