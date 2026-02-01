import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";

const sampleData = Array.from({ length: 50 }, (_, i) => ({
  id: "#2371",
  name: "Aman Singh",
  number: "+91 9876543210",
  email: "user@gmail.com",
  jewelType: "Ring",
  metalType: "Gold",
  purity: "18kt",
  color: "Yellow",
}));

const CustomOrder = () => {
  const [data, setData] = useState(sampleData);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleEdit = (index) => {
    alert(`Edit item ${index + 1}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;

      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      } else if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("...");
        }
      }

      for (let i = start; i <= end; i++) {
        if (i > 0 && i <= totalPages) {
          pages.push(i);
        }
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const [allOpen, setAllOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedRange, setSelectedRange] = useState("Data Range");

  // These would typically come from your data/state management
  const filterOptions = ["All", "Option 1", "Option 2", "Option 3"];
  const rangeOptions = [
    "Last 7 days",
    "Last 30 days",
    "Last quarter",
    "Custom range",
  ];

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
    setAllOpen(false);
    // Here you would typically trigger your filter logic
    console.log("Filtering by:", option);
  };

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    setRangeOpen(false);
    console.log("Filtering by range:", range);
  };

  return (
    <div className=" w-full ">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Custom Orders</h2>
      </div>

      <div className="rounded-xl border ">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Enquiry Id",
                  "Customer Name",
                  "Number",
                  "Email",
                  "Jewellery Type",
                  "Metal Type",
                  "Purity",
                  "Color",
                ].map((header) => (
                  <TableHead
                    key={header}
                    className="whitespace-nowrap text-center"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={index} className="text-center">
                  <TableCell className="min-w-[100px]">{item.id}</TableCell>
                  <TableCell className="min-w-[100px]">{item.name}</TableCell>
                  <TableCell className="min-w-[80px]">{item.number}</TableCell>
                  <TableCell className="min-w-[80px]">{item.email}</TableCell>
                  <TableCell className="min-w-[120px]">
                    {item.jewelType}
                  </TableCell>
                  <TableCell className="min-w-[100px]">
                    ₹{item.metalType}
                  </TableCell>
                  <TableCell className="min-w-[80px]">{item.purity}</TableCell>
                  <TableCell className="min-w-[80px]">{item.color}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-2 md:p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-xs md:text-sm"
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="text-xs md:text-sm" />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                      className="text-xs md:text-sm"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-xs md:text-sm"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;
