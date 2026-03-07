const API_URL = "http://127.0.0.1:8080/api";
export const fetchAllEbooks = async () => {
  try {
    const response = await fetch(`${API_URL}/ebooks`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Gagal mengambil data buku dari backend:", error);
    return [];
  }
};
