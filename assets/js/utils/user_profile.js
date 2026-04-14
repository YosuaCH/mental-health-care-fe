import { getCurrentUser } from "../services/auth_service.js";

export async function getUserData() {
  const cachedUser = sessionStorage.getItem("user");
  if (cachedUser) {
    const userData = JSON.parse(cachedUser);
    getCurrentUser()
      .then((res) => {
        if (!res.ok) {
          console.warn("Sesi background tidak valid");
          sessionStorage.removeItem("user");
        }
      })
      .catch(() => {});

    return userData;
  }

  try {
    const res = await getCurrentUser();
    if (res.ok && res) {
      const result = await res.json();
      if (result.data) {
        sessionStorage.setItem("user", JSON.stringify(result.data));
        return result.data;
      }
    }
    console.warn("Sesi tidak valid, mengalihkan ke login...");
    sessionStorage.removeItem("user");
    window.location.href = "login.html";
    return null;
  } catch (err) {
    console.error("Server tidak dapat dijangkau:", err);
    sessionStorage.removeItem("user");

    window.location.href = "login.html";
    return null;
  }
}
