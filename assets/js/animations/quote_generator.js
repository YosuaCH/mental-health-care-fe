function generateDailyQuote() {
  const quotes = [
    "Istirahat sebentar itu produktif. Kamu bukan robot.",
    "Tidak apa-apa untuk merasa tidak baik-baik saja.",
    "Kamu lebih kuat dari apa yang kamu pikirkan.",
    "Satu langkah kecil tetaplah sebuah kemajuan.",
    "Rawat dirimu sebagaimana kamu merawat orang yang kamu sayangi.",
    "Hari yang buruk bukan berarti kehidupan yang buruk.",
    "Bernapaslah. Kamu sudah melakukan yang terbaik hari ini.",
    "Kesehatan mentalmu adalah prioritas, bukan pilihan.",
    "Perasaanmu valid. Jangan takut untuk merasakannya.",
    "Tumbuh itu proses, bukan sulap. Nikmati perjalanannya.",
  ];

  const quoteElement = document.getElementById("quote-text");

  const randomIndex = Math.floor(Math.random() * quotes.length);
  if (quoteElement) {
    quoteElement.innerText = `"${quotes[randomIndex]}"`;
  }
}
