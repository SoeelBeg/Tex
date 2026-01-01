// src/api/dashboardApi.js

import api from "./apiInstance";
/**
 * Fetch production data (year / month / book / item etc.)
 * @param {Object} payload - API request body
 * @returns {Array} production data list
 */
export const getProductionData = async (payload) => {
  try {
    const res = await api.post(
      "/Production/GetProductionData", // relative path
      payload
    );

    // API returns { data: [...] }
    return res.data?.data || [];
  } catch (error) {
    console.error("getProductionData error:", error);
    return [];
  }
};


//----for tiles ----
export const getProductionTiles = async () => {
  try {
    const res = await api.get(
      "/Production/GetProductionTiles"
    );

    // API response:
    // { success, data: {...}, message }
    return res.data?.data || null;

  } catch (error) {
    console.error("getProductionTiles error:", error);
    return null;
  }
};
