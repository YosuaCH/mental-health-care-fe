(function () {
  const user = sessionStorage.getItem("user");
  const path = window.location.pathname;

  const protectedKeywords = ["dashboard", "mbti_book", "test_mbti", "chat"];
  const isProtected = protectedKeywords.some((keyword) =>
    path.includes(keyword),
  );

  if (isProtected && !user) {
    const hasOAuthParams =
      window.location.search.includes("code=") ||
      window.location.search.includes("auth=success");
    if (hasOAuthParams) {
      console.log("Guard: Menunggu sinkronisasi akun Google...");
      return;
    }
    console.log("Guard: Tidak ada sesi, mengalihkan ke login...");
    window.location.replace("login.html");
  }
})();
