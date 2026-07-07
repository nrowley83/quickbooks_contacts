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

const BROKER_OPTIONS = ["Bill Broker", "Jenny Broker", "Brian Reynolds", "May Broker"];
const PCT_OPTIONS = ["10%", "20%", "25%", "50%", "75%", "100%"];

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
      <div className="d-flex align-items-center justify-content-between mt-4 mb-3">
        <h6 className="fw-normal fs-5 mb-0">{title}</h6>
        <Button variant="ghost" size="sm" className="text-primary" onClick={onAdd}>
          {addLabel}
        </Button>
      </div>
      {items.length === 0 ? (
        <div
          className="border rounded p-3 d-flex align-items-center gap-3"
          style={{ borderStyle: "dashed" }}
        >
          <FontAwesomeIcon icon={emptyIcon} className="text-primary" style={{ fontSize: 20 }} />
          <span>{emptyText}</span>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {items.map((val, i) => (
            <div className="d-flex gap-2" key={i}>
              <Input
                placeholder={placeholder}
                value={val}
                onValueChange={(v) => onChange(i, v)}
              />
              <button className="btn btn-link text-muted p-0 px-2" onClick={() => onRemove(i)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
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
      <ModalContent size="lg" centered scrollable>
        <ModalHeader className="border-bottom pb-3">
          <ModalTitle style={{ fontSize: 20 }}>Add Closed Deal</ModalTitle>
        </ModalHeader>

        <ModalBody className="py-4">
          <div className="mb-3">
            <label className="form-label">
              Deal Type<span className="text-danger ms-1">*</span>
            </label>
            <select
              className="form-select"
              value={dealType}
              onChange={(e) => setDealType(e.target.value)}
            >
              <option value="" disabled>Select...</option>
              <option value="Sale">Sale</option>
              <option value="Lease">Lease</option>
            </select>
          </div>

          {isSale && (
            <>
              <h6 className="fw-normal fs-5 mt-4 mb-3">Deal Details</h6>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label">
                    Deal Title<span className="text-danger ms-1">*</span>
                  </label>
                  <Input value={dealTitle} onValueChange={setDealTitle} />
                </div>
                <div className="col-6">
                  <label className="form-label">Deal ID</label>
                  <Input value={dealId} onValueChange={setDealId} placeholder="Auto-generated" />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between mt-4 mb-3">
                <h6 className="fw-normal fs-5 mb-0">Brokers</h6>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={() => setBrokers((rows) => [...rows, { broker: BROKER_OPTIONS[0], pct: "10%" }])}
                >
                  + Add Broker
                </Button>
              </div>
              <div className="d-flex flex-column gap-2">
                {brokers.map((b, i) => (
                  <div className="d-flex gap-2" key={i}>
                    <select
                      className="form-select flex-grow-1"
                      value={b.broker}
                      onChange={(e) => updateBroker(i, "broker", e.target.value)}
                    >
                      {BROKER_OPTIONS.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <select
                      className="form-select"
                      style={{ width: 80 }}
                      value={b.pct}
                      onChange={(e) => updateBroker(i, "pct", e.target.value)}
                    >
                      {PCT_OPTIONS.map((pct) => (
                        <option key={pct} value={pct}>{pct}</option>
                      ))}
                    </select>
                    <div className="form-control text-end text-muted" style={{ width: 90 }}>
                      {brokerValue(b.pct)}
                    </div>
                    {brokers.length > 1 && (
                      <button
                        className="btn btn-link text-muted p-0 px-2"
                        onClick={() => setBrokers((rows) => rows.filter((_, idx) => idx !== i))}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
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

              <h6 className="fw-normal fs-5 mt-4 mb-3">Property</h6>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <Input value={address} onValueChange={setAddress} />
                </div>
                <div className="col-4">
                  <label className="form-label">City</label>
                  <Input value={city} onValueChange={setCity} />
                </div>
                <div className="col-4">
                  <label className="form-label">State</label>
                  <Input value={propertyState} onValueChange={setPropertyState} />
                </div>
                <div className="col-4">
                  <label className="form-label">Zip</label>
                  <Input value={zip} onValueChange={setZip} />
                </div>
                <div className="col-6">
                  <label className="form-label">Property Type</label>
                  <select
                    className="form-select"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="" disabled>Select...</option>
                    <option value="Office">Office</option>
                    <option value="Retail">Retail</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
              </div>

              <h6 className="fw-normal fs-5 mt-4 mb-3">Transaction</h6>
              <div className="row g-3">
                <div className="col-4">
                  <label className="form-label">Transaction Value</label>
                  <Input
                    type="number"
                    value={transactionValue}
                    onValueChange={setTransactionValue}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label">Close Date</label>
                  <Input placeholder="MM/DD/YYYY" value={closeDate} onValueChange={setCloseDate} />
                </div>
                <div className="col-4">
                  <label className="form-label">Brokerage Gross</label>
                  <Input
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

        <ModalFooter className="d-flex justify-content-end gap-2 border-top pt-3">
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
