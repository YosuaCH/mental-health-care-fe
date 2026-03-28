const BASE_URL = "http://127.0.0.1:8080/payment";

export const getAllDoctors = async () => {
  const response = await fetch(`${BASE_URL}/all-doctors`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Gagal mengambil daftar dokter");
  }
  return await response.json();
};

export const getPaymentInfo = async (noStr) => {
  const response = await fetch(
    `${BASE_URL}/info?noStr=${encodeURIComponent(noStr)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error("Gagal mengambil data tagihan");
  }
  return await response.json();
};

export const processPaymentSimulation = async (noStr) => {
  const response = await fetch(
    `${BASE_URL}/simulate-success?noStr=${encodeURIComponent(noStr)}`,
    {
      method: "POST",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error("Gagal memverifikasi pembayaran");
  }
  return await response.json();
};
