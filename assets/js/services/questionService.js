import { BACKEND_URL } from "../const/base_url.js";
const API_BASE_URL = BACKEND_URL;

async function getAllQuestions() {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
}
