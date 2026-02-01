import { FiSearch, FiX } from "react-icons/fi";
import DataLoading from "../../../components/Loaders/DataLoading";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import useFiltration from "../../../Hooks/useFilteration";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { getMetalVariantUpdateHistory } from "../../../api/Admin/MetalApi";

const MetalVariantHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [pagination, setPagination] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [variantInfo, setVariantInfo] = useState({
    metalType: "",
    purityLabel: "",
  });

  const fetchHistoryData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getMetalVariantUpdateHistory(id, {
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
      });
      if (response.data.success) {
        setHistoryData(response.data.data.metalVariantHistory);
        setPagination(response.data.data.pagination);

        // Set variant info from the first record (if available)
        if (response.data.data.metalVariantHistory.length > 0) {
          const firstRecord = response.data.data.metalVariantHistory[0];
          setVariantInfo({
            metalType: firstRecord.metalVariant.metalType.name,
            purityLabel: firstRecord.purityLabel,
          });
        }
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchHistoryData();
    }
  }, [id, debouncedSearch, filters.page]);

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    fetchHistoryData(page);
  };

  return (
    <div className="">
      <div className="">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Metal Variant History</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 w-full gap-4">
          <p className="text-md font-semibold whitespace-nowrap">
            {variantInfo.metalType} {variantInfo.purityLabel}
          </p>
          <div className="flex flex-row items-center gap-2 w-full sm:w-auto mb-4 sm:mb-0">
            <div className="relative flex items-center w-full sm:max-w-[250px] min-w-0">
              <div className="absolute left-3 text-gray-400">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChangeHook}
                placeholder="Search..."
                autoComplete="off"
                autoFocus
                className="w-full py-2 pl-10 text-sm pr-10 text-gray-700 bg-white shadow-md rounded-full focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 truncate"
              />
              {filters.search && (
                <button
                  onClick={clearFilters}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="whitespace-nowrap w-auto rounded-full "
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-Lime">
            <TableRow>
              {["S.No.","Purity", "Unit Price/gm", "Updated By","Updated At" ].map(
                (field) => (
                  <TableHead
                    key={field}
                    className="text-black cursor-pointer text-center"
                  >
                    {field}
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-20 text-center">
                  <DataLoading />
                </TableCell>
              </TableRow>
            ) : historyData?.length > 0 ? (
              historyData.map((item, idx) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className='min-w-[100px]'>{idx + 1}.</TableCell>                 
                  <TableCell className='min-w-[160px]'>{item.metalVariant?.metalType?.name} - {item.purityLabel}</TableCell>
                  <TableCell className='min-w-[140px]'>₹{item.metalPriceInGram}</TableCell>
                  <TableCell className='min-w-[160px]'>{item.updatedBy.name}</TableCell>
                   <TableCell className='min-w-[140px]'>
                    {format(new Date(item.updatedAt), "dd MMM yyyy, hh:mm a")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-20 text-center">
                  <div className="flex justify-center items-center">
                    <span className="text-gray-500">No History Available</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-2 md:p-4 border-t">
        <PaginationComponent
          currentPage={Number(pagination.page) || 1}
          totalPages={pagination.totalPages || 1}
          totalCount={pagination.totalCount || 0}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MetalVariantHistory;
