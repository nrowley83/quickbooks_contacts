import { createFileRoute } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCaretDown,
  faCircleExclamation,
  faEllipsisVertical,
} from "@fortawesome/pro-regular-svg-icons";
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

// ─── Page ─────────────────────────────────────────────────────────────────────

function DealsPipelinePage() {
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
        <Button variant="primary">Add Closed Deal</Button>
      </div>

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
