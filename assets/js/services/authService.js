const API_URL = "http://127.0.0.1:8080/auth";

export const login = async (email, password) => {
  return fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
};

export const registerClient = async (data) => {
  return fetch(`${API_URL}/register/client`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
};

export const registerPsikiater = async (data) => {
  return fetch(`${API_URL}/register/psikiater`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const getCurrentUser = async () => {
  return fetch(`${API_URL}/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};

export const logout = async () => {
  try {
    await fetch("http://127.0.0.1:8080/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout backend failed:", error);
  } finally {
    localStorage.removeItem("user");
    localStorage.removeItem("mbti_result");
    localStorage.clear();
    window.location.href = "login.html";
  }
};
