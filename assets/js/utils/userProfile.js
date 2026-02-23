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

    const localData = localStorage.getItem("user");
    if (localData) {
      return JSON.parse(localData);
    }

    window.location.href = "login.html";
    return null;
  } catch (err) {
    console.error("Gagal sinkronisasi profil:", err);
    const localData = localStorage.getItem("user");
    return localData ? JSON.parse(localData) : null;
  }
}
