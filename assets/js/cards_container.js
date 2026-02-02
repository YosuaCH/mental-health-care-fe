const questions = [
  {
    id: 1,
    question:
      "Habis minggu yang super capek, cara terbaik buat nge-charge energimu?",
    answers: [
      {
        id: 1,
        text: "Keluar nongkrong bareng teman-teman, cari suasana ramai!",
        image: "../assets/image/party_cloud.png",
        alt: "Party dengan teman",
        dimension: "E",
      },
      {
        id: 2,
        text: "Selimutan di kasur, nonton film, atau baca buku sendirian.",
        image: "../assets/image/lonely_cloud.png",
        alt: "Sendiri di alam",
        dimension: "I",
      },
    ],
  },
  {
    id: 2,
    question: "Di acara kumpul keluarga atau pesta, biasanya kamu...",
    answers: [
      {
        id: 1,
        text: "Keliling ngajak ngobrol banyak orang, bahkan yang baru kenal.",
        image: "../assets/image/social_cloud.png",
        alt: "Data dan fakta",
        dimension: "E",
      },
      {
        id: 2,
        text: "Tricky nih, lebih suka nempel sama satu orang yang udah dikenal aja.",
        image: "../assets/image/shy_cloud.png",
        alt: "Ide dan konsep",
        dimension: "I",
      },
    ],
  },
  {
    id: 3,
    question: "Kalau ada masalah, kamu tipe yang...",
    answers: [
      {
        id: 1,
        text: "Langsung cerita ke orang lain biar lega.",
        image: "../assets/image/storytelling_cloud.png",
        alt: "Logika",
        dimension: "E",
      },
      {
        id: 2,
        text: "Memendam dan memikirkannya sendiri dulu.",
        image: "../assets/image/gloomy_cloud.png",
        alt: "Perasaan",
        dimension: "I",
      },
    ],
  },

  {
    id: 4,
    question: "Kamu lebih suka orang yang kalau ngomong itu...",
    answers: [
      {
        id: 1,
        text: "To the point, jelas datanya, dan realistis.",
        image: "../assets/image/fact_cloud.png",
        alt: "Terencana",
        dimension: "S",
      },
      {
        id: 2,
        text: "Penuh ide unik, filosofis, dan membicarakan masa depan.",
        image: "../assets/image/imagination_cloud.png",
        alt: "Spontan",
        dimension: "N",
      },
    ],
  },
  {
    id: 5,
    question:
      "Kalau lagi melihat lukisan atau pemandangan, apa yang kamu perhatikan?",
    answers: [
      {
        id: 1,
        text: "Detail warnanya, bentuk objeknya, hal-hal yang nyata terlihat.",
        image: "../assets/image/detail_cloud.png",
        alt: "Terencana",
        dimension: "S",
      },
      {
        id: 2,
        text: "Makna di balik gambarnya atau perasaan apa yang muncul.",
        image: "../assets/image/cloud_meaning.png",
        alt: "Spontan",
        dimension: "N",
      },
    ],
  },
  {
    id: 6,
    question: "Kamu lebih percaya pada...",
    answers: [
      {
        id: 1,
        text: "Pengalaman masa lalu yang sudah terbukti.",
        image: "../assets/image/history_cloud.png",
        alt: "Terencana",
        dimension: "S",
      },
      {
        id: 2,
        text: "Firasat dan kemungkinan di masa depan.",
        image: "../assets/image/insting_cloud.png",
        alt: "Spontan",
        dimension: "N",
      },
    ],
  },

  {
    id: 7,
    question: "Temanmu curhat soal kesalahannya yang fatal. Respon pertamamu?",
    answers: [
      {
        id: 1,
        text: "Menganalisa kenapa itu terjadi dan kasih solusi logis biar gak ulang lagi.",
        image: "../assets/image/analysis_cloud.png",
        alt: "Terencana",
        dimension: "T",
      },
      {
        id: 2,
        text: "Kasih dukungan emosional dulu, validasi perasaannya, biar dia tenang.",
        image: "../assets/image/emotional_cloud.png",
        alt: "Spontan",
        dimension: "F",
      },
    ],
  },
  {
    id: 8,
    question: "Menurutmu, pujian itu lebih berharga kalau ditujukan untuk...",
    answers: [
      {
        id: 1,
        text: "Kecerdasan dan kompetensimu dalam menyelesaikan tugas.",
        image: "../assets/image/proud_cloud.png",
        alt: "Terencana",
        dimension: "T",
      },
      {
        id: 2,
        text: "Kebaikan hati dan kepedulianmu terhadap orang lain.",
        image: "../assets/image/kind_cloud.png",
        alt: "Spontan",
        dimension: "F",
      },
    ],
  },
  {
    id: 9,
    question: "Dalam perdebatan, yang paling penting buat kamu adalah...",
    answers: [
      {
        id: 1,
        text: "Kebenaran dan fakta, walaupun itu menyakitkan.",
        image: "../assets/image/justice_cloud.png",
        alt: "Terencana",
        dimension: "T",
      },
      {
        id: 2,
        text: "Menjaga perasaan orang lain agar tidak tersinggung.",
        image: "../assets/image/feeling_cloud.png",
        alt: "Spontan",
        dimension: "F",
      },
    ],
  },

  {
    id: 10,
    question: "Besok mau liburan! Gaya packing kamu gimana?",
    answers: [
      {
        id: 1,
        text: "Bikin list barang dulu, packing jauh-jauh hari biar rapi.",
        image: "../assets/image/listing_cloud.png",
        alt: "Terencana",
        dimension: "J",
      },
      {
        id: 2,
        text: " Masukin barang-barang pas menit terakhir, yang penting kebawa!",
        image: "../assets/image/justBring_cloud.png",
        alt: "Spontan",
        dimension: "P",
      },
    ],
  },
  {
    id: 11,
    question: "Kamu lebih suka suasana kerja/belajar yang...",
    answers: [
      {
        id: 1,
        text: "Terstruktur, ada deadline jelas, dan langkah-langkah pasti.",
        image: "../assets/image/structure_cloud.png",
        alt: "Terencana",
        dimension: "J",
      },
      {
        id: 2,
        text: "Fleksibel, bebas berekspresi, dan bisa berubah sewaktu-waktu.",
        image: "../assets/image/flex_cloud.png",
        alt: "Spontan",
        dimension: "P",
      },
    ],
  },
  {
    id: 12,
    question: "Kalau ada janji temu jam 7 malam, kamu biasanya...",
    answers: [
      {
        id: 1,
        text: "Datang jam 6.45. Pantang telat!",
        image: "../assets/image/onTime_cloud.png",
        alt: "Terencana",
        dimension: "J",
      },
      {
        id: 2,
        text: "Jam 7 baru jalan, atau ya... telat dikit gapapa lah ya.",
        image: "../assets/image/delayed_cloud.png",
        alt: "Spontan",
        dimension: "P",
      },
    ],
  },
];

const answers = {};

function generateCards() {
  const container = document.getElementById("cards-container");

  const totalQuestionsEl = document.querySelector(".total-questions-text");
  if (totalQuestionsEl) {
    totalQuestionsEl.textContent = questions.length;
  }

  questions.forEach((q) => {
    const card = document.createElement("div");
    card.className = `card-stack w-[450px] h-[480px] md:w-[1200px] md:h-[490px] rounded-2xl p-8 shadow-lg flex flex-col justify-start card`;
    card.style.backgroundColor = "#1B1B3A";

    card.innerHTML = `
      <h1 class="text-white text-center text-lg md:text-2xl font-semibold mb-2">
        Pertanyaan ${q.id}
      </h1>
      
      <div class="h-[80px] flex items-center justify-center mb-2 px-4">
        <h2 class="text-white text-lg md:text-2xl font-semibold text-center leading-tight">
          ${q.question}
        </h2>
      </div>

      <div class="flex flex-1 w-full gap-4 md:gap-12 items-start justify-center">
        ${q.answers
          .map(
            (answer, answerIndex) => `
          <div
            data-a="${answer.id}"
            data-q="${q.id}"
            data-dimension="${answer.dimension}"
            class="answer answer${q.id}${answer.id} flex-1 min-w-0 flex flex-col items-center gap-3 cursor-pointer group"
          >
            <img
              src="${answer.image}"
              alt="${answer.alt}"
              class="lazy-load w-full max-w-[400px] h-[200px] object-cover rounded-2xl"
            />

            <div class="grid grid-cols-1 place-items-center text-center w-full px-4 md:px-12 h-[100px]">
              
              <div class="col-start-1 row-start-1 w-full flex items-center justify-center">
                 <div class="choice-circle-not-chosen question-choice-circle is--not-chosen px-6 py-2 rounded-full border border-white text-white text-sm md:text-base font-medium transition-all duration-300 inline-block">
                    ${answer.text}
                 </div>
              </div>

              <div class="col-start-1 row-start-1 w-full flex items-center justify-center">
                 <div class="choice-circle-chosen question-choice-circle is--chosen is--${q.id}${String.fromCharCode(96 + answer.id)} px-6 py-2 rounded-full bg-yellow-500 border border-yellow-500 text-[#1B1B3A] text-sm md:text-base font-medium transition-all duration-300 opacity-1 inline-block">
                    ${answer.text}
                 </div>
              </div>

            </div>
          </div>
          ${
            answerIndex === 0
              ? '<div class="w-px h-52 bg-gradient-to-b from-transparent via-gray-500 to-transparent shrink-0"></div>'
              : ""
          }
        `,
          )
          .join("")}
      </div>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".answer").forEach((answer) => {
    answer.addEventListener("click", function () {
      selectAnswer(this);
    });
  });
}

function selectAnswer(element) {
  const question = element.getAttribute("data-q");
  const answerValue = element.getAttribute("data-a");
  const dimension = element.getAttribute("data-dimension");
  const allAnswers = document.querySelectorAll(`[data-q="${question}"]`);
  allAnswers.forEach((answer) => {
    answer.classList.remove("selected");
  });

  element.classList.add("selected");

  answers[question] = {
    answer: answerValue,
    dimension: dimension,
  };

  console.log(
    `Question ${question}, Answer ${answerValue} (${dimension}) selected`,
  );
  console.log("Current answers:", answers);
}

// GSAP Animate
function initAnimation() {
  gsap.registerPlugin(ScrollTrigger);
  const cards = gsap.utils.toArray(".card");

  if (cards.length === 0) {
    console.error("No cards found!");
    return;
  }

  const scrollDistance = (cards.length - 1) * window.innerHeight;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#stack-container",
      start: "top top",
      end: "+=" + scrollDistance,
      scrub: 1,
      pin: true,
    },
  });

  cards.forEach((card, index) => {
    if (index > 0) {
      gsap.set(card, {
        y: window.innerHeight,
        scale: 1,
        filter: "brightness(1)",
        opacity: 1,
      });
    } else {
      gsap.set(card, {
        y: 0,
        scale: 1,
        filter: "brightness(1)",
        opacity: 1,
      });
    }
  });

  cards.forEach((card, index) => {
    if (index < cards.length - 1) {
      tl.to(cards[index + 1], {
        y: 0,
        scale: 1,
        filter: "brightness(1)",
        duration: 1,
        ease: "none",
      });
      tl.to(
        card,
        {
          scale: 0.9,
          filter: "brightness(0.8)",
          duration: 1,
          ease: "none",
        },
        "<",
      );
    }
  });
}

//Calculate Results
function calculateMBTI() {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  Object.values(answers).forEach((answer) => {
    scores[answer.dimension]++;
  });

  const result =
    (scores.E > scores.I ? "E" : "I") +
    (scores.S > scores.N ? "S" : "N") +
    (scores.T > scores.F ? "T" : "F") +
    (scores.J > scores.P ? "J" : "P");

  return { result, scores };
}

function initLazyLoading() {
  const lazyImages = document.querySelectorAll("img.lazy-load");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy-load");
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
    });
  }
}

function finishTest(event) {
  event.preventDefault();

  if (Object.keys(answers).length < questions.length) {
    alert("Waduh, belum selesai! Jawab semua pertanyaan dulu ya 😊");
    return;
  }

  const hasil = calculateMBTI();

  console.log("Hasil MBTI:", hasil.result);

  localStorage.setItem("mbti_result", hasil.result);
  localStorage.setItem("mbti_scores", JSON.stringify(hasil.scores));

  window.location.href = "result_mbti.html";
}
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing cards...");
  generateCards();

  setTimeout(() => {
    initAnimation();
  }, 100);
});
