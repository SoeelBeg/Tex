import axios from "axios";

export async function getProductionData({ fnYear, month, type }) {
  try {
    const response = await axios.post(
      "http://devserver:54700/api/Production/GetProductionData",
      {
        fnYear: fnYear ?? null,
        month: month ?? null,
        type: type ?? null
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data?.success) {
      return response.data.data || [];
    }
    return [];
  } catch (err) {
    console.error("getProductionData ERROR:", err);
    return [];
  }
}
