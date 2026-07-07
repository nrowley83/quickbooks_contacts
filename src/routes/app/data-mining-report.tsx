import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faChevronLeft,
  faArrowUpWideShort,
} from "@fortawesome/pro-regular-svg-icons";

export const Route = createFileRoute("/app/data-mining-report")({
  component: DataMiningReportPage,
});

// ─── Report data ────────────────────────────────────────────────────────────

const HEADERS = [
  "Company", "Deal Type", "Transaction Side", "Buyer/Tenant", "Seller/Landlord",
  "Landlord Commonly Known Institutional Name", "Property Type", "Transaction Type",
  "Address", "Address2", "City", "State", "Zip", "Country", "Lot Size (AC)",
  "Building Size (SF)", "Transaction Value", "Close Date", "Internal Brokers",
  "Referral Source", "Outside Broker", "CoBroker Company", "Buyer/Tenant Company Type",
  "Seller/Landlord Company Type", "Lease Term (Months)", "Average Lease Rate",
  "Rent Schedule Description", "Free Rent Period", "Lease Type", "Agreement Type",
  "Net Operating Income", "Cap Rate", "Operating Expenses", "Property Subtype",
  "Deal Name", "County", "Create Date", "Number Of Units", "Occupancy %",
];

const ROWS = [
  ["NAI Demo", "Sale", "Buy Side", "Robert Buyer", "Sally Seller", "--", "Office", "User", "515 North State Street", "--", "Chicago", "IL", "60654", "United States", "--", "25,000", "$500,000.00", "11/14/2025", "Bill Broker", "Other", "", "", "N/A", "N/A", "--", "--", "--", "--", "--", "--", "--", "--", "$0", "Office Building", "Retail Sale", "Cook", "10/27/2025", "--", "--"],
  ["NAI Demo", "Sale", "Sell Side", "Peter Smith", "Shane Mook", "--", "Office", "Both", "891 Plaza Drive", "--", "Westmont", "IL", "60559", "United States", "--", "5,500", "$300,000.00", "11/29/2025", "Bill Broker", "Other", "", "", "N/A", "N/A", "--", "--", "--", "--", "--", "--", "--", "--", "$0", "Office Building", "891 Plaza Drive", "DuPage", "11/24/2025", "--", "--"],
  ["NAI Demo", "Lease", "", "--", "Sally Seller", "Test Co.", "--", "--", "--", "--", "--", "--", "--", "United States", "--", "--", "$0.00", "11/28/2025", "Bill Broker", "--", "", "", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "ID 114045", "--", "11/26/2025", "--", "--"],
  ["NAI Demo", "Buyer Rep", "", "Brian Client", "--", "--", "--", "--", "2833 West Touhy Avenue", "--", "Chicago", "IL", "60645", "United States", "--", "--", "$4,500,000.00", "12/05/2025", "Bill Broker", "--", "Rem Brady", "NAI G2 Demo", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Email Test 11/24", "--", "11/26/2025", "--", "--"],
  ["NAI Demo", "Sale", "", "--", "--", "--", "--", "--", "3500 Market Street", "--", "Riverside", "Lyonne", "453-242", "France", "--", "--", "$1,000,000.00", "12/06/2025", "Bill Broker", "--", "Rem Brady", "NAI G2 Demo", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "3500 Market St", "--", "11/27/2025", "--", "--"],
  ["NAI Demo", "Sale", "", "--", "--", "--", "Office", "--", "123 West Madison Street", "--", "Fairmount", "IN", "46928", "Mexico", "--", "--", "$1,000,000.00", "11/29/2025", "Bill Broker", "--", "Brittany Millspaugh", "NAI G2 Demo", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Office Building", "Test Deal", "--", "12/03/2025", "--", "--"],
  ["NAI Demo", "Lease", "", "--", "--", "--", "Retail", "--", "455 R St", "--", "Chicago", "IL", "60625", "United States", "--", "--", "$1,000,000.00", "12/19/2025", "Bill Broker", "--", "Rem Brady", "NAI G2 Demo", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Street Retail", "Testing Property Size", "--", "12/09/2025", "--", "--"],
  ["NAI Demo", "Sale", "", "--", "--", "--", "--", "--", "445 N St", "--", "Chicago", "IL", "--", "United States", "--", "3,550", "$0.00", "--", "Bill Broker", "--", "", "", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Import Sale", "--", "12/10/2025", "--", "--"],
  ["NAI Demo", "Lease", "", "--", "Sally Seller", "--", "Industrial", "--", "689 R St", "STE. 1", "Chicago", "IL", "60624", "United States", "--", "3,500", "$1,000,000.00", "11/30/2025", "Bill Broker", "--", "", "", "--", "--", "--", "--", "--", "--", "--", "--", "5.00%", "--", "Warehouse/Distribution", "Closed Lease", "--", "12/10/2025", "--", "--"],
  ["NAI Demo", "Lease", "", "--", "IMPORT OWNER", "--", "--", "--", "555", "--", "Chicago", "IL", "--", "United States", "--", "25,000", "$0.00", "12/13/2025", "Bill Broker", "--", "", "", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "WALGREENS", "--", "12/12/2025", "--", "--"],
  ["NAI Demo", "Sale", "", "Brian Client", "--", "--", "Office", "--", "4250 North Marine Drive", "--", "Chicago", "IL", "60614", "United States", "--", "--", "$1,000,000.00", "01/03/2026", "Bill Broker", "--", "Bridget Manager", "NAI Test", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Office Building", "12/12 Shared Deal", "--", "12/12/2025", "--", "--"],
  ["NAI Demo", "Sale", "", "Brian Client", "--", "--", "Office", "--", "4250 North Marine Drive", "--", "Chicago", "IL", "60624", "United States", "--", "--", "$100,000.00", "12/25/2025", "Bill Broker", "--", "Bridget Manager", "NAI Test", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Office Building", "12/16 Demo Deal", "--", "12/16/2025", "--", "--"],
  ["NAI Demo", "Sale", "", "--", "--", "--", "Office", "--", "--", "--", "--", "--", "--", "United States", "--", "--", "$0.00", "12/31/2025", "Bill Broker", "--", "", "", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Office Building", "12/18 Closed Deal", "--", "12/18/2025", "--", "--"],
  ["NAI Demo", "Sale", "", "Marcus Co", "--", "--", "Land", "--", "77 West Illinois Street", "--", "Chicago", "IL", "60654", "United States", "--", "--", "$100,000.00", "--", "Bill Broker", "--", "Bridget Manager", "NAI Test", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Office", "New B2B Deal", "--", "12/26/2025", "--", "--"],
  ["NAI Demo", "Sale", "", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "United States", "--", "--", "$0.00", "--", "Bill Broker", "--", "", "", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "ID 114593", "--", "01/02/2026", "--", "--"],
  ["NAI Demo", "Lease", "", "--", "--", "--", "Office", "--", "--", "--", "--", "--", "--", "United States", "--", "--", "$0.00", "01/29/2026", "Bill Broker", "--", "", "", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Office Building", "ID 114594", "--", "01/02/2026", "--", "--"],
  ["NAI Demo", "Sale", "", "--", "--", "--", "Office", "--", "--", "--", "--", "--", "--", "United States", "--", "--", "$0.00", "01/02/2026", "Bill Broker", "--", "", "", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Office Building", "Apartment Building January 2nd", "--", "01/02/2026", "--", "--"],
  ["NAI Demo", "Sale", "", "Brian C Client", "--", "--", "Office", "--", "891 Plaza Drive", "--", "Prospect Heights", "IL", "60070", "United States", "--", "--", "$100,000.00", "01/08/2026", "Bill Broker", "--", "Bridget Manager", "NAI Test", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Office Building", "Test", "--", "01/15/2025", "--", "--"],
  ["NAI Demo", "Sale", "", "Kintetsu", "--", "--", "Office", "--", "9311 Stevens Street", "--", "Darien", "IL", "60561", "United States", "--", "--", "$100,000.00", "--", "Bill Broker", "--", "Amy D. Gill, MICP, MRP", "NAI Test", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Office Building", "Special Task", "--", "03/24/2026", "--", "--"],
  ["NAI Demo", "Sale", "", "Kintetsu", "--", "--", "Office", "--", "1101 South Canal Street", "--", "Chicago", "IL", "60607", "United States", "--", "--", "$100,000.00", "--", "Bill Broker", "--", "Amy D. Gill, MICP, MRP", "NAI Test", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "--", "Office Building", "Collect initial info", "--", "05/04/2026", "--", "--"],
];

const SUMMARY_ROW = HEADERS.map((h) => {
  if (h === "Building Size (SF)") return "62,550";
  if (h === "Transaction Value") return "$10,800,000.00";
  return "";
});

// ─── Page ─────────────────────────────────────────────────────────────────────

function DataMiningReportPage() {
  return (
    <div className="container-fluid py-4 px-5" style={{ fontSize: 14 }}>
      <Link
        to="/app/reports"
        className="text-decoration-none d-inline-flex align-items-center gap-1 mb-3"
        style={{ fontSize: 14, fontWeight: 500 }}
      >
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 11 }} />
        Standard Reports
      </Link>

      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-bold mb-0">Data Mining Report</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-primary">Actions ▾</button>
          <button className="btn" style={{ background: "rgb(242,232,254)", color: "rgb(54,9,99)" }}>
            Save ▾
          </button>
        </div>
      </div>

      <div className="d-flex align-items-end flex-wrap gap-4 mb-4">
        <div className="d-flex flex-column gap-1">
          <label className="fw-semibold" style={{ fontSize: 13 }}>Name, Address or Identifier</label>
          <div className="position-relative">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="position-absolute text-muted"
              style={{ left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12 }}
            />
            <input type="text" className="form-control ps-4" style={{ minWidth: 200 }} />
          </div>
        </div>
        <div className="d-flex flex-column gap-1">
          <label className="fw-semibold" style={{ fontSize: 13 }}>Company</label>
          <select className="form-select" style={{ minWidth: 160 }} defaultValue="NAI Demo">
            <option>NAI Demo</option>
          </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label className="fw-semibold" style={{ fontSize: 13 }}>Deal Type</label>
          <select className="form-select" style={{ minWidth: 160 }} defaultValue="Any">
            <option>Any</option>
          </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label className="fw-semibold" style={{ fontSize: 13 }}>Property Type</label>
          <select className="form-select" style={{ minWidth: 160 }} defaultValue="Any">
            <option>Any</option>
          </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label className="fw-semibold" style={{ fontSize: 13 }}>Close Date</label>
          <div className="d-flex gap-2">
            <input type="text" className="form-control" placeholder="Start Date" style={{ minWidth: 110 }} />
            <input type="text" className="form-control" placeholder="End Date" style={{ minWidth: 110 }} />
          </div>
        </div>
        <button
          className="btn btn-link p-0 text-primary text-decoration-none fw-semibold"
          style={{ paddingBottom: 9 }}
        >
          Reset Filter
        </button>
      </div>

      <div className="border rounded overflow-auto">
        <table className="mb-0" style={{ borderCollapse: "collapse", width: "100%", minWidth: 2400 }}>
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="bg-white fw-semibold text-nowrap"
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid var(--bs-border-color)",
                    borderRight: "1px solid var(--bs-border-color)",
                    textAlign: "left",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  {h}
                  <FontAwesomeIcon icon={faArrowUpWideShort} className="text-muted ms-1" style={{ fontSize: 11 }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: "rgb(242,232,254)" }}>
              {SUMMARY_ROW.map((v, i) => (
                <td
                  key={i}
                  className="text-nowrap fw-bold"
                  style={{
                    padding: "8px 12px",
                    borderBottom: "2px solid var(--bs-border-color)",
                    borderRight: "1px solid var(--bs-border-color)",
                  }}
                >
                  {v}
                </td>
              ))}
            </tr>
            {ROWS.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="text-nowrap"
                    style={{
                      padding: "8px 12px",
                      borderBottom: "1px solid var(--bs-border-color)",
                      borderRight: "1px solid var(--bs-border-color)",
                    }}
                  >
                    {cell === "" ? "--" : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-muted mt-2" style={{ fontSize: 13 }}>Count: {ROWS.length}</div>
    </div>
  );
}
