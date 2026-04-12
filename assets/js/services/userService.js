import { BACKEND_URL } from "../const/base_url.js";

export const updateProfile = async (name, picture) => {
  const response = await fetch(`${BACKEND_URL}/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: name,
      picture: picture,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal mengupdate profil");
  }

  return await response.json();
};
