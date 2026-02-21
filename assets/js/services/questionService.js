const API_BASE_URL = "http://localhost:8080";

async function getAllQuestions() {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
}
