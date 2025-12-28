function initHeroSection() {
  const cloudImages = [
    "assets/image/cloud (1).png",
    "assets/image/cloud (2).png",
    "assets/image/cloud (3).png",
    "assets/image/cloud (4).png",
    "assets/image/cloud (5).png",
    "assets/image/cloud (6).png",
    "assets/image/cloud (7).png",
    "assets/image/cloud (8).png",
    "assets/image/cloud (9).png",
    "assets/image/cloud (10).png",
    "assets/image/cloud (11).png",
    "assets/image/cloud (12).png",
    "assets/image/cloud (13).png",
    "assets/image/cloud (14).png",
    "assets/image/cloud (15).png",
    "assets/image/cloud (16).png",
    "assets/image/cloud.png",
  ];

  const container = document.getElementById("clouds-container");
  if (!container) {
    console.warn("clouds-container belum ada");
    return;
  }

  const numClouds = 10;
  const clouds = [];
  const MIN_DISTANCE = 140;

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const shuffledImages = shuffleArray(cloudImages);

  function isOverlapping(x, y, size) {
    for (let cloud of clouds) {
      const dx = x - cloud.x;
      const dy = y - cloud.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < (size + cloud.size) / 2 + MIN_DISTANCE) {
        return true;
      }
    }
    return false;
  }

  function generateNonOverlappingPosition(size) {
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * (window.innerWidth - size);
      const y = Math.random() * (window.innerHeight - size);
      if (!isOverlapping(x, y, size)) return { x, y };
    }
    return { x: 0, y: 0 };
  }

  for (let i = 0; i < numClouds; i++) {
    const cloud = document.createElement("img");
    cloud.className = "cloud-float";
    cloud.src = shuffledImages[i % shuffledImages.length];
    cloud.alt = "cloud";

    const size = Math.floor(Math.random() * 50) + 60;
    cloud.style.width = size + "px";

    const { x, y } = generateNonOverlappingPosition(size);
    cloud.style.left = x + "px";
    cloud.style.top = y + "px";

    cloud.style.animationDuration = Math.random() * 10 + 6 + "s";
    cloud.style.animationDelay = Math.random() * 5 + "s";

    clouds.push({ x, y, size });
    container.appendChild(cloud);
  }
}
