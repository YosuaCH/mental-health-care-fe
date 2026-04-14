/**
 * Membaca CSRF token dari cookie XSRF-TOKEN yang di-set oleh Spring Security.
 * Token ini harus dikirim kembali ke server melalui header X-XSRF-TOKEN
 * pada setiap request yang bersifat mutasi (POST, PUT, PATCH, DELETE).
 */
export function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}
