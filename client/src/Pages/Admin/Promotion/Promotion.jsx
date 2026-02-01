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
import { Switch } from "../../../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { FaRegEye } from "react-icons/fa6";

const sampleData = Array.from({ length: 50 }, (_, i) => ({
  id: "#2371",
  name: "Aman Singh",
  description: "+91 9876543210",
  startDate: "user@gmail.com",
  endDate: "Retailer",

  status: "true",
}));

const Promotion = () => {
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

  return (
    <div className=" w-full ">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Promotions</h2>
      </div>

      <div className="rounded-xl border ">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Id",
                  "Name",
                  "Description",
                  "Start Date",
                  "End Date",
                  "Details",
                  "Status",
                  "Actions",
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
                  <TableCell className="">{item.id}</TableCell>
                  <TableCell className="">{item.name}</TableCell>
                  <TableCell className="">{item.description}</TableCell>
                  <TableCell className="">{item.startDate}</TableCell>
                  <TableCell className="min-w-[120px]">
                    {item.endDate}
                  </TableCell>
                  <TableCell className=" flex  items-center justify-center">
                    <FaRegEye className="size-6"/>
                  </TableCell>
                  <TableCell className="">
                    <Switch checked={item.status} />
                  </TableCell>
                  <TableCell className=" flex items-center justify-center gap-2">
                  
                    <Button
                      variant="edit"
                      size="sm"
                      className="text-[10px] md:text-sm px-6 rounded-sm hover:shadow-md"
                    >
                      Edit
                    </Button>
                  </TableCell>
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

export default Promotion;
