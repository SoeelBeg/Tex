import api from "./apiInstance";

export const getStockData = async (payload) => {
  try {
    const res = await api.post(
      "/Stock/GetStockData",
      payload
    );
    return res.data?.data || [];
  } catch (e) {
    console.error("getStockData error", e);
    return [];
  }
};

export const getStockTiles = async () => {
  try {
    const res = await api.get(
      "/Stock/GetStockTiles"
    );
    return res.data?.data || null;
  } catch (e) {
    console.error("getStockTiles error", e);
    return null;
  }
};
