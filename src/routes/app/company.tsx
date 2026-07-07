import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faBuildingUser,
  faUsers,
  faEnvelope,
  faPuzzlePiece,
  faImage,
  faBookOpen,
  faSliders,
  faSignHanging,
  faBriefcase,
  faBroadcastTower,
  faDiagramNested,
  faFileInvoice,
  faBell,
  faSitemap,
  faQ,
  faEllipsisVertical,
  faCirclePlus,
  faCircleMinus,
  faXmark,
  faMagnifyingGlass,
  faCircleInfo,
  faPaintbrushPencil,
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
import {
  Tabs,
  TabsList,
  Tab,
  TabPanel,
} from "@buildoutinc/blueprint-react/ui/Tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@buildoutinc/blueprint-react/ui/Table";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const Route = createFileRoute("/app/company")({
  component: CompanySettingsPage,
});

// ─── Sidebar data ─────────────────────────────────────────────────────────────

type SidebarItem = { label: string; icon: IconDefinition; id: string };

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Company", icon: faBuilding, id: "company" },
  { label: "Offices", icon: faBuildingUser, id: "offices" },
  { label: "Users", icon: faUsers, id: "users" },
  { label: "Email", icon: faEnvelope, id: "email" },
  { label: "Plugins", icon: faPuzzlePiece, id: "plugins" },
  { label: "Logos", icon: faImage, id: "logos" },
  { label: "Playbooks", icon: faBookOpen, id: "playbooks" },
  { label: "Custom Fields", icon: faSliders, id: "custom-fields" },
  { label: "Listings", icon: faSignHanging, id: "listings" },
  { label: "Back Office", icon: faBriefcase, id: "back-office" },
  { label: "Syndication", icon: faBroadcastTower, id: "syndication" },
  { label: "Pipeline", icon: faDiagramNested, id: "pipeline" },
  { label: "Invoice Defaults", icon: faFileInvoice, id: "invoice-defaults" },
  { label: "Notifications", icon: faBell, id: "notifications" },
  { label: "Affiliations", icon: faSitemap, id: "affiliations" },
  { label: "QuickBooks", icon: faQ, id: "quickbooks" },
];

// ─── Commission Plans data ────────────────────────────────────────────────────

const COMMISSION_PLANS = [
  {
    name: "House Split",
    type: "House Split (Plan Commissions Only)",
    resetDate: "January 1",
    resetPeriod: "1 Year",
    nextPeriod: "01/01/2027",
    tiers: "3 Tiers",
    assignees: "1 Assignee",
  },
  {
    name: "2025 Broker's Split",
    type: "Broker's Split (Plan Commissions Only)",
    resetDate: "January 1",
    resetPeriod: "1 Year",
    nextPeriod: "01/01/2027",
    tiers: "3 Tiers",
    assignees: "5 Assignees",
  },
  {
    name: "Agent Plan",
    type: "Broker's Gross (Plan Commissions Only)",
    resetDate: "January 1",
    resetPeriod: "1 Year",
    nextPeriod: "01/01/2027",
    tiers: "1 Tier",
    assignees: "5 Assignees",
  },
  {
    name: "New Test Final",
    type: "Broker's Gross (Plan Commissions Only)",
    resetDate: "January 1",
    resetPeriod: "1 Year",
    nextPeriod: "01/01/2027",
    tiers: "2 Tiers",
    assignees: "2 Assignees",
  },
  {
    name: "Custom Plan",
    type: "Custom Amount per Commission",
    resetDate: "January 1",
    resetPeriod: "1 Year",
    nextPeriod: "01/01/2027",
    tiers: "1 Tier",
    assignees: "3 Assignees",
  },
  {
    name: "New Late Add All Plan",
    type: "Broker's Gross (Plan Commissions Only)",
    resetDate: "February 1",
    resetPeriod: "1 Year",
    nextPeriod: "02/01/2027",
    tiers: "2 Tiers",
    assignees: "2 Assignees",
  },
];

// ─── Deduction Categories data ────────────────────────────────────────────────

const DEDUCTION_CATEGORIES = [
  { category: "Referrals", types: "Pre-Split, Individual, House", showAssignee: true },
  { category: "Pre Splits", types: "Pre-Split", showAssignee: false },
  { category: "Royalties", types: "Pre-Split, House", showAssignee: false },
  { category: "Signage", types: "Individual", showAssignee: true },
];

const ALL_USERS = [
  "Brian Reynolds",
  "May Broker",
  "Luke Meyer",
  "Luke Meyer",
  "Douglas Reynolds",
  "Francis Reynolds",
  "Sandy Reynolds",
  "Roger Reynolds",
];

// ─── Types ────────────────────────────────────────────────────────────────────

type UserAssignment = { name: string; amountDue: string; dueDate: string };

// ─── Assign Users Modal ───────────────────────────────────────────────────────

function AssignUsersModal({
  open,
  onOpenChange,
  initialSelected,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialSelected: UserAssignment[];
  onSave: (users: UserAssignment[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UserAssignment[]>(initialSelected);

  // Sync when modal opens with fresh initialSelected
  const handleOpen = (v: boolean) => {
    if (v) setSelected(initialSelected);
    onOpenChange(v);
  };

  const selectedNames = selected.map((u) => u.name);
  const available = ALL_USERS.filter(
    (u, i) =>
      !selectedNames.includes(u) &&
      u.toLowerCase().includes(search.toLowerCase())
  );

  const addUser = (name: string) =>
    setSelected((s) => [...s, { name, amountDue: "", dueDate: "" }]);

  const removeUser = (idx: number) =>
    setSelected((s) => s.filter((_, i) => i !== idx));

  const addAll = () =>
    setSelected((s) => [
      ...s,
      ...ALL_USERS.filter((u) => !s.map((x) => x.name).includes(u)).map((name) => ({
        name,
        amountDue: "",
        dueDate: "",
      })),
    ]);

  const removeAll = () => setSelected([]);

  const updateField = (idx: number, field: "amountDue" | "dueDate", value: string) =>
    setSelected((s) => s.map((u, i) => (i === idx ? { ...u, [field]: value } : u)));

  return (
    <Modal open={open} onOpenChange={handleOpen}>
      <ModalContent size="xl" centered>
        <ModalHeader className="border-0 pb-0">
          <ModalTitle style={{ fontSize: 22, fontWeight: 700 }}>Assign Users</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="row g-3" style={{ minHeight: 380 }}>
            {/* Available Users */}
            <div className="col-5">
              <div className="border rounded h-100 p-3 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-semibold" style={{ fontSize: 18 }}>Available Users</span>
                  <button
                    className="btn btn-link btn-sm p-0 text-primary text-decoration-none"
                    style={{ fontSize: 13 }}
                    onClick={addAll}
                  >
                    Add all
                  </button>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-white border-end-0">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-muted" style={{ fontSize: 12 }} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ fontSize: 13 }}
                  />
                </div>
                <div className="d-flex flex-column gap-1 overflow-auto">
                  {available.map((user, i) => (
                    <div
                      key={`${user}-${i}`}
                      className="d-flex align-items-center justify-content-between border rounded px-3 py-2"
                      style={{ fontSize: 13, cursor: "pointer" }}
                      onClick={() => addUser(user)}
                    >
                      <span>{user}</span>
                      <button
                        className="btn btn-link p-0 border-0 text-primary"
                        style={{ lineHeight: 1 }}
                        onClick={(e) => { e.stopPropagation(); addUser(user); }}
                      >
                        <FontAwesomeIcon icon={faCirclePlus} style={{ fontSize: 20 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Users */}
            <div className="col-7">
              <div className="border rounded h-100 p-3 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-semibold" style={{ fontSize: 18 }}>Selected Users</span>
                  <button
                    className="btn btn-link btn-sm p-0 text-primary text-decoration-none"
                    style={{ fontSize: 13 }}
                    onClick={removeAll}
                  >
                    Remove All
                  </button>
                </div>

                {selected.length > 0 && (
                  <div className="d-flex gap-2 px-2 mb-1 text-muted fw-semibold" style={{ fontSize: 11 }}>
                    <span style={{ flex: "0 0 140px" }}>Name</span>
                    <span style={{ flex: "0 0 120px" }}>Amount Due</span>
                    <span style={{ flex: 1 }}>Due Date</span>
                    <span style={{ width: 28 }} />
                  </div>
                )}

                <div className="d-flex flex-column gap-2 overflow-auto">
                  {selected.map((user, i) => (
                    <div
                      key={`${user.name}-${i}`}
                      className="d-flex align-items-center gap-2 border rounded px-2 py-2"
                      style={{ fontSize: 13 }}
                    >
                      <span style={{ flex: "0 0 140px" }} className="text-truncate">{user.name}</span>

                      {/* Amount Due */}
                      <div className="input-group input-group-sm" style={{ flex: "0 0 120px" }}>
                        <span className="input-group-text">$</span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="0.00"
                          value={user.amountDue}
                          onChange={(e) => updateField(i, "amountDue", e.target.value)}
                          style={{ fontSize: 13 }}
                        />
                      </div>

                      {/* Due Date */}
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        style={{ flex: 1, fontSize: 13 }}
                        value={user.dueDate}
                        onChange={(e) => updateField(i, "dueDate", e.target.value)}
                      />

                      <button
                        className="btn btn-link p-0 border-0 text-primary flex-shrink-0"
                        style={{ lineHeight: 1, width: 24 }}
                        onClick={() => removeUser(i)}
                      >
                        <FontAwesomeIcon icon={faCircleMinus} style={{ fontSize: 20 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="d-flex justify-content-end gap-2">
          <ModalClose render={<button className="btn btn-outline-secondary" />}>
            Cancel
          </ModalClose>
          <button
            className="btn btn-primary px-4"
            onClick={() => { onSave(selected); onOpenChange(false); }}
          >
            Save
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Company section ──────────────────────────────────────────────────────────

function CompanySection() {
  return (
    <Tabs defaultValue="settings">
      <TabsList className="mb-4">
        <Tab value="settings" icon={<FontAwesomeIcon icon={faCircleInfo} />}>
          Settings
        </Tab>
        <Tab value="styles" icon={<FontAwesomeIcon icon={faPaintbrushPencil} />}>
          Styles
        </Tab>
      </TabsList>

      <TabPanel value="settings">
        {/* Company Information */}
        <section className="mb-4">
          <h5 className="fw-bold mb-3">Company Information</h5>
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label fw-medium">Company Name</label>
              <input type="text" className="form-control" defaultValue="NAI Demo" />
            </div>
            <div className="col-6">
              <label className="form-label fw-medium">Company Email Address</label>
              <input type="email" className="form-control" defaultValue="staging@buildout.com" />
            </div>

            <div className="col-6">
              <label className="form-label fw-medium">Salesforce ID</label>
              <input type="text" className="form-control" defaultValue="00013700003mZtc" />
            </div>
            <div className="col-6">
              <label className="form-label fw-medium">Admin Email Addresses</label>
              <input type="text" className="form-control" />
              <div className="form-text">Copied on Syndication email updates, if desired.</div>
            </div>

            <div className="col-6">
              <label className="form-label fw-medium">Website</label>
              <input type="text" className="form-control" defaultValue="http://naidemo.com" />
            </div>
          </div>
        </section>

        <hr className="my-4" />

        {/* Specialties / Sub-Specialties / Territories */}
        <section className="mb-4">
          <h5 className="fw-bold mb-3">Specialties</h5>
          <select className="form-select" defaultValue="">
            <option value="" disabled>Select...</option>
          </select>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold mb-3">Sub-Specialties</h5>
          <select className="form-select" defaultValue="">
            <option value="" disabled>Select...</option>
          </select>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold mb-3">Territories</h5>
          <select className="form-select" disabled defaultValue="">
            <option value="" disabled>Select...</option>
          </select>
        </section>

        <hr className="my-4" />

        {/* Department & Role Contacts */}
        <section className="mb-4">
          <h5 className="fw-bold mb-3">Department &amp; Role Contacts</h5>
          <div className="border rounded overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department/Role</TableHead>
                  <TableHead>Assigned User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="fw-bold">NAI Business Administrator (Role)</TableCell>
                  <TableCell>
                    <select className="form-select form-select-sm" defaultValue="Jenny Broker">
                      <option>Jenny Broker</option>
                    </select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="fw-bold">NAI Communications Administrator Role (Role)</TableCell>
                  <TableCell>
                    <select className="form-select form-select-sm" defaultValue="">
                      <option value="" disabled>Select...</option>
                    </select>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        <hr className="my-4" />

        {/* Regions */}
        <section className="mb-4">
          <h5 className="fw-bold mb-3">Regions</h5>
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label fw-medium">Primary Company Region</label>
              <select className="form-select" disabled defaultValue="none">
                <option value="none">- No region assigned -</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label fw-medium">Secondary Company Region</label>
              <select className="form-select" disabled defaultValue="none">
                <option value="none">- No region assigned -</option>
              </select>
            </div>
          </div>
        </section>

        <hr className="my-4" />

        {/* Social Media */}
        <section className="mb-4">
          <h5 className="fw-bold mb-3">Social Media</h5>
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label fw-medium">Facebook URL</label>
              <input type="text" className="form-control" defaultValue="https://www.facebook.com/" />
            </div>
            <div className="col-6">
              <label className="form-label fw-medium">LinkedIn URL</label>
              <input type="text" className="form-control" defaultValue="https://www.linkedin.com" />
            </div>
            <div className="col-6">
              <label className="form-label fw-medium">Twitter/X URL</label>
              <input type="text" className="form-control" defaultValue="https://www.twitter.com" />
            </div>
            <div className="col-6">
              <label className="form-label fw-medium">YouTube URL</label>
              <input type="text" className="form-control" defaultValue="https://www.youtube.com" />
            </div>
          </div>
        </section>

        <hr className="my-4" />

        {/* Disclaimer */}
        <section className="mb-4">
          <h5 className="fw-bold mb-3">Disclaimer</h5>
          <textarea
            className="form-control"
            rows={4}
            defaultValue="No Warranty Or Representation, Express Or Implied, Is Made As To The Accuracy Of The Information Contained Herein, And The Same Is Submitted Subject To Errors, Omissions, Change Of Price, Rental Or Other Conditions, Prior Sale, Lease Or Financing, Or Withdrawal Without Notice, And Of Any Special Listing Conditions Imposed By Our Principals No Warranties Or Representations Are Made As To The Condition Of The Property Or Any Hazards Contained Therein Are Any To Be Implied."
          />
        </section>

        <hr className="my-4" />

        {/* Listing Visibility */}
        <section>
          <h5 className="fw-bold mb-3">Listing Visibility</h5>
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="share-on-market" />
            <label className="form-check-label fw-medium" htmlFor="share-on-market">
              Share &apos;On Market&apos; Listings
            </label>
            <div className="form-text">
              Users can see other users on market listings in the index and public docs from within the listing view
            </div>
          </div>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="share-closed" />
            <label className="form-check-label fw-medium" htmlFor="share-closed">
              Share &apos;Closed&apos; Listings
            </label>
            <div className="form-text">
              Users can see other users closed listings in the index and public docs from within the listing view
            </div>
          </div>
        </section>

        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-primary px-4">Save Changes</button>
        </div>
      </TabPanel>

      <TabPanel value="styles">
        <div className="text-muted py-4 text-center" style={{ fontSize: 13 }}>
          No styles configured.
        </div>
      </TabPanel>
    </Tabs>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CompanySettingsPage() {
  const [activeSection, setActiveSection] = useState("company");
  const [openModalFor, setOpenModalFor] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, UserAssignment[]>>({
    Referrals: [],
    Signage: [],
  });

  const handleSave = (category: string, users: UserAssignment[]) => {
    setAssignments((prev) => ({ ...prev, [category]: users }));
  };

  const assigneeLabel = (category: string) => {
    const count = assignments[category]?.length ?? 0;
    if (count === 0) return null;
    return count === 1 ? "1 Assignee" : `${count} Assignees`;
  };

  return (
    <div className="container-fluid py-4 px-5" style={{ fontSize: 14 }}>
      {/* Page header */}
      <div className="d-flex align-items-baseline gap-4 mb-4">
        <h4 className="fw-bold mb-0">Company Settings</h4>
        <span className="text-muted" style={{ fontSize: 15 }}>
          Update your company information and settings.
        </span>
      </div>

      {/* Card shell */}
      <div className="border rounded bg-white d-flex overflow-hidden" style={{ minHeight: 600 }}>

        {/* Left sidebar */}
        <div className="border-end flex-shrink-0 py-3" style={{ width: 200 }}>
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`d-flex align-items-center gap-2 w-100 border-0 text-start px-4 py-2 ${
                activeSection === item.id
                  ? "bg-light fw-medium text-body"
                  : "bg-white text-muted"
              }`}
              style={{ fontSize: 13, cursor: "pointer" }}
              onClick={() => setActiveSection(item.id)}
            >
              <FontAwesomeIcon icon={item.icon} style={{ width: 14 }} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-grow-1 p-5 overflow-auto">
          {activeSection === "company" ? (
            <CompanySection />
          ) : (
          <>
          {/* Commission Plans */}
          <section className="mb-6">
            <h5 className="fw-bold mb-4">Commission Plans</h5>

            <Tabs defaultValue="plans">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <TabsList>
                  <Tab value="plans">Plans</Tab>
                  <Tab value="brokers">Brokers</Tab>
                </TabsList>
                <div className="d-flex align-items-center gap-3" style={{ fontSize: 13 }}>
                  <button className="btn btn-link btn-sm p-0 text-muted text-decoration-none">
                    Show Archived Plans
                  </button>
                  <button className="btn btn-link btn-sm p-0 text-primary text-decoration-none">
                    + Add Commission Plan
                  </button>
                </div>
              </div>

              <TabPanel value="plans">
                <div className="border rounded overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plan Name</TableHead>
                        <TableHead>Plan Type</TableHead>
                        <TableHead>Reset Date</TableHead>
                        <TableHead>Reset Period</TableHead>
                        <TableHead>Next Period Starts</TableHead>
                        <TableHead>Tiers</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead style={{ width: 36 }} />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {COMMISSION_PLANS.map((plan) => (
                        <TableRow key={plan.name}>
                          <TableCell>
                            <a href="#" className="text-primary text-decoration-none fw-medium">
                              {plan.name}
                            </a>
                          </TableCell>
                          <TableCell className="text-muted">{plan.type}</TableCell>
                          <TableCell>{plan.resetDate}</TableCell>
                          <TableCell>{plan.resetPeriod}</TableCell>
                          <TableCell>{plan.nextPeriod}</TableCell>
                          <TableCell>
                            <a href="#" className="text-primary text-decoration-none">
                              {plan.tiers}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a href="#" className="text-primary text-decoration-none">
                              {plan.assignees}
                            </a>
                          </TableCell>
                          <TableCell>
                            <button className="btn btn-link btn-sm text-muted p-0">
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabPanel>

              <TabPanel value="brokers">
                <div className="text-muted py-4 text-center" style={{ fontSize: 13 }}>
                  No brokers to display.
                </div>
              </TabPanel>
            </Tabs>
          </section>

          {/* Deduction Categories */}
          <section>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">Deduction Categories</h5>
              <button className="btn btn-link btn-sm p-0 text-primary text-decoration-none" style={{ fontSize: 13 }}>
                + Add Category
              </button>
            </div>

            <div className="border rounded overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Deduction Types</TableHead>
                    <TableHead>Pre-Split Deduction Tier</TableHead>
                    <TableHead>Broker Deduction Balance</TableHead>
                    <TableHead style={{ width: 36 }} />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEDUCTION_CATEGORIES.map((cat) => (
                    <TableRow key={cat.category}>
                      <TableCell className="fw-medium">{cat.category}</TableCell>
                      <TableCell className="text-muted">{cat.types}</TableCell>
                      <TableCell><span className="text-muted">–</span></TableCell>
                      <TableCell>
                        {cat.showAssignee ? (
                          <button
                            className="btn btn-link p-0 text-primary text-decoration-none d-flex align-items-center gap-1"
                            style={{ fontSize: 14 }}
                            onClick={() => setOpenModalFor(cat.category)}
                          >
                            {assigneeLabel(cat.category) ? (
                              assigneeLabel(cat.category)
                            ) : (
                              <>
                                <FontAwesomeIcon icon={faCirclePlus} style={{ fontSize: 15 }} />
                                Add Assignee
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-muted">–</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <button className="btn btn-link btn-sm text-muted p-0">
                          <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
          </>
          )}
        </div>
      </div>

      {DEDUCTION_CATEGORIES.filter((c) => c.showAssignee).map((cat) => (
        <AssignUsersModal
          key={cat.category}
          open={openModalFor === cat.category}
          onOpenChange={(v) => !v && setOpenModalFor(null)}
          initialSelected={assignments[cat.category] ?? []}
          onSave={(users) => handleSave(cat.category, users)}
        />
      ))}
    </div>
  );
}
