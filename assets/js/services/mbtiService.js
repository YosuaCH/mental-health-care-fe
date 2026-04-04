import { BACKEND_URL } from "../const/base_url.js";
const MBTI_API_URL = `${BACKEND_URL}/mbti`;

const mbtiService = {
  async getMbtiDetail(code) {
    try {
      const response = await fetch(`${MBTI_API_URL}/${code}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Gagal mengambil data MBTI");

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("mbtiService Error:", error);
      throw error;
    }
  },
};
