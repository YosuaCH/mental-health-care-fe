import { BACKEND_URL } from "../const/base_url.js";
import { getCsrfToken } from "../utils/csrf.js";

const BASE_URL = `${BACKEND_URL}/payment`;

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

export const getPaymentInfo = async (patientId, noStr) => {
  const response = await fetch(
    `${BASE_URL}/info?patientId=${encodeURIComponent(patientId)}&noStr=${encodeURIComponent(noStr)}`,
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

export const processPaymentSimulation = async (patientId, noStr) => {
  const response = await fetch(
    `${BASE_URL}/simulate-success?patientId=${encodeURIComponent(patientId)}&noStr=${encodeURIComponent(noStr)}`,
    {
      method: "POST",
      credentials: "include",
      headers: { "X-XSRF-TOKEN": getCsrfToken() },
    },
  );
  if (!response.ok) {
    throw new Error("Gagal memverifikasi pembayaran");
  }
  return await response.json();
};
