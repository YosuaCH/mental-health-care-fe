const BASE_URL = "http://127.0.0.1:8080/api/v1/ai";

export const askGemini = async (message) => {
  try {
    const response = await fetch(
      `${BASE_URL}/chat?message=${encodeURIComponent(message)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    if (response.status === 401) {
      throw new Error("Unauthorized. Please log in again.");
    }
    if (!response.ok) {
      throw new Error("Gagal menghubungi AI");
    }

    return await response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Maaf, sepertinya saya sedang tidak bisa berpikir jernih. Bisa coba lagi nanti?";
  }
};
