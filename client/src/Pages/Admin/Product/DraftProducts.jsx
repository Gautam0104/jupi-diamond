import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { Input } from "../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreVertical, Search, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../../../components/ui/badge";

const DRAFT_KEY = "product_drafts";

const DraftProducts = () => {
  const [drafts, setDrafts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDrafts, setSelectedDrafts] = useState([]);
  const navigate = useNavigate();
  const rowsPerPage = 10;

  // Load drafts from localStorage
  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem(DRAFT_KEY)) || [];
    setDrafts(savedDrafts);
  }, []);

  // Filter drafts based on search term
  const filteredDrafts = drafts.filter((draft) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      draft.id.toLowerCase().includes(searchLower) ||
      (draft.data.title &&
        draft.data.title.toLowerCase().includes(searchLower)) ||
      draft.data.description?.toLowerCase().includes(searchLower) ||
      draft.data.jewelleryType?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredDrafts.length / rowsPerPage);
  const paginatedDrafts = filteredDrafts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleEditDraft = (draftId) => {
    navigate(`/admin/product/add-product?editDraft=${draftId}`);
  };

  const handleDeleteDraft = (draftId) => {
    const updatedDrafts = drafts.filter((draft) => draft.id !== draftId);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
    toast.success("Draft deleted successfully");
  };

  const handleBulkDelete = () => {
    if (selectedDrafts.length === 0) {
      toast.warning("No drafts selected");
      return;
    }

    const updatedDrafts = drafts.filter(
      (draft) => !selectedDrafts.includes(draft.id)
    );
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
    setSelectedDrafts([]);
    toast.success(`${selectedDrafts.length} draft(s) deleted successfully`);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDrafts(paginatedDrafts.map((draft) => draft.id));
    } else {
      setSelectedDrafts([]);
    }
  };

  const handleSelectDraft = (draftId, checked) => {
    if (checked) {
      setSelectedDrafts([...selectedDrafts, draftId]);
    } else {
      setSelectedDrafts(selectedDrafts.filter((id) => id !== draftId));
    }
  };

  const getStatusBadge = (draft) => {
    const variantCount = draft.data.productVariantData?.length || 0;
    const hasImages = draft.data.productVariantData?.some(
      (variant) => variant.imagePreviews?.length > 0
    );

    if (variantCount === 0) return <Badge variant="destructive">Empty</Badge>;
    if (!hasImages) return <Badge variant="warning">No Images</Badge>;
    if (!draft.data.title) return <Badge variant="warning">No Title</Badge>;
    return <Badge variant="success">Complete</Badge>;
  };

  return (
    <div className="w-full ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Product Drafts</h2>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {[
                "S.No.",
                "ID",
                "Title",
                "Variants",
                "Status",
                "Last Updated",
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
            {paginatedDrafts.length > 0 ? (
              paginatedDrafts.map((draft) => (
                <TableRow key={draft.id} className="hover:bg-gray-50 text-center">
                  <TableCell >
                    {drafts.indexOf(draft) +
                      1 +
                      (currentPage - 1) * rowsPerPage}.
                  </TableCell>
                  <TableCell className="font-medium">
                    {draft.id.slice(-6)}
                  </TableCell>
                  <TableCell className='min-w-[140px]'>
                    <div className="font-medium">
                      {draft.data.title || "Untitled Draft"}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {draft.data.description?.replace(/<[^>]*>/g, "") ||
                        "No description"}
                    </div>
                  </TableCell>

                  <TableCell className='min-w-[140px]'>
                    {draft.data.productVariantData?.length || 0} variant(s)
                  </TableCell>
                  <TableCell>{getStatusBadge(draft)}</TableCell>
                  <TableCell>
                      {new Date(draft.updatedAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditDraft(draft.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteDraft(draft.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {searchTerm ? (
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-gray-400" />
                      <p className="font-medium">No drafts match your search</p>
                      <p className="text-sm text-gray-500">
                        Try adjusting your search term
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <p className="font-medium">No drafts found</p>
                      <p className="text-sm text-gray-500">
                        Start creating a new product to see drafts appear here
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {paginatedDrafts.length > 0 && (
          <div className="border-t px-4 py-3 flex items-center justify-between">
            <Pagination className="m-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
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
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftProducts;
