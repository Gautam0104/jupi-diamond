// export function paginate(query, totalCount = null) {
//   const page = Math.max(parseInt(query.page) || 1, 1);
//   const limit = Math.max(parseInt(query.limit) || 10, 1);
//   const skip = (page - 1) * limit;

//   const result = {
//     page,
//     limit,
//     skip,
//   };

//   if (totalCount !== null) {
//     result.totalCount = totalCount;
//     result.totalPages = Math.ceil(totalCount / limit);
//     result.currentPage = page;
//   }

//   return result;
// }

export function paginate(query, totalCount = null) {
  if (!query.page && !query.limit) {
    const result = {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      skip: 0,
    };

    if (totalCount !== null) {
      result.totalCount = totalCount;
      result.totalPages = 1;
      result.currentPage = 1;
    }

    return result;
  }

  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.max(parseInt(query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const result = {
    page,
    limit,
    skip,
  };

  if (totalCount !== null) {
    result.totalCount = totalCount;
    result.totalPages = Math.ceil(totalCount / limit);
    result.currentPage = page;
  }

  return result;
}
