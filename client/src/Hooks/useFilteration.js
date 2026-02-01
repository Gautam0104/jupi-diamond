import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

const useFiltration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialCreatedAtStart = searchParams.get("createAtStartDate");
  const initialSources = searchParams.getAll("leadSourceId") || [];
  const initialDashboardTab = searchParams.get("dashboardTab");
  const initialCreatedAtEnd = searchParams.get("createAtEndDate");
  const initialUser = searchParams.get("user") || "";
  const clientProjectId = searchParams.get("clientProjectId") || "";
  const initialDepartmentId = searchParams.get("departmentId") || "";
  const initialClientId = searchParams.get("clientId") || "";
  const milestoneId = searchParams.get("milestoneId") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialStartDate = searchParams.get("startDate") || "";
  const initialEndDate = searchParams.get("endDate") || "";
  const initialPeriod = searchParams.get("period") || "";
  const initialLeadTagPeriod = searchParams.get("leadTagPeriod") || "";
  const initialConversionRatePeriod =
    searchParams.get("conversionRatePeriod") || "";
  const initialTopClientSort = searchParams.get("topClientsSort") || "";

  const initialSalesIndustryPeriod =
    searchParams.get("salesIndustryPeriod") || "";
  const initialStaff = searchParams.get("allStaff") || "";
  const initialStage = searchParams.get("stage") || "";
  const initialStageIds = searchParams.getAll("stageId") || [];
  const initialDispositionIds = searchParams.getAll("dispositionId") || [];
  const initialLead = searchParams.get("lead") || "";
  const initialProject = searchParams.get("project") || "";
  const initialDisposition = searchParams.get("disposition") || "";
  const initialTag = searchParams.get("tag") || "";
  const initialTagIds = searchParams.getAll("tagId") || [];
  const initialPage = searchParams.get("page") || 1;
  const initialDeadLead = searchParams.get("isDeadLead") || "";
  const initialPageSize = searchParams.get("pageSize") || 10;
  const initialRoleId = searchParams.get("roleId") || "";
  const initialFinalDisposition =
    searchParams.getAll("finalDispositionId") || [];
  const initialPermissionId = searchParams.get("permissionId") || "";
  const initialClientStatus = searchParams.get("clientStatus") || "";
  const initialTaskPriority = searchParams.get("taskPriority") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialRequestStatus = searchParams.get("requestStatus") || "";
  const initialFacebookAccount = searchParams.get("accountId") || "";
  const initialFacebookCampaignId = searchParams.get("campaignId") || "";
  const initialFacebookAdSetId = searchParams.get("adSetId") || "";
  const initialFacebookAdId = searchParams.get("adId") || "";
  const initialMyLeads = searchParams.get("myLeads") === "true";

  const initialMinWeight = searchParams.get("minWeight") || "";
  const initialMaxWeight = searchParams.get("maxWeight") || "";
  const initialChargeType = searchParams.get("chargeType") || "";
  const initialChargeCategory = searchParams.get("chargeCategory") || "";
  const initialMetalVariantId = searchParams.get("metalVariantId") || "";
  const initialGemstoneVariantId = searchParams.get("gemstoneVariantId") || "";
  const initialMakingChargeCategorySetId =
    searchParams.get("makingChargeCategorySetId") || "";

  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";
  const initialIsActive = searchParams.get("isActive") || "";
  const initialIsFeatured = searchParams.get("isFeatured") || "";
  const initialIsNewArrival = searchParams.get("isNewArrival") || "";
  const initialKarigarId = searchParams.get("karigarId") || "";
  const initialProductSizeId = searchParams.get("productSizeId") || "";
  const initialGlobalDiscountId = searchParams.get("globalDiscountId") || "";
  const initialMakingChargeWeightRangeId =
    searchParams.get("makingChargeWeightRangeId") || "";
  const initialGlobalMakingChargesId =
    searchParams.get("globalMakingChargesId") || "";
  const initialSortBy = searchParams.get("sortBy") || "";
  const initialGridView = searchParams.get("gridView") || "";
  const initialSortOrder = searchParams.get("sortOrder") || "";
  const initialOccasionId = searchParams.get("occasionId") || "";
  const initialProductStyleId = searchParams.get("productStyleId") || "";
  const initialCollectionId = searchParams.get("collectionId") || "";
  const initialJewelryTypeId = searchParams.get("jewelryTypeId") || "";
  const initialstatus = searchParams.get("status") || "";
  const initialPaymentStatus = searchParams.get("paymentStatus") || "";
  const initialPaymentMethod = searchParams.get("paymentMethod") || "";
  const transactionId = searchParams.get("transactionId") || "";
  const initialMinAmount = searchParams.get("minAmount") || "";
  const initialMaxAmount = searchParams.get("maxAmount") || "";
  const initialCategorySlug = searchParams.get("categorySlug") || "";

  // Change all array parameter initializations to ensure they're arrays
  const initialMetalVariantSlug =
    searchParams.get("metalVariantSlug")?.split(",").filter(Boolean) || [];
  const initialGemstoneVariantSlug =
    searchParams.get("gemstoneVariantSlug")?.split(",").filter(Boolean) || [];
  const initialOccasionSlug =
    searchParams.get("occasionSlug")?.split(",").filter(Boolean) || [];
  const initialProductStyleSlug =
    searchParams.get("productStyleSlug")?.split(",").filter(Boolean) || [];
  const initialCollectionSlug =
    searchParams.get("collectionSlug")?.split(",").filter(Boolean) || [];
  const initialCaratWeight =
    searchParams.get("caratWeight")?.split(",").filter(Boolean) || [];
  // const initialJewelryTypeSlug =
  //   searchParams.get("jewelryTypeSlug")?.split(",").filter(Boolean) || [];

  const initialJewelryTypeSlug = useMemo(
    () => searchParams.get("jewelryTypeSlug")?.split(",").filter(Boolean) || [],
    [searchParams]
  );
  const initiallimit = searchParams.get("limit") || "";
  const initialShape = searchParams.get("shape") || "";
  const initialMetal = searchParams.get("metal") || "";
  const initialStyle = searchParams.get("style") || "";
  const initialOccasion = searchParams.get("occasion") || "";
  const initialCollection = searchParams.get("collection") || "";
  // const initialCaratWeight = searchParams.get("caratWeight") || "";
  const initialDate = searchParams.get("date") || "";
  const initialIsRedeemed = searchParams.get("isRedeemed") || "";
  const initialOrderNumber = searchParams.get("orderNumber") || "";
  const initialIsApproved = searchParams.get("isApproved") || "";
  const initialIsGift = searchParams.get("isGift") || "";
  const initialDailyWear = searchParams.get("dailyWear") || "";
  const initialMetalColorSlug = searchParams.get("metalColorSlug") || "";

  const [filters, setFilters] = useState({
    clientStatus: initialClientStatus,
    createdAtStart: initialCreatedAtStart,
    dashboardTab: initialDashboardTab,
    createdAtEnd: initialCreatedAtEnd,
    taskPriority: initialTaskPriority,
    category: initialCategory,
    requestStatus: initialRequestStatus,
    tagIds: initialTagIds,
    search: initialSearch,
    departmentId: initialDepartmentId,
    leadSourceIds: initialSources,
    isDeadLead: initialDeadLead,
    user: initialUser,
    taskStatus: initialStatus,
    clientProjectId: clientProjectId,
    clientId: initialClientId,
    finalDisposition: initialFinalDisposition,
    milestoneId: milestoneId,
    startDate: initialStartDate,
    endDate: initialEndDate,
    allStaff: initialStaff,
    stage: initialStage,
    stageIds: initialStageIds,
    lead: initialLead,
    project: initialProject,
    disposition: initialDisposition,
    dispositionIds: initialDispositionIds,
    tag: initialTag,
    page: initialPage,
    pageSize: initialPageSize,
    period: initialPeriod,
    leadTagPeriod: initialLeadTagPeriod,
    conversionRatePeriod: initialConversionRatePeriod,
    topClientsSort: initialTopClientSort,
    salesIndustryPeriod: initialSalesIndustryPeriod,
    roleId: initialRoleId,
    permissionId: initialPermissionId,
    finalDisposition: initialFinalDisposition,
    accountId: initialFacebookAccount,
    campaignId: initialFacebookCampaignId,
    adSetId: initialFacebookAdSetId,
    adId: initialFacebookAdId,
    myLeads: initialMyLeads,

    minWeight: initialMinWeight,
    maxWeight: initialMaxWeight,
    chargeType: initialChargeType,
    chargeCategory: initialChargeCategory,
    metalVariantId: initialMetalVariantId,
    gemstoneVariantId: initialGemstoneVariantId,
    makingChargeCategorySetId: initialMakingChargeCategorySetId,

    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    isActive: initialIsActive,
    isFeatured: initialIsFeatured,
    isNewArrival: initialIsNewArrival,
    karigarId: initialKarigarId,
    productSizeId: initialProductSizeId,
    globalDiscountId: initialGlobalDiscountId,
    makingChargeWeightRangeId: initialMakingChargeWeightRangeId,
    globalMakingChargesId: initialGlobalMakingChargesId,
    sortBy: initialSortBy,
    gridView: initialGridView,
    sortOrder: initialSortOrder,
    occasionId: initialOccasionId,
    productStyleId: initialProductStyleId,
    collectionId: initialCollectionId,
    jewelryTypeId: initialJewelryTypeId,
    status: initialstatus,
    paymentStatus: initialPaymentStatus,
    paymentMethod: initialPaymentMethod,
    transactionId: transactionId,
    minAmount: initialMinAmount,
    maxAmount: initialMaxAmount,
    metalVariantSlug: Array.isArray(initialMetalVariantSlug)
      ? initialMetalVariantSlug
      : [],
    gemstoneVariantSlug: Array.isArray(initialGemstoneVariantSlug)
      ? initialGemstoneVariantSlug
      : [],
    occasionSlug: Array.isArray(initialOccasionSlug) ? initialOccasionSlug : [],
    productStyleSlug: Array.isArray(initialProductStyleSlug)
      ? initialProductStyleSlug
      : [],
      caratWeight: Array.isArray(initialCaratWeight)
      ? initialCaratWeight
      : [],
    collectionSlug: Array.isArray(initialCollectionSlug)
      ? initialCollectionSlug
      : [],
    jewelryTypeSlug: Array.isArray(initialJewelryTypeSlug)
      ? initialJewelryTypeSlug
      : [],
    limit: initiallimit,

    shape: initialShape,
    metal: initialMetal,
    style: initialStyle,
    occasion: initialOccasion,
    collection: initialCollection,

    caratWeight: initialCaratWeight,
    categorySlug: initialCategorySlug,
    date: initialDate,
    isRedeemed: initialIsRedeemed,
    orderNumber: initialOrderNumber,
    isApproved: initialIsApproved,
    isGift: initialIsGift,
    dailyWear: initialDailyWear,
    metalColorSlug: initialMetalColorSlug,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  // console.log("current page = ", currentPage);
  // Update debounced search with a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filters.search]);

  const handlePaginationChange = (page, pageSize) => {
    setFilters((prev) => ({
      ...prev,
      page,
      pageSize,
    }));
  };

  useEffect(() => {
    const newFilters = {};
    // Ensure these are always arrays
    newFilters.gemstoneVariantSlug =
      searchParams.get("gemstoneVariantSlug")?.split(",").filter(Boolean) || [];
    newFilters.productStyleSlug =
      searchParams.get("productStyleSlug")?.split(",").filter(Boolean) || [];
    newFilters.metalVariantSlug =
      searchParams.get("metalVariantSlug")?.split(",").filter(Boolean) || [];
    newFilters.occasionSlug =
      searchParams.get("occasionSlug")?.split(",").filter(Boolean) || [];
    newFilters.collectionSlug =
      searchParams.get("collectionSlug")?.split(",").filter(Boolean) || [];
    newFilters.jewelryTypeSlug =
      searchParams.get("jewelryTypeSlug")?.split(",").filter(Boolean) || [];
    newFilters.caratWeight =
      Array.isArray(initialCaratWeight) ? initialCaratWeight : [];

    if (searchParams.get("metalColorSlug")) {
      newFilters.metalColorSlug =
        searchParams.get("metalColorSlug")?.split(",").filter(Boolean) || [];
    }

    if (searchParams.get("maxPrice")) {
      newFilters.maxPrice =
        searchParams.get("maxPrice")?.split(",").filter(Boolean) || [];
    }

    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, [location.search]);

  // Update URL query string when filters change

  useEffect(() => {
    // console.log("Filters Called === > ",filters);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.clientStatus) params.set("clientStatus", filters.clientStatus);
    if (filters.taskStatus) params.set("status", filters.taskStatus);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.period) params.set("period", filters.period);
    if (filters.departmentId) params.set("departmentId", filters.departmentId);
    if (filters.leadTagPeriod)
      params.set("leadTagPeriod", filters.leadTagPeriod);
    if (filters.salesIndustryPeriod)
      params.set("salesIndustryPeriod", filters.salesIndustryPeriod);
    if (filters.conversionRatePeriod)
      params.set("conversionRatePeriod", filters.conversionRatePeriod);
    if (filters.topClientsSort)
      params.set("topClientsSort", filters.topClientsSort);

    if (filters.allStaff) params.set("allStaff", filters.allStaff);
    if (filters.stage) params.set("stage", filters.stage);
    if (filters.milestoneId) params.set("milestoneId", filters.milestoneId);
    if (filters.lead) params.set("lead", filters.lead);
    if (filters.createdAtStart)
      params.set("createAtStartDate", filters.createdAtStart);
    if (filters.createdAtEnd)
      params.set("createAtEndDate", filters.createdAtEnd);
    if (filters.project) params.set("project", filters.project);
    if (filters.isDeadLead) params.set("isDeadLead", filters.isDeadLead);
    if (filters.disposition) params.set("disposition", filters.disposition);
    if (filters.dashboardTab) params.set("dashboardTab", filters.dashboardTab);
    if (filters.tag) params.set("tag", filters.tag);
    if (filters.taskPriority) params.set("taskPriority", filters.taskPriority);
    if (filters.category) params.set("category", filters.category);
    if (filters.requestStatus)
      params.set("requestStatus", filters.requestStatus);
    if (filters.clientProjectId)
      params.set("clientProjectId", filters.clientProjectId);
    if (filters.roleId) params.set("roleId", filters.roleId);
    if (filters.permissionId) params.set("permissionId", filters.permissionId);
    if (filters.user) params.set("user", filters.user);
    if (filters.accountId) params.set("accountId", filters.accountId);
    if (filters.campaignId) params.set("campaignId", filters.campaignId);
    if (filters.adSetId) params.set("adSetId", filters.adSetId);
    if (filters.adId) params.set("adId", filters.adId);
    if (filters.clientId) params.set("clientId", filters.clientId);
    if (filters.myLeads) params.set("myLeads", filters.myLeads);
    if (filters.minWeight) params.set("minWeight", filters.minWeight);
    if (filters.maxWeight) params.set("maxWeight", filters.maxWeight);
    if (filters.chargeType) params.set("chargeType", filters.chargeType);
    if (filters.chargeCategory)
      params.set("chargeCategory", filters.chargeCategory);
    if (filters.metalVariantId)
      params.set("metalVariantId", filters.metalVariantId);
    if (filters.gemstoneVariantId)
      params.set("gemstoneVariantId", filters.gemstoneVariantId);
    if (filters.makingChargeCategorySetId)
      params.set(
        "makingChargeCategorySetId",
        filters.makingChargeCategorySetId
      );

    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.isActive) params.set("isActive", filters.isActive);
    if (filters.isFeatured) params.set("isFeatured", filters.isFeatured);
    if (filters.isNewArrival) params.set("isNewArrival", filters.isNewArrival);
    if (filters.karigarId) params.set("karigarId", filters.karigarId);
    if (filters.productSizeId)
      params.set("productSizeId", filters.productSizeId);
    if (filters.globalDiscountId)
      params.set("globalDiscountId", filters.globalDiscountId);
    if (filters.makingChargeWeightRangeId)
      params.set(
        "makingChargeWeightRangeId",
        filters.makingChargeWeightRangeId
      );
    if (filters.globalMakingChargesId)
      params.set("globalMakingChargesId", filters.globalMakingChargesId);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.gridView) params.set("gridView", filters.gridView);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters.occasionId) params.set("occasionId", filters.occasionId);
    if (filters.productStyleId)
      params.set("productStyleId", filters.productStyleId);
    if (filters.collectionId) params.set("collectionId", filters.collectionId);
    // if (filters.jewelryTypeId)
    //   params.set("jewelryTypeId", filters.jewelryTypeId);

    if (filters.jewelryTypeSlug?.length > 0) {
      params.set("jewelryTypeSlug", filters.jewelryTypeSlug.join(","));
    } else {
      params.delete("jewelryTypeSlug");
    }
    if (filters.status) params.set("status", filters.status);
    if (filters.paymentStatus)
      params.set("paymentStatus", filters.paymentStatus);
    if (filters.paymentMethod)
      params.set("paymentMethod", filters.paymentMethod);
    if (filters.transactionId)
      params.set("transactionId", filters.transactionId);
    if (filters.minAmount) params.set("minAmount", filters.minAmount);
    if (filters.maxAmount) params.set("maxAmount", filters.maxAmount);
    if (filters.metalVariantSlug)
      params.set("metalVariantSlug", filters.metalVariantSlug);
    if (filters.gemstoneVariantSlug)
      params.set("gemstoneVariantSlug", filters.gemstoneVariantSlug);
    if (filters.occasionSlug) params.set("occasionSlug", filters.occasionSlug);
    if (filters.productStyleSlug)
      params.set("productStyleSlug", filters.productStyleSlug);
    if (filters.collectionSlug)
      params.set("collectionSlug", filters.collectionSlug);
    if (filters.jewelryTypeSlug)
      params.set("jewelryTypeSlug", filters.jewelryTypeSlug);
    if (filters.limit && filters.limit !== "")
      params.set("limit", filters.limit);
    if (filters.shape) params.set("shape", filters.shape);
    if (filters.metal) params.set("metal", filters.metal);
    if (filters.style) params.set("style", filters.style);
    if (filters.occasion) params.set("occasion", filters.occasion);
    if (filters.collection) params.set("collection", filters.collection);

    if (filters.caratWeight) params.set("caratWeight", filters.caratWeight);
    if (filters.categorySlug) params.set("categorySlug", filters.categorySlug);
    if (filters.date) params.set("date", filters.date);
    if (filters.isRedeemed) params.set("isRedeemed", filters.isRedeemed);
    if (filters.orderNumber) params.set("orderNumber", filters.orderNumber);
    if (filters.isApproved) params.set("isApproved", filters.isApproved);
    if (filters.isGift) params.set("isGift", filters.isGift);
    if (filters.dailyWear) params.set("dailyWear", filters.dailyWear);
    if (filters.metalColorSlug)
      params.set("metalColorSlug", filters.metalColorSlug);

    // For Multilpe Selects
    const arrayParams = [
      "metalVariantSlug",
      "gemstoneVariantSlug",
      "occasionSlug",
      "productStyleSlug",
      "caratWeight",
      "collectionSlug",
      "jewelryTypeSlug",
    ];

    arrayParams.forEach((param) => {
      const value = filters[param];
      if (Array.isArray(value) && value.length > 0) {
        // Delete any existing parameter with [] suffix first
        params.delete(param);
        params.delete(`${param}[]`);

        // Add as comma-separated string without [] suffix
        const joinedValue = value.filter(Boolean).join(",");
        if (joinedValue) {
          params.set(param, joinedValue);
        }
      } else {
        params.delete(param);
        params.delete(`${param}[]`);
      }
    });

    if (filters.dispositionIds && filters.dispositionIds.length > 0) {
      // Clear any existing dispositionId parameters
      params.delete("dispositionId");
      // Add each dispositionId as a separate parameter
      filters.dispositionIds.forEach((id) => {
        params.append("dispositionId", id);
      });
    }
    if (filters.finalDisposition && filters.finalDisposition.length > 0) {
      // Clear any existing dispositionId parameters
      params.delete("finalDispositionId");
      // Add each dispositionId as a separate parameter
      filters.finalDisposition.forEach((id) => {
        params.append("finalDispositionId", id);
      });
    }
    if (filters.stageIds && filters.stageIds.length > 0) {
      // Clear any existing stageId parameters
      params.delete("stageId");
      // Add each stageId as a separate parameter
      filters.stageIds.forEach((id) => {
        params.append("stageId", id);
      });
    }
    if (filters.leadSourceIds && filters.leadSourceIds.length > 0) {
      // Clear any existing leadSourceId parameters
      params.delete("leadSourceId");
      // Add each leadSourceId as a separate parameter
      filters.leadSourceIds.forEach((id) => {
        params.append("leadSourceId", id);
      });
    }
    if (filters.tagIds && filters.tagIds.length > 0) {
      // Clear any existing leadSourceId parameters
      params.delete("tagId");
      // Add each leadSourceId as a separate parameter
      filters.tagIds.forEach((id) => {
        params.append("tagId", id);
      });
    }
    if (filters.page) params.set("page", filters.page);
    if (filters.pageSize) params.set("pageSize", filters.pageSize);

    // Replace current URL with new query string
    // navigate({ search: params.toString() }, { replace: true });

    const queryString = Array.from(params.entries())
      .map(([key, value]) => {
        // Don't encode commas for array parameters
        if (arrayParams.includes(key)) {
          return `${key}=${value}`;
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join("&");
    navigate({ search: queryString }, { replace: true });
  }, [filters, debouncedSearch, navigate]);

  const handleFilterChangeHook = (event) => {
    let { name, value } = event.target;
    // console.log("in filter", name, value);
    if (value === "nullOptions") value = "";
    if (name === "myLeads") {
      value = value === "true" || value === true;
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterMultipleChangeHook = (event) => {
    const { name, value, checked, type } = event.target;

    // Handle checkbox selections (multiple values)
    if (type === "checkbox") {
      setFilters((prevFilters) => {
        const currentValues = Array.isArray(prevFilters[name])
          ? prevFilters[name]
          : [];

        if (checked) {
          return {
            ...prevFilters,
            [name]: [...currentValues, value],
          };
        } else {
          return {
            ...prevFilters,
            [name]: currentValues.filter((item) => item !== value),
          };
        }
      });
    }
    // Handle other input types (single values)
    else {
      let processedValue = value;

      if (value === "nullOptions") processedValue = "";
      if (name === "myLeads") {
        processedValue = value === "true" || value === true;
      }
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: processedValue,
      }));
    }
  };

  const handleMultipleStageIds = (selectedIds) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      stageIds: selectedIds,
    }));
  };

  const handleMultipleDispositionIds = (selectedIds) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      dispositionIds: selectedIds,
    }));
  };
  const handleMultipleFinalDispositionIds = (selectedIds) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      finalDisposition: selectedIds,
    }));
  };
  const handleMultipleLeadSourceIds = (selectedIds) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      leadSourceIds: selectedIds,
    }));
  };
  const handleMultipleTagIds = (selectedIds) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      tagIds: selectedIds,
    }));
  };

  const clearFilters = (page = "") => {
    setFilters({
      search: "",
      category: "",
      clientStatus: "",
      taskStatus: "",
      startDate: "",
      endDate: "",
      period: "",
      department: "",
      allStaff: "",
      stage: page === "dead" ? filters.stage : "",
      lead: "",
      project: "",
      disposition: "",
      clientProjectId: "",
      departmentId: "",
      clientId: "",
      milestoneId: "",
      types: "",
      tag: "",
      page: 1,
      createdAtStart: "",
      createdAtEnd: "",
      taskPriority: "",
      dashboardTab: "",
      requestStatus: "",
      pageSize: 10,
      roleId: "",
      permissionId: "",
      isDeadLead: "",
      finalDisposition: [],
      stageIds: [],
      user: "",
      accountId: "",
      campaignId: "",
      leadSourceIds: [],
      adSetId: "",
      adId: "",
      dispositionIds: [],
      myLeads: "",

      minWeight: "",
      maxWeight: "",
      chargeType: "",
      chargeCategory: "",
      metalVariantId: "",
      gemstoneVariantId: "",
      makingChargeCategorySetId: "",

      minPrice: "",
      maxPrice: "",
      isActive: "",
      isFeatured: "",
      isNewArrival: "",
      karigarId: "",
      productSizeId: "",
      globalDiscountId: "",
      makingChargeWeightRangeId: "",
      globalMakingChargesId: "",
      sortBy: "",
      gridView: "",
      sortOrder: "",
      occasionId: "",
      productStyleId: "",
      collectionId: "",
      jewelryTypeId: "",
      status: "",
      paymentStatus: "",
      paymentMethod: "",
      transactionId: "",
      minAmount: "",
      maxAmount: "",

      metalVariantSlug: [],
      gemstoneVariantSlug: [],
      occasionSlug: [],
      productStyleSlug: [],
      caratWeight: [],
      collectionSlug: [],
      jewelryTypeSlug: [],
      limit: "",

      shape: "",
      metal: "",
      style: "",
      occasion: "",
      collection: "",
      caratWeight: "",

      categorySlug: "",
      date: "",
      isRedeemed: "",
      orderNumber: "",
      isApproved: "",
      isGift: "",
      dailyWear: "",
      metalColorSlug: "",
    });
  };

  return {
    filters,
    debouncedSearch,
    handleFilterChangeHook,
    handleFilterMultipleChangeHook,
    handleMultipleStageIds,
    handlePaginationChange,
    handleMultipleDispositionIds,
    handleMultipleFinalDispositionIds,
    handleMultipleLeadSourceIds,
    handleMultipleTagIds,
    clearFilters,
  };
};
export default useFiltration;
