import { BACKEND_URL } from "../const/base_url.js";
import { getCsrfToken } from "../utils/csrf.js";

export async function fetchUnreadCount(roomId, viewerName) {
  const url = `${BACKEND_URL}/api/v1/chat/unread/${roomId}?viewerName=${encodeURIComponent(viewerName)}`;
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw new Error("Gagal mengambil unread count");
  return response.json();
}

export async function markRoomAsRead(roomId, readerName) {
  const url = `${BACKEND_URL}/api/v1/chat/history/${roomId}/read?readerName=${encodeURIComponent(readerName)}`;
  const response = await fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: { "X-XSRF-TOKEN": getCsrfToken() },
  });
  if (!response.ok) throw new Error("Gagal menandai pesan sebagai terbaca");
}

export async function fetchChatHistory(roomId) {
  const url = `${BACKEND_URL}/api/v1/chat/history/${roomId}`;
  const response = await fetch(url, { method: "GET", credentials: "include" });
  if (!response.ok) throw new Error("Gagal memuat riwayat obrolan dari server");
  return response.json();
}

export async function fetchPatientsByDoctor(doctorId) {
  const url = `${BACKEND_URL}/api/v1/chat/patients/${doctorId}`;
  const response = await fetch(url, { method: "GET", credentials: "include" });
  if (!response.ok) throw new Error("Gagal mengambil data pasien dari server");
  return response.json();
}

export async function endChatSession(roomId) {
  const url = `${BACKEND_URL}/api/v1/chat/session/${roomId}`;
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: { "X-XSRF-TOKEN": getCsrfToken() },
  });
  if (!response.ok) throw new Error("Gagal mengakhiri sesi chat");
}
