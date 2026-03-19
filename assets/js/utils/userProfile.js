import { getCurrentUser } from "../services/authService.js";

export async function getUserData() {
  try {
    const res = await getCurrentUser();
    if (res.ok) {
      const result = await res.json();
      if (result.data) {
        localStorage.setItem("user", JSON.stringify(result.data));
        return result.data;
      }
    }
    console.warn("Sesi tidak valid, mengalihkan ke login...");
    localStorage.removeItem("user");
    window.location.href = "login.html";
    return null;
  } catch (err) {
    console.error("Server tidak dapat dijangkau:", err);
    localStorage.removeItem("user");

    window.location.href = "login.html";
    return null;
  }
}
