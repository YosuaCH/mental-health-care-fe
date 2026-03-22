import { askGemini } from "../services/ai_chat_services.js";

let currentDoctorName = "AI Assistant";
let currentDoctorImg = "../assets/image/cloud (3).png";
let isCurrentContactAI = true;

let chatHistories = JSON.parse(sessionStorage.getItem("chatHistories")) || {};
let paidDoctors = JSON.parse(sessionStorage.getItem("paidDoctors")) || {};

document.addEventListener("DOMContentLoaded", function () {
  loadCurrentChat();
});

function scrollToBottom() {
  const container = document.getElementById("chat-container");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function saveMessageToHistory(html) {
  if (!chatHistories[currentDoctorName]) {
    chatHistories[currentDoctorName] = [];
  }
  chatHistories[currentDoctorName].push(html);
  sessionStorage.setItem("chatHistories", JSON.stringify(chatHistories));
}

function loadCurrentChat() {
  const container = document.getElementById("chat-container");
  const headerArea = container.previousElementSibling;
  const inputArea = container.nextElementSibling;

  if (!isCurrentContactAI && !paidDoctors[currentDoctorName]) {
    if (headerArea) headerArea.classList.add("hidden");
    if (inputArea) inputArea.classList.add("hidden");

    showPaymentUI(container);
    return;
  }

  if (headerArea) headerArea.classList.remove("hidden");
  if (inputArea) inputArea.classList.remove("hidden");

  container.innerHTML = `
    <div class="flex justify-center mb-6 mt-2">
      <span class="text-[10px] font-medium text-slate-400 bg-slate-200/50 px-2 py-1 rounded-full">Conversation started with ${currentDoctorName}</span>
    </div>
  `;

  if (chatHistories[currentDoctorName]) {
    chatHistories[currentDoctorName].forEach((msgHtml) => {
      container.insertAdjacentHTML("beforeend", msgHtml);
    });
  }
  scrollToBottom();
}

// Payment UI
function showPaymentUI(container) {
  let price = currentDoctorName.includes("Elena")
    ? "Rp300.000"
    : currentDoctorName.includes("Sarah")
      ? "Rp250.000"
      : "Rp200.000";

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
        <div class=" p-8 w-full max-w-md">
            <p class="text-sm text-slate-500 mb-6">Selesaikan pembayaran untuk terhubung dengan <b>${currentDoctorName}</b></p>

            <div class="border border-slate-200 p-6 rounded-2xl mb-6 bg-slate-50/50 shadow-sm">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Pembayaran+Klinik+Mental+Health+${currentDoctorName}" alt="QRIS" class="mx-auto w-40 h-40 mb-4 rounded-xl shadow-sm mix-blend-multiply"/>
                <p class="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Total Tagihan</p>
                <p class="text-3xl font-black text-slate-800">${price}</p>
            </div>

            <button onclick="simulatePaymentSuccess()" class="w-full py-4 bg-[#f2ca4b] hover:bg-[#e8ba35] text-slate-900 text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                Click
            </button>
        </div>
    </div>
  `;
}

window.simulatePaymentSuccess = function () {
  paidDoctors[currentDoctorName] = true;
  sessionStorage.setItem("paidDoctors", JSON.stringify(paidDoctors));

  const container = document.getElementById("chat-container");

  container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full animate-fade-in-up">
            <div class="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-800 mb-2">Pembayaran Berhasil!</h3>
            <p class="text-sm text-slate-500 animate-pulse">Menyiapkan ruang obrolan pribadi Anda...</p>
        </div>
    `;

  setTimeout(() => {
    loadCurrentChat();

    setTimeout(() => {
      showTypingIndicator();
      scrollToBottom();
      setTimeout(() => {
        removeTypingIndicator();
        displayDoctorMessage(
          `Halo, saya ${currentDoctorName}. Pembayaran Anda sudah saya terima. Apa yang ingin Anda ceritakan hari ini?`,
        );
      }, 1500);
    }, 500);
  }, 2000);
};

window.handleEnter = function (e) {
  if (e.key === "Enter") {
    window.sendMessage();
  }
};

window.sendMessage = async function () {
  const input = document.getElementById("message-input");
  const messageText = input.value.trim();
  const container = document.getElementById("chat-container");

  if (messageText === "") return;

  const userHtml = `
    <div class="flex items-end justify-end gap-2 animate-fade-in-up mb-4">
      <div class="max-w-[85%] flex flex-col items-end">
        <div class="bg-[#f2ca4b] p-3.5 rounded-2xl rounded-tr-none shadow-sm text-slate-900 text-sm leading-relaxed">
          <p>${escapeHtml(messageText)}</p>
        </div>
        <span class="text-[10px] text-slate-400 mt-1 mr-1">${getCurrentTime()}</span>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", userHtml);
  saveMessageToHistory(userHtml);
  input.value = "";
  scrollToBottom();

  if (isCurrentContactAI) {
    showTypingIndicator();
    scrollToBottom();

    try {
      const aiResponse = await askGemini(messageText);
      removeTypingIndicator();
      displayDoctorMessage(aiResponse);
    } catch (error) {
      removeTypingIndicator();
      displayDoctorMessage(
        "Maaf, koneksi ke asisten AI terputus. Pastikan backend sudah dijalankan.",
      );
    }
  } else {
    setTimeout(() => {
      showTypingIndicator();
      scrollToBottom();
      setTimeout(() => {
        removeTypingIndicator();
        displayDoctorMessage(
          "Terima kasih sudah bercerita. Saya sedang merangkum catatan untuk sesi ini.",
        );
      }, 1500);
    }, 500);
  }
};

function displayDoctorMessage(text) {
  const container = document.getElementById("chat-container");
  const doctorHtml = `
    <div class="flex items-end gap-2 max-w-[85%] animate-fade-in-up mb-4">
      <img src="${currentDoctorImg}" class="w-8 h-8 rounded-full object-cover shadow-sm mb-1 flex-shrink-0" />
      <div class="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm text-slate-800 text-sm leading-relaxed border border-slate-100">
        <p>${text}</p>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", doctorHtml);
  saveMessageToHistory(doctorHtml);
  scrollToBottom();
}

window.selectContact = function (name, img, isAi = false) {
  currentDoctorName = name;
  currentDoctorImg = img;
  isCurrentContactAI = isAi;

  document.getElementById("header-name").innerText = name;
  document.getElementById("header-avatar").src = img;
  const endBtn = document.getElementById("end-session-btn");

  if (isAi) {
    if (endBtn) endBtn.classList.add("hidden");
  } else {
    if (endBtn) {
      endBtn.classList.remove("hidden");
      endBtn.innerText = "End Session";
    }
  }

  loadCurrentChat();
  setActiveContact(name);
};

function setActiveContact(name) {
  const allContacts = document.querySelectorAll("[data-contact]");
  allContacts.forEach((contact) => {
    const contactName = contact.getAttribute("data-contact");
    const isAI = contactName === "AI Assistant";

    if (isAI) {
      contact.className =
        "p-3 rounded-2xl bg-gradient-to-br from-[#f2ca4b]/20 to-transparent border-2 border-[#f2ca4b]/40 cursor-pointer relative group transition-all";
    } else {
      contact.className =
        "flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm border-2 border-transparent hover:border-slate-100 transition-all cursor-pointer group";
    }
  });

  const activeContact = document.querySelector(`[data-contact="${name}"]`);
  if (activeContact) {
    const isAI = name === "AI Assistant";
    if (isAI) {
      activeContact.className =
        "p-3 rounded-2xl bg-gradient-to-br from-[#f2ca4b]/30 to-transparent border-2 border-[#f2ca4b] cursor-pointer relative group transition-all";
    } else {
      activeContact.className =
        "flex items-center gap-3 p-3 rounded-xl bg-slate-50 border-2 border-slate-300 shadow-sm cursor-pointer group";
    }
  }
}

function showTypingIndicator() {
  const container = document.getElementById("chat-container");
  const html = `
     <div id="typing-indicator" class="flex items-end gap-2 max-w-[85%] mb-4">
      <img src="${currentDoctorImg}" class="w-8 h-8 rounded-full object-cover shadow-sm mb-1 flex-shrink-0" />
      <div class="bg-white p-3 px-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
         <div class="flex gap-1">
           <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
           <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
           <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
         </div>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", html);
}

function removeTypingIndicator() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}
