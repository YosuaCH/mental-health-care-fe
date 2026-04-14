import { BACKEND_URL } from "../const/base_url.js";
import { getCsrfToken } from "../utils/csrf.js";

export const updateProfile = async (name, picture, hargaKonsultasi) => {
  const response = await fetch(`${BACKEND_URL}/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": getCsrfToken(),
    },
    credentials: "include",
    body: JSON.stringify({
      name: name,
      picture: picture,
      hargaKonsultasi: hargaKonsultasi,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal mengupdate profil");
  }

  return await response.json();
};
