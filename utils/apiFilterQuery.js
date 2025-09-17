// utils/apiQuery.js
let defaultQuery = {
  page: 1,
  limit: 20,
  search: "",
  startDate: "",
  endDate: "",
  status: "",
  userId: "",
  index: "no"
};

/**
 * Merge default query params + user overrides
 * @param {Object} overrides - user input params
 * @param {Boolean} defaultLast30Days - jika true, set startDate otomatis 30 hari terakhir kalau ga diisi
 */
export function buildQueryFilterParams(overrides = {}, defaultLast30Days = false) {
  console.log(defaultLast30Days);
  if( defaultLast30Days ) overrides.index = "yes" // kalau defaultLast30Days true, index otomatis "yes"
  const params = { ...defaultQuery, ...overrides };
  console.log(params);
  // if (defaultLast30Days && !params.startDate && !params.endDate) {
  //   const today = new Date();
  //   const end = today.toISOString().split("T")[0];
  //   const past30 = new Date(today); 
  //   past30.setDate(past30.getDate() - 30);
  //   const start = past30.toISOString().split("T")[0];

  //   params.startDate = start;
  //   params.endDate = end;
  // }

  return params;
}
