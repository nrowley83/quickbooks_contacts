import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCaretDown,
  faCircleExclamation,
  faEllipsisVertical,
  faXmark,
  faUser,
  faCalendarPlus,
  faSliders,
} from "@fortawesome/pro-regular-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Button } from "@buildoutinc/blueprint-react/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@buildoutinc/blueprint-react/ui/DropdownMenu";
import { Input } from "@buildoutinc/blueprint-react/ui/Input";
import { InputGroup, InputGroupAddon } from "@buildoutinc/blueprint-react/ui/InputGroup";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@buildoutinc/blueprint-react/ui/Select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from "@buildoutinc/blueprint-react/ui/Modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@buildoutinc/blueprint-react/ui/Table";

export const Route = createFileRoute("/app/deals-pipeline")({
  component: DealsPipelinePage,
});

// ─── Pipeline data ────────────────────────────────────────────────────────────

const FILTERS = [
  { label: "All Offices", items: ["All Offices", "Downtown Office", "Westside Office"] },
  { label: "All Brokers", items: ["All Brokers", "Bill Broker", "Jenny Broker"] },
  { label: "Deal Type", items: ["Any", "Sale", "Lease"] },
  { label: "Property Type", items: ["Any", "Office", "Retail", "Industrial", "Land"] },
  { label: "Include dirty deals", items: ["Yes", "No"] },
  { label: "Close Date: 2026", items: ["2026", "2025", "2024"] },
];

const STAGE = {
  name: "Closed",
  count: 10,
  total: 10,
  transactionValue: "$2,400,000",
  grossCommission: "$136,000",
};

const DEALS = [
  { title: "Collect initial info", id: "115683", location: "Chicago, IL", dealType: "Sale", propertyType: "Office", value: "$100,000", gross: "$5,500", tasks: "0 tasks open" },
  { title: "Special Task", id: "115349", location: "Darien, IL", dealType: "Sale", propertyType: "Office", value: "$100,000", gross: "$7,500", tasks: "0 tasks open" },
  { title: "Test", id: "114645", location: "Prospect Heights, IL", dealType: "Sale", propertyType: "Office", value: "$100,000", gross: "$30,000", tasks: "0 tasks open" },
  { title: "Apartment Building January 2nd", id: "114595", location: "", dealType: "Sale", propertyType: "Office", value: "$0", gross: "", tasks: "0 tasks open" },
  { title: "12/12 Shared Deal", id: "114060", location: "Chicago, IL", dealType: "Sale", propertyType: "Office", value: "$1,000,000", gross: "$60,000", tasks: "0 tasks open" },
  { title: "ID 114594", id: "114594", location: "", dealType: "Lease", propertyType: "Office", value: "$0", gross: "", tasks: "0 tasks open" },
  { title: "ID 114593", id: "114593", location: "", dealType: "Sale", propertyType: "", value: "$0", gross: "", tasks: "0 tasks open" },
  { title: "New B2B Deal", id: "114592", location: "Chicago, IL", dealType: "Sale", propertyType: "Land", value: "$100,000", gross: "$21,000", tasks: "0 tasks open" },
  { title: "B2B Test", id: "114585", location: "Chicago, IL", dealType: "Lease", propertyType: "Industrial", value: "$1,000,000", gross: "$12,000", tasks: "0 tasks open" },
  { title: "Import Sale", id: "114055", location: "Chicago, IL", dealType: "Sale", propertyType: "", value: "$0", gross: "$0", tasks: "0 tasks open" },
];

// ─── Add Closed Deal modal ────────────────────────────────────────────────────
// Styles below mirror add_closed_deal_modal.css values exactly (colors, sizes,
// spacing) rather than approximating with Bootstrap's utility scale, which
// this theme customizes and does not map 1:1 to the spec's px values.

const MC = {
  bodyText: "rgb(33, 38, 48)",
  border: "oklch(0.8869 0.01 259.82)",
  required: "oklch(0.583 0.24 28.48)",
  purple: "oklch(0.4835 0.24 298.01)",
  mutedIcon: "rgb(154, 161, 176)",
};

const fieldWrapperStyle: React.CSSProperties = { marginBottom: 16 };

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 400,
  color: MC.bodyText,
  marginBottom: 6,
};

const requiredStyle: React.CSSProperties = { color: MC.required, marginLeft: 2 };

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: `1px solid ${MC.border}`,
  borderRadius: 6,
  padding: "8px 12px",
  fontSize: 14,
  fontFamily: "inherit",
  color: MC.bodyText,
  background: "rgb(255, 255, 255)",
  height: 37,
};

const selectTriggerStyle: React.CSSProperties = {
  width: "100%",
  height: 37,
  padding: "8px 12px",
  border: `1px solid ${MC.border}`,
  borderRadius: 6,
  fontSize: 14,
  color: MC.bodyText,
  background: "rgb(255, 255, 255)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const sectionTitleRowStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 400,
  color: MC.bodyText,
  margin: "24px 0 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const addLinkStyle: React.CSSProperties = {
  color: MC.purple,
  fontSize: 14,
  fontWeight: 400,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
};

const removeButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: "0 8px",
  color: MC.mutedIcon,
  cursor: "pointer",
  flex: "0 0 auto",
};

const brokerRowStyle: React.CSSProperties = { display: "flex", gap: 8, marginBottom: 6 };

const emptyStateBoxStyle: React.CSSProperties = {
  border: `1px dashed ${MC.border}`,
  borderRadius: 6,
  padding: 20,
  background: "rgb(255, 255, 255)",
  display: "flex",
  alignItems: "center",
  gap: 16,
  color: MC.bodyText,
  fontSize: 14,
};

const BROKER_OPTIONS = ["Bill Broker", "Jenny Broker", "Brian Reynolds", "May Broker"];
const PCT_OPTIONS = ["10%", "20%", "25%", "50%", "75%", "100%"];
const BROKER_ITEMS = BROKER_OPTIONS.map((name) => ({ label: name, value: name }));
const PCT_ITEMS = PCT_OPTIONS.map((pct) => ({ label: pct, value: pct }));
const DEAL_TYPE_ITEMS = [
  { label: "Sale", value: "Sale" },
  { label: "Lease", value: "Lease" },
];
const PROPERTY_TYPE_ITEMS = [
  { label: "Office", value: "Office" },
  { label: "Retail", value: "Retail" },
  { label: "Industrial", value: "Industrial" },
  { label: "Land", value: "Land" },
];

const NON_DISCLOSURE_STATES = [
  { name: "Alaska", abbr: "AK" },
  { name: "Idaho", abbr: "ID" },
  { name: "Kansas", abbr: "KS" },
  { name: "Louisiana", abbr: "LA" },
  { name: "Mississippi", abbr: "MS" },
  { name: "Missouri", abbr: "MO" },
  { name: "Montana", abbr: "MT" },
  { name: "New Mexico", abbr: "NM" },
  { name: "North Dakota", abbr: "ND" },
  { name: "Texas", abbr: "TX" },
  { name: "Utah", abbr: "UT" },
  { name: "Wyoming", abbr: "WY" },
];

function isNonDisclosureState(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  return NON_DISCLOSURE_STATES.some(
    (s) => s.name.toLowerCase() === normalized || s.abbr.toLowerCase() === normalized
  );
}

type BrokerRow = { broker: string; pct: string };

function RepeatableSection({
  title,
  addLabel,
  items,
  onAdd,
  onRemove,
  onChange,
  emptyIcon,
  emptyText,
  placeholder,
}: {
  title: string;
  addLabel: string;
  items: string[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, value: string) => void;
  emptyIcon: IconDefinition;
  emptyText: string;
  placeholder: string;
}) {
  return (
    <>
      <div style={sectionTitleRowStyle}>
        <span>{title}</span>
        <Button type="button" variant="ghost" style={addLinkStyle} onClick={onAdd}>
          {addLabel}
        </Button>
      </div>
      {items.length === 0 ? (
        <div style={emptyStateBoxStyle}>
          <FontAwesomeIcon icon={emptyIcon} style={{ width: 24, height: 24, color: MC.purple }} />
          <span>{emptyText}</span>
        </div>
      ) : (
        <div>
          {items.map((val, i) => (
            <div style={brokerRowStyle} key={i}>
              <Input
                style={{ ...inputStyle, flex: 1 }}
                placeholder={placeholder}
                value={val}
                onValueChange={(v) => onChange(i, v)}
              />
              <Button type="button" variant="ghost" style={removeButtonStyle} onClick={() => onRemove(i)}>
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function useRepeatableSection() {
  const [items, setItems] = useState<string[]>([]);
  return {
    items,
    add: () => setItems((rows) => [...rows, ""]),
    remove: (i: number) => setItems((rows) => rows.filter((_, idx) => idx !== i)),
    change: (i: number, value: string) =>
      setItems((rows) => rows.map((r, idx) => (idx === i ? value : r))),
  };
}

function AddClosedDealModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [dealType, setDealType] = useState("");
  const [dealTitle, setDealTitle] = useState("");
  const [dealId, setDealId] = useState("");
  const [brokers, setBrokers] = useState<BrokerRow[]>([{ broker: "Bill Broker", pct: "100%" }]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [propertyState, setPropertyState] = useState("");
  const [zip, setZip] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [transactionValue, setTransactionValue] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [brokerageGross, setBrokerageGross] = useState("");

  const buyers = useRepeatableSection();
  const sellers = useRepeatableSection();
  const criticalDates = useRepeatableSection();
  const customFields = useRepeatableSection();

  const isSale = dealType === "Sale";

  const updateBroker = (i: number, field: "broker" | "pct", value: string) =>
    setBrokers((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));

  const brokerValue = (pct: string) => {
    const gross = parseFloat(brokerageGross);
    const pctNum = parseFloat(pct);
    if (!gross || !pctNum) return "--";
    return `$${Math.round((gross * pctNum) / 100).toLocaleString()}`;
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg" scrollable className="add-closed-deal-content">
        <style>{`
          .modal-dialog:has(> .add-closed-deal-content) { margin-top: 60px; }
          .modal-backdrop:has(~ .modal .add-closed-deal-content) { background-color: rgb(0, 0, 0); --bp-backdrop-opacity: 0.5; }
        `}</style>
        <ModalHeader style={{ paddingTop: 24, paddingBottom: 0, paddingLeft: 32, paddingRight: 32 }}>
          <ModalTitle style={{ fontSize: 20, fontWeight: 700, color: MC.bodyText, margin: "0 0 20px" }}>
            Add Closed Deal
          </ModalTitle>
        </ModalHeader>

        <ModalBody style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 32, paddingRight: 32 }}>
          <div style={fieldWrapperStyle}>
            <label style={fieldLabelStyle}>
              Deal Type<span style={requiredStyle}>*</span>
            </label>
            <Select
              items={DEAL_TYPE_ITEMS}
              value={dealType || null}
              onValueChange={(v) => setDealType(v ?? "")}
            >
              <SelectTrigger style={selectTriggerStyle}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {DEAL_TYPE_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isSale && (
            <>
              <div style={{ ...sectionTitleRowStyle, justifyContent: "flex-start" }}>Deal Details</div>
              <div style={{ display: "flex", gap: 16, ...fieldWrapperStyle }}>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabelStyle}>
                    Deal Title<span style={requiredStyle}>*</span>
                  </label>
                  <Input style={inputStyle} value={dealTitle} onValueChange={setDealTitle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabelStyle}>Deal ID</label>
                  <Input
                    style={inputStyle}
                    value={dealId}
                    onValueChange={setDealId}
                    placeholder="Auto-generated"
                  />
                </div>
              </div>

              <div style={sectionTitleRowStyle}>
                <span>Brokers</span>
                <Button
                  type="button"
                  variant="ghost"
                  style={addLinkStyle}
                  onClick={() => setBrokers((rows) => [...rows, { broker: BROKER_OPTIONS[0], pct: "10%" }])}
                >
                  + Add Broker
                </Button>
              </div>
              <div>
                {brokers.map((b, i) => (
                  <div style={brokerRowStyle} key={i}>
                    <Select
                      items={BROKER_ITEMS}
                      value={b.broker}
                      onValueChange={(v) => updateBroker(i, "broker", v ?? "")}
                    >
                      <SelectTrigger style={{ ...selectTriggerStyle, flex: 1 }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BROKER_ITEMS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      items={PCT_ITEMS}
                      value={b.pct}
                      onValueChange={(v) => updateBroker(i, "pct", v ?? "")}
                    >
                      <SelectTrigger style={{ ...selectTriggerStyle, width: 64, flex: "0 0 auto", padding: "8px 6px" }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PCT_ITEMS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div style={{ width: 80, flex: "0 0 auto", textAlign: "right", paddingTop: 8 }}>
                      {brokerValue(b.pct)}
                    </div>
                    {brokers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        style={removeButtonStyle}
                        onClick={() => setBrokers((rows) => rows.filter((_, idx) => idx !== i))}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <RepeatableSection
                title="Buyer"
                addLabel="+ Add Buyer"
                items={buyers.items}
                onAdd={buyers.add}
                onRemove={buyers.remove}
                onChange={buyers.change}
                emptyIcon={faUser}
                emptyText="No buyers added yet"
                placeholder="Buyer name"
              />

              <RepeatableSection
                title="Seller"
                addLabel="+ Add Seller"
                items={sellers.items}
                onAdd={sellers.add}
                onRemove={sellers.remove}
                onChange={sellers.change}
                emptyIcon={faUser}
                emptyText="No sellers added yet"
                placeholder="Seller name"
              />

              <RepeatableSection
                title="Critical Dates"
                addLabel="+ Add Critical Date"
                items={criticalDates.items}
                onAdd={criticalDates.add}
                onRemove={criticalDates.remove}
                onChange={criticalDates.change}
                emptyIcon={faCalendarPlus}
                emptyText="No critical dates added yet"
                placeholder="e.g. Inspection Contingency — 03/15/2026"
              />

              <div style={{ ...sectionTitleRowStyle, justifyContent: "flex-start" }}>Property</div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>Address</label>
                <Input style={inputStyle} value={address} onValueChange={setAddress} />
              </div>
              <div style={{ display: "flex", gap: 16, ...fieldWrapperStyle }}>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabelStyle}>City</label>
                  <Input style={inputStyle} value={city} onValueChange={setCity} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabelStyle}>State</label>
                  <Input style={inputStyle} value={propertyState} onValueChange={setPropertyState} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabelStyle}>Zip</label>
                  <Input style={inputStyle} value={zip} onValueChange={setZip} />
                </div>
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>Property Type</label>
                <Select
                  items={PROPERTY_TYPE_ITEMS}
                  value={propertyType || null}
                  onValueChange={(v) => setPropertyType(v ?? "")}
                >
                  <SelectTrigger style={selectTriggerStyle}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPE_ITEMS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div style={{ ...sectionTitleRowStyle, justifyContent: "flex-start" }}>Transaction</div>
              <div style={{ display: "flex", gap: 16, ...fieldWrapperStyle }}>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabelStyle}>Transaction Value</label>
                  <Input
                    style={inputStyle}
                    type="number"
                    value={transactionValue}
                    onValueChange={setTransactionValue}
                  />
                  {isNonDisclosureState(propertyState) && (
                    <div style={{ color: MC.mutedIcon, fontSize: 12, marginTop: 4 }}>
                      Sale Price will not appear in the Data Mining Report
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabelStyle}>Close Date</label>
                  <Input
                    style={inputStyle}
                    placeholder="MM/DD/YYYY"
                    value={closeDate}
                    onValueChange={setCloseDate}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabelStyle}>Brokerage Gross</label>
                  <Input
                    style={inputStyle}
                    type="number"
                    value={brokerageGross}
                    onValueChange={setBrokerageGross}
                  />
                </div>
              </div>

              <RepeatableSection
                title="Custom Fields"
                addLabel="+ Add Custom Field"
                items={customFields.items}
                onAdd={customFields.add}
                onRemove={customFields.remove}
                onChange={customFields.change}
                emptyIcon={faSliders}
                emptyText="No custom fields added yet"
                placeholder="Field value"
              />
            </>
          )}
        </ModalBody>

        <ModalFooter
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 24,
            paddingTop: 16,
            paddingBottom: 20,
            paddingLeft: 32,
            paddingRight: 32,
            borderTop: `1px solid ${MC.border}`,
          }}
        >
          <ModalClose render={<button className="btn btn-link text-decoration-none" />}>
            Cancel
          </ModalClose>
          <Button variant="primary" onClick={() => onOpenChange(false)}>
            Create Deal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function DealsPipelinePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="container-fluid py-4 px-5" style={{ fontSize: 14 }}>
      <div className="d-flex align-items-center flex-wrap gap-2 mb-4">
        <InputGroup style={{ flex: "0 0 260px" }}>
          <InputGroupAddon>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </InputGroupAddon>
          <Input placeholder="Search name, address, or identifier" />
        </InputGroup>

        {FILTERS.map((filter) => (
          <DropdownMenu key={filter.label}>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm">
                  {filter.label}
                  <FontAwesomeIcon icon={faCaretDown} style={{ fontSize: 10 }} />
                </Button>
              }
            />
            <DropdownMenuContent>
              {filter.items.map((item) => (
                <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}

        <div className="flex-grow-1" />

        <Button variant="secondary">Import</Button>
        <Button variant="primary" onClick={() => setModalOpen(true)}>Add Closed Deal</Button>
      </div>

      <AddClosedDealModal open={modalOpen} onOpenChange={setModalOpen} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Deal Title</TableHead>
            <TableHead>Deal ID</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Deal Type</TableHead>
            <TableHead>Property Type</TableHead>
            <TableHead>Brokers</TableHead>
            <TableHead>Transaction Value</TableHead>
            <TableHead>Brokerage Gross</TableHead>
            <TableHead>Open Tasks</TableHead>
            <TableHead>Next Critical Date</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-mountain-meadow-100 fw-bold">
            <TableCell />
            <TableCell className="text-nowrap">
              {STAGE.name} <span className="fw-normal">({STAGE.count} of {STAGE.total})</span>
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell className="text-nowrap">{STAGE.transactionValue}</TableCell>
            <TableCell className="text-nowrap">{STAGE.grossCommission}</TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>

          {DEALS.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>
                <FontAwesomeIcon icon={faCircleExclamation} className="text-danger" />
              </TableCell>
              <TableCell className="text-nowrap">
                <a href="#" className="text-buildout-blue-600 text-decoration-none">
                  {deal.title}
                </a>
              </TableCell>
              <TableCell className="text-nowrap">
                <a href="#" className="text-buildout-blue-600 text-decoration-none">
                  {deal.id}
                </a>
              </TableCell>
              <TableCell className="text-nowrap">{deal.location || "--"}</TableCell>
              <TableCell className="text-nowrap">{deal.dealType}</TableCell>
              <TableCell className="text-nowrap">{deal.propertyType}</TableCell>
              <TableCell>
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-secondary fw-semibold flex-shrink-0"
                  style={{ width: 24, height: 24, fontSize: 10 }}
                >
                  BB
                </div>
              </TableCell>
              <TableCell className="text-nowrap">{deal.value}</TableCell>
              <TableCell className="text-nowrap">{deal.gross || "--"}</TableCell>
              <TableCell className="text-nowrap">
                <a href="#" className="text-buildout-blue-600 text-decoration-none">
                  {deal.tasks}
                </a>
              </TableCell>
              <TableCell />
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button className="btn btn-link p-0 text-muted border-0">
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>
                    }
                  />
                  <DropdownMenuContent>
                    <DropdownMenuItem>View Deal</DropdownMenuItem>
                    <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                    <DropdownMenuItem>Remove from Pipeline</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
