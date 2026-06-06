import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoiceDollar,
  faMagnifyingGlass,
  faChevronDown,
  faXmark,
  faCirclePlus,
  faFunnelDollar,
  faTrash,
} from "@fortawesome/pro-regular-svg-icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from "@buildoutinc/blueprint-react/ui/Modal";

export const Route = createFileRoute("/app/payables")({
  component: PayablesPage,
});

// ─── Data ─────────────────────────────────────────────────────────────────────

type Payable = {
  id: string;
  name: string;
  date: string;
  amount: string;
  balance: string;
  amountRaw: number;
};

type PayeeGroup = {
  id: string;
  name: string;
  initials: string;
  totalDue: string;
  payables: Payable[];
};

const PAYEE_GROUPS: PayeeGroup[] = [
  {
    id: "brian",
    name: "Brian Reynolds",
    initials: "BR",
    totalDue: "$330,671.65",
    payables: [
      { id: "p1", name: "808 W Wisconsin St | Space 1", date: "12/19/2024", amount: "$1,288.35", balance: "$1,288.35", amountRaw: 1288.35 },
      { id: "p2", name: "SALE and ONE LEASE | Unit 1", date: "12/17/2024", amount: "-$33,000.00", balance: "-$33,000.00", amountRaw: -33000 },
      { id: "p3", name: "SALE and ONE LEASE | Unit 1", date: "12/17/2024", amount: "-$33,000.00", balance: "-$33,000.00", amountRaw: -33000 },
      { id: "p4", name: "451 West Wrightwood Avenue", date: "08/22/2024", amount: "$2,468.92", balance: "$2,468.92", amountRaw: 2468.92 },
      { id: "p5", name: "Westgate Shopping Plaza | GameStop", date: "05/31/2024", amount: "$11,900.00", balance: "$11,900.00", amountRaw: 11900 },
      { id: "p6", name: "808 W Wisconsin St | Space 1", date: "05/01/2024", amount: "$1,260.00", balance: "$1,260.00", amountRaw: 1260 },
      { id: "p7", name: "Dupe Voucher 1", date: "04/16/2024", amount: "$1,327.50", balance: "$1,327.50", amountRaw: 1327.50 },
      { id: "p8", name: "Testing ID", date: "12/14/2023", amount: "$12,301.88", balance: "$12,301.88", amountRaw: 12301.88 },
      { id: "p9", name: "555 R Ave | 1S", date: "10/19/2023", amount: "$125,000.00", balance: "$125,000.00", amountRaw: 125000 },
      { id: "p10", name: "Testing Office Filter", date: "07/19/2023", amount: "$7,000.00", balance: "$7,000.00", amountRaw: 7000 },
      { id: "p11", name: "Mawman Warehouse", date: "06/29/2023", amount: "$34,125.00", balance: "$34,125.00", amountRaw: 34125 },
      { id: "p12", name: "Prop Man", date: "03/08/2023", amount: "$100,000.00", balance: "$100,000.00", amountRaw: 100000 },
      { id: "p13", name: "Prop Man", date: "02/24/2023", amount: "$100,000.00", balance: "$100,000.00", amountRaw: 100000 },
    ],
  },
  {
    id: "douglas",
    name: "Douglas Reynolds",
    initials: "DR",
    totalDue: "$126,859.36",
    payables: [
      { id: "p14", name: "The Loft Apartments", date: "05/27/2026", amount: "$45,000.00", balance: "$45,000.00", amountRaw: 45000 },
    ],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type DeductionRow = {
  id: number;
  category: string;
  dueDate: string;
  note: string;
  deductionPct: string;
  deductionAmt: string;
};

const DEDUCTION_CATEGORIES = ["Referrals", "Pre Splits", "Royalties", "Signage"];

// ─── Create Payment Modal ─────────────────────────────────────────────────────

function CreatePaymentModal({
  open,
  onOpenChange,
  selectedPayables,
  payeeName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedPayables: Payable[];
  payeeName: string;
}) {
  const [date, setDate] = useState("2026-06-06");
  const [grossAmount, setGrossAmount] = useState("");
  const [deductions, setDeductions] = useState<DeductionRow[]>([]);
  const [showDeductions, setShowDeductions] = useState(false);
  const [showPendingConfirm, setShowPendingConfirm] = useState(false);

  const totalBalance = selectedPayables.reduce((sum, p) => sum + p.amountRaw, 0);
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  const balanceFormatted = fmt(totalBalance);

  const gross = parseFloat(grossAmount.replace(/[^0-9.-]/g, "")) || totalBalance;
  const splitAmount = gross / 2;
  const splitFormatted = fmt(splitAmount);

  const totalDeductions = showPendingConfirm
    ? 0
    : deductions.reduce((sum, d) => sum + (parseFloat(d.deductionAmt.replace(/[^0-9.-]/g, "")) || 0), 0);
  const estimatedTotal = splitAmount - totalDeductions;
  const estimatedFormatted = fmt(estimatedTotal);

  const addDeduction = () =>
    setDeductions((d) => [...d, { id: Date.now(), category: "Referrals", dueDate: "", note: "", deductionPct: "", deductionAmt: "" }]);

  const updateDeduction = (id: number, field: keyof DeductionRow, value: string) =>
    setDeductions((ds) => ds.map((d) => d.id === id ? { ...d, [field]: value } : d));

  const removeDeduction = (id: number) =>
    setDeductions((ds) => ds.filter((d) => d.id !== id));

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg" centered>
        <ModalHeader className="d-flex align-items-center justify-content-between border-bottom pb-3">
          <ModalTitle style={{ fontSize: 18 }}>Create Payment</ModalTitle>
          <ModalClose render={<button className="btn btn-link p-0 text-muted border-0" />}>
            <FontAwesomeIcon icon={faXmark} style={{ fontSize: 18 }} />
          </ModalClose>
        </ModalHeader>

        <ModalBody className="py-4">
          {/* Date */}
          <div className="mb-4">
            <label className="form-label fw-medium mb-1" style={{ fontSize: 13 }}>
              Date<span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              style={{ maxWidth: 180, fontSize: 13 }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Balance */}
          <div className="mb-4">
            <label className="form-label fw-medium mb-1" style={{ fontSize: 13 }}>Balance</label>
            <input
              type="text"
              className="form-control text-end text-muted"
              style={{ fontSize: 13, background: "var(--bs-light)" }}
              value={balanceFormatted}
              readOnly
            />
          </div>

          {/* Gross Amount */}
          <div className="mb-4">
            <label className="form-label fw-medium mb-1" style={{ fontSize: 13 }}>
              Gross Amount<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control text-end"
              style={{ fontSize: 13 }}
              value={grossAmount || balanceFormatted}
              onChange={(e) => setGrossAmount(e.target.value)}
            />
          </div>

          {/* Split Amount */}
          <div className="mb-4">
            <label className="form-label fw-medium mb-1" style={{ fontSize: 13 }}>Split Amount</label>
            <input
              type="text"
              className="form-control text-end text-muted"
              style={{ fontSize: 13, background: "var(--bs-light)" }}
              value={splitFormatted}
              readOnly
            />
          </div>

          {/* Deductions */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Deductions</h6>
            {!showDeductions && !showPendingConfirm ? (
              <button
                className="btn w-100 border text-primary d-flex align-items-center justify-content-center gap-2 py-2"
                style={{ fontSize: 13, background: "var(--bs-light)" }}
                onClick={() => {
                  setDeductions([{
                    id: Date.now(),
                    category: "Referrals",
                    dueDate: "2026-06-05",
                    note: "",
                    deductionPct: "23.28%",
                    deductionAmt: "150.00",
                  }]);
                  setShowPendingConfirm(true);
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} />
                Pending Deduction
              </button>
            ) : showPendingConfirm ? (
              /* Confirmation above + dimmed row below */
              <div className="border rounded overflow-hidden">
                {/* Message + buttons */}
                <div
                  className="d-flex align-items-center justify-content-between px-3 py-2 gap-3"
                  style={{ background: "rgba(255,255,255,0.95)", borderBottom: "1px solid var(--bs-border-color)", fontSize: 13 }}
                >
                  <span className="fw-semibold">Pending Deduction Due — Add to this Payment?</span>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <button
                      className="btn btn-outline-secondary btn-sm px-3"
                      onClick={() => {
                        setDeductions([]);
                        setShowPendingConfirm(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary btn-sm px-3"
                      onClick={() => {
                        setShowDeductions(true);
                        setShowPendingConfirm(false);
                      }}
                    >
                      OK
                    </button>
                  </div>
                </div>

                {/* The deduction row — lightly dimmed */}
                <div style={{ opacity: 0.65, pointerEvents: "none" }}>
                  <table className="table table-bordered mb-0" style={{ fontSize: 12 }}>
                    <thead style={{ background: "var(--bs-light)" }}>
                      <tr>
                        <th className="fw-semibold py-2 px-3" style={{ width: "18%" }}>Category</th>
                        <th className="fw-semibold py-2 px-3" style={{ width: "16%" }}>Due Date</th>
                        <th className="fw-semibold py-2 px-3">Description / Note</th>
                        <th className="fw-semibold py-2 px-3 text-end" style={{ width: "14%" }}>Deduction %</th>
                        <th className="fw-semibold py-2 px-3 text-end" style={{ width: "14%" }}>Deduction $</th>
                        <th style={{ width: 40 }} />
                      </tr>
                    </thead>
                    <tbody>
                      {deductions.map((d) => (
                        <tr key={d.id}>
                          <td className="px-3 py-2">Referrals</td>
                          <td className="px-3 py-2">06/05/2026</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2 text-end">23.28%</td>
                          <td className="px-3 py-2 text-end">$150.00</td>
                          <td />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
            <div className="border rounded overflow-hidden">
              {/* Table header */}
              <table className="table table-bordered mb-0" style={{ fontSize: 12 }}>
                <thead style={{ background: "var(--bs-light)" }}>
                  <tr>
                    <th className="fw-semibold py-2 px-3" style={{ width: "18%" }}>Category</th>
                    <th className="fw-semibold py-2 px-3" style={{ width: "16%" }}>Due Date</th>
                    <th className="fw-semibold py-2 px-3">Description / Note</th>
                    <th className="fw-semibold py-2 px-3 text-end" style={{ width: "14%" }}>Deduction %</th>
                    <th className="fw-semibold py-2 px-3 text-end" style={{ width: "14%" }}>Deduction $</th>
                    <th style={{ width: 40 }} />
                  </tr>
                </thead>
                <tbody>
                  {deductions.map((d) => (
                    <tr key={d.id}>
                      <td className="p-1 px-2">
                        <select
                          className="form-select form-select-sm border-0"
                          value={d.category}
                          onChange={(e) => updateDeduction(d.id, "category", e.target.value)}
                          style={{ fontSize: 12 }}
                        >
                          {DEDUCTION_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1 px-2">
                        <input
                          type="date"
                          className="form-control form-control-sm border-0"
                          value={d.dueDate}
                          onChange={(e) => updateDeduction(d.id, "dueDate", e.target.value)}
                          style={{ fontSize: 12 }}
                        />
                      </td>
                      <td className="p-1 px-2">
                        <input
                          type="text"
                          className="form-control form-control-sm border-0"
                          value={d.note}
                          onChange={(e) => updateDeduction(d.id, "note", e.target.value)}
                          style={{ fontSize: 12 }}
                        />
                      </td>
                      <td className="p-1 px-2">
                        <input
                          type="text"
                          className="form-control form-control-sm border-0 text-end"
                          placeholder="$0.00"
                          value={d.deductionPct}
                          onChange={(e) => updateDeduction(d.id, "deductionPct", e.target.value)}
                          style={{ fontSize: 12 }}
                        />
                      </td>
                      <td className="p-1 px-2">
                        <input
                          type="text"
                          className="form-control form-control-sm border-0 text-end"
                          placeholder="$0.00"
                          value={d.deductionAmt}
                          onChange={(e) => updateDeduction(d.id, "deductionAmt", e.target.value)}
                          style={{ fontSize: 12 }}
                        />
                      </td>
                      <td className="p-1 text-center">
                        <button
                          className="btn btn-link btn-sm text-muted p-0"
                          onClick={() => removeDeduction(d.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} style={{ fontSize: 13 }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Add a deduction button */}
              <button
                className="btn w-100 text-primary d-flex align-items-center justify-content-center gap-2 py-2 border-0"
                style={{ fontSize: 13, background: "var(--bs-light)", borderTop: "1px solid var(--bs-border-color)" }}
                onClick={addDeduction}
              >
                <FontAwesomeIcon icon={faCirclePlus} />
                Add a deduction
              </button>
            </div>
            )}
          </div>

          {/* Estimated Total */}
          <div className="d-flex justify-content-between align-items-center pt-3 border-top">
            <span style={{ fontSize: 14 }}>Estimated Total Due to {payeeName}</span>
            <span className="fw-bold" style={{ fontSize: 15 }}>{estimatedFormatted}</span>
          </div>
        </ModalBody>

        <ModalFooter className="d-flex justify-content-end gap-2 border-top pt-3">
          <ModalClose render={<button className="btn btn-link text-muted text-decoration-none" />}>
            Cancel
          </ModalClose>
          <button className="btn btn-primary px-4" onClick={() => onOpenChange(false)}>
            Save
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function PayablesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);

  const togglePayable = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleGroup = (group: PayeeGroup) => {
    const ids = group.payables.map((p) => p.id);
    const allSelected = ids.every((id) => selected.has(id));
    setSelected((s) => {
      const next = new Set(s);
      if (allSelected) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const allPayables = PAYEE_GROUPS.flatMap((g) => g.payables);
  const selectedPayables = allPayables.filter((p) => selected.has(p.id));

  // Find the payee for selected items (first match)
  const selectedPayeeGroup = PAYEE_GROUPS.find((g) =>
    g.payables.some((p) => selected.has(p.id))
  );

  const anySelected = selected.size > 0;

  return (
    <div className="container-fluid py-4 px-5" style={{ fontSize: 14 }}>
      {/* Page header */}
      <div className="d-flex align-items-start justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 bg-light rounded text-primary">
            <FontAwesomeIcon icon={faFileInvoiceDollar} size="lg" />
          </div>
          <div>
            <h5 className="fw-bold mb-0">Payables</h5>
            <div className="text-muted" style={{ fontSize: 12 }}>View payables by payee</div>
          </div>
        </div>
        <button
          className={`btn px-4 ${anySelected ? "btn-primary" : "btn-outline-secondary"}`}
          disabled={!anySelected}
          onClick={() => anySelected && setModalOpen(true)}
        >
          Create Payment
        </button>
      </div>

      {/* Filters */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <div className="input-group" style={{ width: 280 }}>
            <span className="input-group-text bg-white">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-muted" style={{ fontSize: 12 }} />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by name or address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: 13 }}
            />
          </div>
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" style={{ fontSize: 13 }}>
            Creation Date <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 10 }} />
          </button>
          <button className="btn btn-sm d-flex align-items-center gap-1 border text-primary fw-medium" style={{ fontSize: 13, borderColor: "var(--bs-primary)" }}>
            Status <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 10 }} />
          </button>
        </div>
        <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: 13 }}>
          <span>Displaying 26 – 50 of 101 payables</span>
          <button className="btn btn-link btn-sm text-primary p-0 d-flex align-items-center gap-1" style={{ fontSize: 13 }}>
            <FontAwesomeIcon icon={faFunnelDollar} />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Active filter chip */}
      <div className="mb-3">
        <span
          className="badge d-inline-flex align-items-center gap-1 fw-normal px-2 py-1"
          style={{ fontSize: 12, background: "var(--bs-light)", color: "var(--bs-body-color)", border: "1px solid var(--bs-border-color)" }}
        >
          Outstanding
          <button className="btn btn-link p-0 border-0 text-muted ms-1" style={{ lineHeight: 1, fontSize: 11 }}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </span>
      </div>

      {/* Table */}
      <div className="border rounded overflow-hidden">
        <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
          <thead style={{ background: "var(--bs-light)" }}>
            <tr>
              <th style={{ width: 40 }} className="border-bottom px-3 py-2" />
              <th className="border-bottom px-3 py-2 fw-semibold text-muted">Payable For</th>
              <th className="border-bottom px-3 py-2 fw-semibold text-muted">Creation Date</th>
              <th className="border-bottom px-3 py-2 fw-semibold text-muted text-end">Amount</th>
              <th className="border-bottom px-3 py-2 fw-semibold text-muted text-end">Balance</th>
            </tr>
          </thead>
          <tbody>
            {PAYEE_GROUPS.map((group) => {
              const groupIds = group.payables.map((p) => p.id);
              const allGroupSelected = groupIds.every((id) => selected.has(id));
              const someGroupSelected = groupIds.some((id) => selected.has(id));

              return (
                <>
                  {/* Group header row */}
                  <tr key={`group-${group.id}`} style={{ background: "var(--bs-light)" }}>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={allGroupSelected}
                        ref={(el) => { if (el) el.indeterminate = someGroupSelected && !allGroupSelected; }}
                        onChange={() => toggleGroup(group)}
                      />
                    </td>
                    <td className="px-3 py-2" colSpan={4}>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white fw-semibold flex-shrink-0"
                          style={{ width: 28, height: 28, fontSize: 11 }}
                        >
                          {group.initials}
                        </div>
                        <span className="fw-semibold">{group.name}</span>
                        <span className="text-muted">Total due:</span>
                        <span className="fw-bold">{group.totalDue}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Payable rows */}
                  {group.payables.map((payable) => (
                    <tr key={payable.id}>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selected.has(payable.id)}
                          onChange={() => togglePayable(payable.id)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <a href="#" className="text-primary text-decoration-none">{payable.name}</a>
                      </td>
                      <td className="px-3 py-2 text-muted">{payable.date}</td>
                      <td className={`px-3 py-2 text-end ${payable.amountRaw < 0 ? "text-danger" : ""}`}>
                        {payable.amount}
                      </td>
                      <td className={`px-3 py-2 text-end ${payable.amountRaw < 0 ? "text-danger" : ""}`}>
                        {payable.balance}
                      </td>
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Payment Modal */}
      <CreatePaymentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedPayables={selectedPayables}
        payeeName={selectedPayeeGroup?.name ?? "Payee"}
      />
    </div>
  );
}
