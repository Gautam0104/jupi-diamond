import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { useCallback } from "react";

const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) => {
// console.log("PaginationComponent Rendered", { currentPage, totalPages, maxVisiblePages });

  
  const generatePageNumbers = useCallback(() => {
    const pages = [];
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    pages.push(1);

    let start = Math.max(2, currentPage - halfVisiblePages);
    let end = Math.min(totalPages - 1, currentPage + halfVisiblePages);

    if (currentPage <= halfVisiblePages + 1) {
      end = Math.min(maxVisiblePages - 1, totalPages - 1);
    } else if (currentPage >= totalPages - halfVisiblePages) {
      start = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`text-xs md:text-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          />
        </PaginationItem>

        {generatePageNumbers().map((page, index) =>
          page === "..." ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis className="text-xs md:text-sm" />
            </PaginationItem>
          ) : (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => handlePageClick(page)}
                className={`text-xs md:text-sm ${
                  page === currentPage
                    ? "font-semibold bg-[#fee698]"
                    : "cursor-pointer hover:bg-gray-100"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className={`text-xs md:text-sm ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;