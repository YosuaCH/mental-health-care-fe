(function () {
  const user = localStorage.getItem("user");
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
    console.log("Guard: Memverifikasi sesi...");

    setTimeout(() => {
      const checkUserAgain = localStorage.getItem("user");
      if (!checkUserAgain) {
        console.log("Guard: Sesi tidak valid, mengalihkan ke login...");
        window.location.replace("login.html");
      }
    }, 2000);
  }
})();
