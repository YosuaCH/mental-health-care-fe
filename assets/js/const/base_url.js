export const DICEBEAR_BASE_URL = "https://api.dicebear.com/9.x/avataaars/svg";

const hostname = window.location.hostname;
const isLocal = hostname === '127.0.0.1' || hostname === 'localhost' || hostname.startsWith('192.168.');

export const FRONTEND_URL = isLocal ? `http://${hostname}:5500` : "https://your-production-app.com";
export const BACKEND_URL = isLocal ? `http://${hostname}:8080` : "https://your-production-api.com";
