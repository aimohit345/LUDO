"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { MockKycDoc } from "@/lib/mock-data";
import { formatTimestamp } from "@/lib/utils";
import { ShieldCheck, Check, X, Eye, FileText } from "lucide-react";

export default function AdminKycPage() {
  const { kycDocuments, verifyKyc } = useAppStore();
  const [selectedDoc, setSelectedDoc] = useState<MockKycDoc | null>(null);

  const columns: Column<MockKycDoc>[] = [
    {
      key: "username",
      header: "Player",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-white">{row.username}</p>
          <p className="text-[10px] text-slate-500 font-mono">ID: {row.user_id.slice(0, 8)}</p>
        </div>
      ),
    },
    {
      key: "id_type",
      header: "Doc Type",
      sortable: true,
      render: (row) => (
        <span className="px-2 py-0.5 rounded bg-surface-200 text-cyan-300 font-mono text-[10px] font-bold">
          {row.id_type}
        </span>
      ),
    },
    {
      key: "document_number",
      header: "Document Number",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-white text-xs font-semibold">
          {row.document_number}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: "created_at",
      header: "Submitted",
      sortable: true,
      render: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
          {formatTimestamp(row.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Review",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="glass"
            size="sm"
            onClick={() => setSelectedDoc(row)}
            className="text-[11px] p-1.5"
            title="Inspect Document Image"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
          </Button>

          {row.status === "PENDING" && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  verifyKyc(row.id, "VERIFIED");
                  alert(`Verified KYC for ${row.username}`);
                }}
                className="text-[11px] px-2 py-1"
              >
                <Check className="w-3.5 h-3.5 mr-0.5" />
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  verifyKyc(row.id, "REJECTED");
                  alert(`Rejected KYC for ${row.username}`);
                }}
                className="text-[11px] px-2 py-1"
              >
                <X className="w-3.5 h-3.5 mr-0.5" />
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Player KYC Verification Desk
        </h1>
        <p className="text-xs text-slate-400">
          Verify government ID numbers and document photos to satisfy AML and compliance regulations.
        </p>
      </div>

      <GlassCard className="p-6">
        <DataTable
          data={kycDocuments}
          columns={columns}
          searchKey="username"
          searchPlaceholder="Search by username or doc number..."
          pageSize={8}
          exportFileName="LudoArena_KYC_List"
        />
      </GlassCard>

      {/* Inspect Document Modal */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title="Inspect KYC Document"
        description={`${selectedDoc?.id_type} for player: ${selectedDoc?.username}`}
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-surface-200/50 text-xs space-y-1">
              <p>
                <span className="text-slate-400">Document Type:</span>{" "}
                <strong className="text-white font-mono">{selectedDoc.id_type}</strong>
              </p>
              <p>
                <span className="text-slate-400">Number:</span>{" "}
                <strong className="text-cyan-400 font-mono">{selectedDoc.document_number}</strong>
              </p>
              <p>
                <span className="text-slate-400">Status:</span>{" "}
                <strong className="text-white">{selectedDoc.status}</strong>
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 p-1 bg-surface-100">
              <img
                src={selectedDoc.front_url}
                alt="Document preview"
                className="w-full h-56 object-cover rounded-lg"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {selectedDoc.status === "PENDING" && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      verifyKyc(selectedDoc.id, "VERIFIED");
                      setSelectedDoc(null);
                    }}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Approve Document
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      verifyKyc(selectedDoc.id, "REJECTED");
                      setSelectedDoc(null);
                    }}
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Reject Document
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
