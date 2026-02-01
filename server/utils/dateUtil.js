//For Date range filteration apply only this function............................................
export const getTodayUTCDate = (startDate) => {
  const today = new Date(startDate);
  today.setUTCHours(0, 0, 0, 0);
  return today;
};
//For Date range filteration apply only this function............................................
export const getEndOfDayUTCDate = (endDate) => {
  const today = new Date(endDate);
  today.setUTCHours(23, 59, 59, 999);
  return today;
};

// Calculate 24 hours ago in UTC
export const get24HoursAgoUTC = () => {
  const now = new Date();
  now.setHours(now.getHours() - 24);
  return now.toISOString();
};
