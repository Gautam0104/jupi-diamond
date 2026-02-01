import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const initialStartDate = searchParams.get("startDate") || null;
  const initialEndDate = searchParams.get("endDate") || null;

  const [dateRange, setDateRange] = useState({
    startDate: initialStartDate ? new Date(initialStartDate) : null,
    endDate: initialEndDate ? new Date(initialEndDate) : null,
  });
  const [dateRangeLabel, setDateRangeLabel] = useState("July - December");

  const updateDateRange = (newRange) => {
    setDateRange(newRange);
    const params = new URLSearchParams(searchParams);
    
    if (newRange.startDate) {
      params.set("startDate", format(newRange.startDate, "yyyy-MM-dd"));
    } else {
      params.delete("startDate");
    }
    
    if (newRange.endDate) {
      params.set("endDate", format(newRange.endDate, "yyyy-MM-dd"));
    } else {
      params.delete("endDate");
    }
    
    navigate({ search: params.toString() }, { replace: true });
  };

  return (
    <DashboardContext.Provider
      value={{
        dateRange,
        setDateRange: updateDateRange,
        dateRangeLabel,
        setDateRangeLabel,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};