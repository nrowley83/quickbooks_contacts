import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCaretDown,
  faCircleExclamation,
  faEllipsisVertical,
  faEllipsis,
  faXmark,
  faUser,
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
const PROPERTY_SUBTYPE_ITEMS = [
  { label: "Office Building", value: "Office Building" },
  { label: "Retail Strip Center", value: "Retail Strip Center" },
  { label: "Warehouse/Distribution", value: "Warehouse/Distribution" },
  { label: "Land Parcel", value: "Land Parcel" },
];
const TRANSACTION_TYPE_ITEMS = [
  { label: "Investment Sale", value: "Investment Sale" },
  { label: "Owner-User Sale", value: "Owner-User Sale" },
  { label: "1031 Exchange", value: "1031 Exchange" },
  { label: "Sale-Leaseback", value: "Sale-Leaseback" },
];
const CONFIDENTIAL_ITEMS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const US_STATES = [
  { name: "Alabama", abbr: "AL" },
  { name: "Alaska", abbr: "AK" },
  { name: "Arizona", abbr: "AZ" },
  { name: "Arkansas", abbr: "AR" },
  { name: "California", abbr: "CA" },
  { name: "Colorado", abbr: "CO" },
  { name: "Connecticut", abbr: "CT" },
  { name: "Delaware", abbr: "DE" },
  { name: "District of Columbia", abbr: "DC" },
  { name: "Florida", abbr: "FL" },
  { name: "Georgia", abbr: "GA" },
  { name: "Hawaii", abbr: "HI" },
  { name: "Idaho", abbr: "ID" },
  { name: "Illinois", abbr: "IL" },
  { name: "Indiana", abbr: "IN" },
  { name: "Iowa", abbr: "IA" },
  { name: "Kansas", abbr: "KS" },
  { name: "Kentucky", abbr: "KY" },
  { name: "Louisiana", abbr: "LA" },
  { name: "Maine", abbr: "ME" },
  { name: "Maryland", abbr: "MD" },
  { name: "Massachusetts", abbr: "MA" },
  { name: "Michigan", abbr: "MI" },
  { name: "Minnesota", abbr: "MN" },
  { name: "Mississippi", abbr: "MS" },
  { name: "Missouri", abbr: "MO" },
  { name: "Montana", abbr: "MT" },
  { name: "Nebraska", abbr: "NE" },
  { name: "Nevada", abbr: "NV" },
  { name: "New Hampshire", abbr: "NH" },
  { name: "New Jersey", abbr: "NJ" },
  { name: "New Mexico", abbr: "NM" },
  { name: "New York", abbr: "NY" },
  { name: "North Carolina", abbr: "NC" },
  { name: "North Dakota", abbr: "ND" },
  { name: "Ohio", abbr: "OH" },
  { name: "Oklahoma", abbr: "OK" },
  { name: "Oregon", abbr: "OR" },
  { name: "Pennsylvania", abbr: "PA" },
  { name: "Rhode Island", abbr: "RI" },
  { name: "South Carolina", abbr: "SC" },
  { name: "South Dakota", abbr: "SD" },
  { name: "Tennessee", abbr: "TN" },
  { name: "Texas", abbr: "TX" },
  { name: "Utah", abbr: "UT" },
  { name: "Vermont", abbr: "VT" },
  { name: "Virginia", abbr: "VA" },
  { name: "Washington", abbr: "WA" },
  { name: "West Virginia", abbr: "WV" },
  { name: "Wisconsin", abbr: "WI" },
  { name: "Wyoming", abbr: "WY" },
];
const STATE_ITEMS = US_STATES.map((s) => ({ label: s.name, value: s.abbr }));

const NON_DISCLOSURE_STATE_ABBRS = [
  "AK", "ID", "KS", "LA", "MS", "MO", "MT", "NM", "ND", "TX", "UT", "WY",
];

function isNonDisclosureState(abbr: string): boolean {
  return NON_DISCLOSURE_STATE_ABBRS.includes(abbr);
}

type BrokerRow = { broker: string; pct: string; value: string };
type OutsideBrokerRow = { contact: string; pct: string; value: string };

function RepeatableSection({
  title,
  required,
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
  required?: boolean;
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
        <span>
          {title}
          {required && <span style={requiredStyle}>*</span>}
        </span>
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
  const [primaryBrokers, setPrimaryBrokers] = useState<BrokerRow[]>([
    { broker: "", pct: "", value: "0" },
  ]);
  const [outsideBrokers, setOutsideBrokers] = useState<OutsideBrokerRow[]>([
    { contact: "", pct: "", value: "0" },
  ]);
  const [closeDate, setCloseDate] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertySubtype, setPropertySubtype] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [propertyState, setPropertyState] = useState("");
  const [zip, setZip] = useState("");
  const [county, setCounty] = useState("");
  const [buildingSize, setBuildingSize] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [grossCommissionPct, setGrossCommissionPct] = useState("");
  const [grossCommissionDollar, setGrossCommissionDollar] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [buyerTenantCompanyType, setBuyerTenantCompanyType] = useState("");
  const [sellerLandlordCompanyType, setSellerLandlordCompanyType] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [operatingExpenses, setOperatingExpenses] = useState("");
  const [confidential, setConfidential] = useState("");

  const buyers = useRepeatableSection();
  const sellers = useRepeatableSection();

  const isSale = dealType === "Sale";

  const updatePrimaryBroker = (i: number, field: keyof BrokerRow, value: string) =>
    setPrimaryBrokers((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));

  const updateOutsideBroker = (i: number, field: keyof OutsideBrokerRow, value: string) =>
    setOutsideBrokers((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));

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
          <div style={{ ...sectionTitleRowStyle, justifyContent: "flex-start", margin: "0 0 16px" }}>Deal</div>
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
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>Deal Title</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <Input style={{ ...inputStyle, flex: 1 }} value={dealTitle} onValueChange={setDealTitle} />
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ height: 37, padding: "0 12px", flex: "0 0 auto" }}
                  >
                    <FontAwesomeIcon icon={faEllipsis} />
                  </button>
                </div>
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>Deal ID</label>
                <Input style={inputStyle} value={dealId} onValueChange={setDealId} />
              </div>

              <div style={{ ...sectionTitleRowStyle, justifyContent: "flex-start" }}>Brokers</div>

              <label style={fieldLabelStyle}>
                Primary Broker<span style={requiredStyle}>*</span>
              </label>
              <div>
                {primaryBrokers.map((b, i) => (
                  <div style={brokerRowStyle} key={i}>
                    <Select
                      items={BROKER_ITEMS}
                      value={b.broker || null}
                      onValueChange={(v) => updatePrimaryBroker(i, "broker", v ?? "")}
                    >
                      <SelectTrigger style={{ ...selectTriggerStyle, flex: 1 }}>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {BROKER_ITEMS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      items={PCT_ITEMS}
                      value={b.pct || null}
                      onValueChange={(v) => updatePrimaryBroker(i, "pct", v ?? "")}
                    >
                      <SelectTrigger style={{ ...selectTriggerStyle, width: 64, flex: "0 0 auto", padding: "8px 6px" }}>
                        <SelectValue placeholder="%" />
                      </SelectTrigger>
                      <SelectContent>
                        {PCT_ITEMS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      style={{ ...inputStyle, width: 90, flex: "0 0 auto" }}
                      type="number"
                      value={b.value}
                      onValueChange={(v) => updatePrimaryBroker(i, "value", v)}
                    />
                    {primaryBrokers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        style={removeButtonStyle}
                        onClick={() => setPrimaryBrokers((rows) => rows.filter((_, idx) => idx !== i))}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <Button
                  type="button"
                  variant="ghost"
                  style={addLinkStyle}
                  onClick={() => setPrimaryBrokers((rows) => [...rows, { broker: "", pct: "", value: "0" }])}
                >
                  + Add Broker
                </Button>
              </div>

              <label style={fieldLabelStyle}>Outside Broker</label>
              <div>
                {outsideBrokers.map((b, i) => (
                  <div style={brokerRowStyle} key={i}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="text-muted"
                        style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12 }}
                      />
                      <Input
                        style={{ ...inputStyle, paddingLeft: 32 }}
                        placeholder="Enter contact name or email"
                        value={b.contact}
                        onValueChange={(v) => updateOutsideBroker(i, "contact", v)}
                      />
                    </div>
                    <Select
                      items={PCT_ITEMS}
                      value={b.pct || null}
                      onValueChange={(v) => updateOutsideBroker(i, "pct", v ?? "")}
                    >
                      <SelectTrigger style={{ ...selectTriggerStyle, width: 64, flex: "0 0 auto", padding: "8px 6px" }}>
                        <SelectValue placeholder="%" />
                      </SelectTrigger>
                      <SelectContent>
                        {PCT_ITEMS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      style={{ ...inputStyle, width: 90, flex: "0 0 auto" }}
                      type="number"
                      value={b.value}
                      onValueChange={(v) => updateOutsideBroker(i, "value", v)}
                    />
                    {outsideBrokers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        style={removeButtonStyle}
                        onClick={() => setOutsideBrokers((rows) => rows.filter((_, idx) => idx !== i))}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <Button
                  type="button"
                  variant="ghost"
                  style={addLinkStyle}
                  onClick={() => setOutsideBrokers((rows) => [...rows, { contact: "", pct: "", value: "0" }])}
                >
                  + Add Broker
                </Button>
              </div>

              <RepeatableSection
                title="Buyer"
                required
                addLabel="+ Add Buyer"
                items={buyers.items}
                onAdd={buyers.add}
                onRemove={buyers.remove}
                onChange={buyers.change}
                emptyIcon={faUser}
                emptyText="No Buyers have been added."
                placeholder="Buyer name"
              />

              <RepeatableSection
                title="Seller"
                required
                addLabel="+ Add Seller"
                items={sellers.items}
                onAdd={sellers.add}
                onRemove={sellers.remove}
                onChange={sellers.change}
                emptyIcon={faUser}
                emptyText="No Sellers have been added."
                placeholder="Seller name"
              />

              <div style={{ ...sectionTitleRowStyle, justifyContent: "flex-start" }}>Critical Dates</div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Close Date<span style={requiredStyle}>*</span>
                </label>
                <Input
                  style={inputStyle}
                  placeholder="MM/DD/YYYY"
                  value={closeDate}
                  onValueChange={setCloseDate}
                />
              </div>

              <div style={{ ...sectionTitleRowStyle, justifyContent: "flex-start" }}>Property</div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Property Type<span style={requiredStyle}>*</span>
                </label>
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
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Property Subtype<span style={requiredStyle}>*</span>
                </label>
                <Select
                  items={PROPERTY_SUBTYPE_ITEMS}
                  value={propertySubtype || null}
                  onValueChange={(v) => setPropertySubtype(v ?? "")}
                >
                  <SelectTrigger style={selectTriggerStyle}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_SUBTYPE_ITEMS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>Property Name</label>
                <Input style={inputStyle} value={propertyName} onValueChange={setPropertyName} />
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Address<span style={requiredStyle}>*</span>
                </label>
                <Input style={inputStyle} value={address} onValueChange={setAddress} />
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>Address 2</label>
                <Input style={inputStyle} value={address2} onValueChange={setAddress2} />
              </div>
              <div style={{ display: "flex", gap: 16, ...fieldWrapperStyle }}>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabelStyle}>
                    City<span style={requiredStyle}>*</span>
                  </label>
                  <Input style={inputStyle} value={city} onValueChange={setCity} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabelStyle}>
                    State<span style={requiredStyle}>*</span>
                  </label>
                  <Select
                    items={STATE_ITEMS}
                    value={propertyState || null}
                    onValueChange={(v) => setPropertyState(v ?? "")}
                  >
                    <SelectTrigger style={selectTriggerStyle}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {STATE_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabelStyle}>
                    Zip<span style={requiredStyle}>*</span>
                  </label>
                  <Input style={inputStyle} value={zip} onValueChange={setZip} />
                </div>
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>County</label>
                <Input style={inputStyle} value={county} onValueChange={setCounty} />
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Building Size (SF)<span style={requiredStyle}>*</span>
                </label>
                <Input style={inputStyle} type="number" value={buildingSize} onValueChange={setBuildingSize} />
              </div>

              <div style={{ ...sectionTitleRowStyle, justifyContent: "flex-start" }}>Transaction</div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Sale Price<span style={requiredStyle}>*</span>
                </label>
                <Input style={inputStyle} type="number" value={salePrice} onValueChange={setSalePrice} />
                {isNonDisclosureState(propertyState) && (
                  <div style={{ color: MC.mutedIcon, fontSize: 12, marginTop: 4 }}>
                    Sale Price will not appear in the Data Mining Report
                  </div>
                )}
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>Gross Commission %</label>
                <Input
                  style={inputStyle}
                  type="number"
                  value={grossCommissionPct}
                  onValueChange={setGrossCommissionPct}
                />
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>Gross Commission $</label>
                <Input
                  style={inputStyle}
                  type="number"
                  value={grossCommissionDollar}
                  onValueChange={setGrossCommissionDollar}
                />
              </div>

              <div style={{ ...sectionTitleRowStyle, justifyContent: "flex-start" }}>Custom Fields</div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Transaction Type<span style={requiredStyle}>*</span>
                </label>
                <Select
                  items={TRANSACTION_TYPE_ITEMS}
                  value={transactionType || null}
                  onValueChange={(v) => setTransactionType(v ?? "")}
                >
                  <SelectTrigger style={selectTriggerStyle}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSACTION_TYPE_ITEMS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Buyer/Tenant Company Type<span style={requiredStyle}>*</span>
                </label>
                <Input
                  style={inputStyle}
                  value={buyerTenantCompanyType}
                  onValueChange={setBuyerTenantCompanyType}
                />
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Seller/Landlord Company Type<span style={requiredStyle}>*</span>
                </label>
                <Input
                  style={inputStyle}
                  value={sellerLandlordCompanyType}
                  onValueChange={setSellerLandlordCompanyType}
                />
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Referral Source<span style={requiredStyle}>*</span>
                </label>
                <Input style={inputStyle} value={referralSource} onValueChange={setReferralSource} />
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Operating Expenses<span style={requiredStyle}>*</span>
                </label>
                <Input
                  style={inputStyle}
                  type="number"
                  value={operatingExpenses}
                  onValueChange={setOperatingExpenses}
                />
              </div>
              <div style={fieldWrapperStyle}>
                <label style={fieldLabelStyle}>
                  Confidential<span style={requiredStyle}>*</span>
                </label>
                <Select
                  items={CONFIDENTIAL_ITEMS}
                  value={confidential || null}
                  onValueChange={(v) => setConfidential(v ?? "")}
                >
                  <SelectTrigger style={selectTriggerStyle}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CONFIDENTIAL_ITEMS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            Create
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
