import { askGemini } from "../services/ai_chat_services.js";
import { getUserData } from "../utils/userProfile.js";
import {
  getAllDoctors,
  getPaymentInfo,
  processPaymentSimulation,
} from "../services/payment_services.js";
import { BACKEND_URL, DICEBEAR_BASE_URL } from "../const/base_url.js";
import {
  fetchUnreadCount,
  markRoomAsRead,
  fetchChatHistory,
  fetchPatientsByDoctor,
  endChatSession,
} from "../services/chat_services.js";

let currentDoctorName = "AI Assistant";
let currentDoctorImg = "../assets/image/cloud (3).png";
let currentDoctorNoStr = "";
let isCurrentContactAI = true;

let currentUser = null;
let stompClient = null;
let currentRoomId = null;
let globalStompClient = null;

getUserData().then((data) => {
  currentUser = data;
  if (currentUser) {
    setTimeout(() => connectGlobalNotification(), 1000);
  }
});

let chatHistories = JSON.parse(sessionStorage.getItem("chatHistories")) || {};
let paidDoctors = JSON.parse(sessionStorage.getItem("paidDoctors")) || {};

document.addEventListener("DOMContentLoaded", function () {
  loadCurrentChat();

  const endBtn = document.getElementById("end-session-btn");
  if (endBtn) {
    endBtn.onclick = function () {
      showEndSessionModal();
    };
  }
});

//end session dialog
function showEndSessionModal() {
  const mainChatWrapper =
    document.getElementById("chat-container").parentElement;
  mainChatWrapper.classList.add("relative");

  if (document.getElementById("custom-modal-overlay")) return;

  const modalHtml = `
    <div id="custom-modal-overlay" class="absolute top-16 bottom-0 left-0 right-0 z-[100] flex justify-center items-start pt-10 p-6 bg-slate-900/30 backdrop-blur-sm animate-fade-in rounded-b-2xl">
        <div class="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 p-6 scale-up-center">
            <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>
            
            <h3 class="text-lg font-bold text-slate-900 text-center mb-2">Akhiri Sesi?</h3>
            <p class="text-sm text-slate-500 text-center mb-6">
                Sesi dengan <b>${currentDoctorName}</b> akan diakhiri dan riwayat pesan akan dihapus secara permanen.
            </p>
            
            <div class="flex flex-col gap-2">
                <button onclick="confirmEndSession()" class="w-full py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
                    Ya, Akhiri Sesi
                </button>
                <button onclick="closeCustomModal()" class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all">
                    Batalkan
                </button>
            </div>
        </div>
    </div>
  `;

  mainChatWrapper.insertAdjacentHTML("beforeend", modalHtml);
}

async function loadDoctorsFromServer() {
  const listContainer = document.getElementById("doctor-list");
  if (!listContainer) return;

  try {
    const doctors = await getAllDoctors();
    listContainer.innerHTML = "";

    let hasVisibleDoctors = false;

    for (const doc of doctors) {
      if (!doc.hargaKonsultasi || doc.hargaKonsultasi === 0) {
        continue;
      }

      hasVisibleDoctors = true;

      const avatarUrl = doc.picture
        ? doc.picture
        : `${DICEBEAR_BASE_URL}?seed=${encodeURIComponent(doc.namaLengkap)}`;

      let unreadCount = 0;
      if (currentUser && currentUser.id) {
        try {
          const validName = currentUser.namaLengkap || currentUser.username || currentUser.email || "User";
          const rId = `room_${currentUser.id}_${doc.noStr}`;
          unreadCount = await fetchUnreadCount(rId, validName);
        } catch (e) {}
      }

      const badgeHtml = `<div id="badge-${doc.noStr}" class="absolute -top-1 -right-1 z-10 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm ${unreadCount > 0 ? "" : "hidden"}">${unreadCount}</div>`;

      const html = `
        <div data-contact="${doc.namaLengkap}"
             onclick="selectContact('${doc.namaLengkap}', '${avatarUrl}', false, '${doc.noStr}')"
             class="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm border-2 border-transparent hover:border-slate-100 transition-all cursor-pointer group">
            <div class="relative text-left">
                <img src="${avatarUrl}" class="w-12 h-12 rounded-full object-cover" />
                <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                ${badgeHtml}
            </div>
            <div class="flex-1 min-w-0 text-left">
                <div class="flex justify-between items-baseline">
                    <h4 class="font-semibold text-slate-900 text-sm truncate">${doc.namaLengkap}</h4>
                    <span class="text-[10px] font-medium text-slate-500">Rp${doc.hargaKonsultasi.toLocaleString("id-ID")}</span>
                </div>
            </div>
        </div>
      `;
      listContainer.insertAdjacentHTML("beforeend", html);
    }

    if (!hasVisibleDoctors) {
      listContainer.innerHTML = `<p class="text-xs text-slate-400 p-4 text-center">Belum ada psikiater yang tersedia saat ini.</p>`;
    }
  } catch (error) {
    console.error("Error:", error);
    listContainer.innerHTML = `<p class="text-[10px] text-red-400 p-2 text-center">Gagal terhubung ke server.</p>`;
  }
}

function scrollToBottom() {
  const container = document.getElementById("chat-container");
  if (container) container.scrollTop = container.scrollHeight;
}

function connectWebSocket(roomId) {
  if (stompClient && stompClient.connected) {
    if (stompClient.roomId === roomId) return;
    stompClient.disconnect();
  }
  const socket = new SockJS(`${BACKEND_URL}/ws`);
  stompClient = Stomp.over(socket);
  stompClient.roomId = roomId;
  stompClient.connect({}, function (frame) {
    stompClient.subscribe("/topic/room/" + roomId, function (messageOutput) {
      //Buat cegah chat nyasar ke room lain
      if (currentRoomId !== roomId) return;

      const message = JSON.parse(messageOutput.body);
      if (currentUser) {
        const validName = currentUser.namaLengkap || currentUser.username || currentUser.email || "User";
        if (message.senderName !== validName) {
          displayDoctorMessage(message.content, message.timestamp);
        }
      }
    });
  });
}

function connectGlobalNotification() {
  if (globalStompClient && globalStompClient.connected) return;
  const socket = new SockJS(`${BACKEND_URL}/ws`);
  globalStompClient = Stomp.over(socket);
  globalStompClient.debug = null;
  globalStompClient.connect({}, function (frame) {
    const userId = currentUser ? currentUser.noStr || currentUser.id : null;
    if (userId) {
      globalStompClient.subscribe(`/topic/global/${userId}`, function (msg) {
        try {
          const chatPayload = JSON.parse(msg.body);
          if (chatPayload && chatPayload.roomId) {
            if (chatPayload.roomId !== currentRoomId) {
              const parts = chatPayload.roomId.split("_");
              if (parts.length >= 3) {
                const isPsikiater =
                  currentUser.role &&
                  currentUser.role.toLowerCase() === "psikiater";
                const otherId = isPsikiater ? parts[1] : parts[2];
                const badgeEl = document.getElementById("badge-" + otherId);
                if (badgeEl) {
                  badgeEl.classList.remove("hidden");
                  let currentNum = parseInt(badgeEl.innerText, 10) || 0;
                  badgeEl.innerText = currentNum + 1;
                }
              }
            } else {
              const validName = currentUser.namaLengkap || currentUser.username || currentUser.email || "User";
              if (chatPayload.senderName !== validName) {
                markRoomAsRead(
                  chatPayload.roomId,
                  validName,
                ).catch((e) => console.error(e));
              }
            }
          }
        } catch (e) {}
      });
    }

    const doctorId =
      currentUser &&
      currentUser.role &&
      currentUser.role.toLowerCase() === "psikiater"
        ? currentUser.noStr
        : null;
    if (doctorId) {
      globalStompClient.subscribe("/topic/doctor/" + doctorId, function (msg) {
        if (msg.body === "NEW_SESSION") {
          if (typeof window.loadPatientsFromServer === "function") {
            window.loadPatientsFromServer(true);
          }
        }
      });
    }
  });
}

function saveMessageToHistory(html) {
  if (!chatHistories[currentDoctorName]) chatHistories[currentDoctorName] = [];
  chatHistories[currentDoctorName].push(html);
  sessionStorage.setItem("chatHistories", JSON.stringify(chatHistories));
}

function loadCurrentChat() {
  const container = document.getElementById("chat-container");
  const headerArea = document.getElementById("chat-header");
  const inputArea = document.getElementById("chat-input-area");

  const isPsikiater =
    currentUser &&
    currentUser.role &&
    currentUser.role.toLowerCase() === "psikiater";

  if (!isCurrentContactAI && !isPsikiater && !paidDoctors[currentDoctorNoStr]) {
    if (headerArea) headerArea.classList.add("hidden");
    if (inputArea) inputArea.classList.add("hidden");
    showPaymentUI(container, currentDoctorNoStr);
    return;
  }

  if (headerArea) headerArea.classList.remove("hidden");
  if (inputArea) inputArea.classList.remove("hidden");

  container.innerHTML = `
    <div class="flex justify-center mb-6 mt-2">
      <span class="text-[10px] font-medium text-slate-400 bg-slate-200/50 px-2 py-1 rounded-full">Conversation started with ${currentDoctorName}</span>
    </div>
  `;

  if (!isCurrentContactAI && currentUser) {
    if (isPsikiater) {
      currentRoomId = `room_${currentDoctorNoStr}_${currentUser.noStr}`;
    } else {
      currentRoomId = `room_${currentUser.id}_${currentDoctorNoStr}`;
    }

    connectWebSocket(currentRoomId);

    fetchChatHistory(currentRoomId)
      .then((histories) => {
        if (histories && histories.length > 0) {
          histories.forEach((msg) => {
            const timeDisplay = formatTimestamp(msg.timestamp);
            const validName = currentUser.namaLengkap || currentUser.username || currentUser.email || "User";

            if (msg.senderName === validName) {
              removePreviousDuplicateTime(validName, timeDisplay);
              const userHtml = `
                            <div class="flex items-end justify-end gap-2 animate-fade-in-up mb-4">
                              <div class="max-w-[85%] flex flex-col items-end">
                                <div class="bg-[#f2ca4b] p-3.5 rounded-2xl rounded-tr-none shadow-sm text-slate-900 text-sm leading-relaxed">
                                  <p>${escapeHtml(msg.content)}</p>
                                </div>
                                <span class="chat-time text-[10px] text-slate-400 mt-1 mr-1" data-sender="${validName}" data-time="${timeDisplay}">${timeDisplay}</span>
                              </div>
                            </div>`;
              container.insertAdjacentHTML("beforeend", userHtml);
            } else {
              removePreviousDuplicateTime(currentDoctorName, timeDisplay);
              const doctorHtml = `
                            <div class="flex items-end gap-2 max-w-[85%] animate-fade-in-up mb-4">
                              <img src="${currentDoctorImg}" class="w-8 h-8 rounded-full object-cover shadow-sm mb-1 flex-shrink-0" />
                              <div class="flex flex-col items-start w-full">
                                <div class="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm text-slate-800 text-sm leading-relaxed border border-slate-100 inline-block">
                                  <p>${escapeHtml(msg.content)}</p>
                                </div>
                                <span class="chat-time text-[10px] text-slate-400 mt-1 ml-1" data-sender="${currentDoctorName}" data-time="${timeDisplay}">${timeDisplay}</span>
                              </div>
                            </div>`;
              container.insertAdjacentHTML("beforeend", doctorHtml);
            }
          });
          scrollToBottom();
        } else {
          // Jika belum ada chat history (baru bayar)
          if (isPsikiater) {
            container.insertAdjacentHTML(
              "beforeend",
              `<p class="text-center text-xs text-slate-400 my-4">Sesi terbuka. Pasien sedang menunggu, Anda bisa menyapanya terlebih dahulu!</p>`,
            );
          } else {
            container.insertAdjacentHTML(
              "beforeend",
              `<p class="text-center text-xs text-slate-400 my-4">Pembayaran sukses! Sesi pribadi berbayar sudah siap. Silakan mulai ceritakan keluhan Anda.</p>`,
            );
          }
        }

        if (currentUser) {
          const validName = currentUser.namaLengkap || currentUser.username || currentUser.email || "User";
          markRoomAsRead(currentRoomId, validName).catch((e) =>
            console.error("Mark read error:", e),
          );
        }
      })
      .catch((e) => console.error(e));
  } else if (chatHistories[currentDoctorName]) {
    chatHistories[currentDoctorName].forEach((msgHtml) => {
      container.insertAdjacentHTML("beforeend", msgHtml);
    });
  }
  scrollToBottom();
}

// Payment UI
async function showPaymentUI(container, targetNoStr) {
  container.innerHTML = `<div class="flex items-center justify-center h-full"><p class="text-slate-400 text-sm animate-pulse">Menghitung tagihan...</p></div>`;

  try {
    const data = await getPaymentInfo(targetNoStr);
    console.log("Data pembayaran diterima:", data);
    if (currentDoctorNoStr !== targetNoStr) {
      console.log("User pindah kontak, batalkan render UI pembayaran.");
      return;
    }

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
          <div class="p-8 w-full max-w-md">
              <p class="text-sm text-slate-500 mb-6">Selesaikan pembayaran untuk terhubung dengan <br><b>${data.namaPsikiater}</b></p>
              <div class="border border-slate-200 p-6 rounded-2xl mb-6 bg-slate-50/50 shadow-sm">
                  <img src="${data.qrUrl}" alt="QRIS" class="mx-auto w-40 h-40 mb-4 rounded-xl shadow-sm mix-blend-multiply"/>
                  <p class="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Total Tagihan</p>
                  <p class="text-3xl font-black text-slate-800">${data.price}</p>
              </div>
              <button onclick="simulatePaymentSuccess()" class="w-full py-4 bg-[#f2ca4b] hover:bg-[#e8ba35] text-slate-900 text-sm font-bold rounded-xl transition-all shadow-sm">
                  Konfirmasi Pembayaran
              </button>
          </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<p class="text-red-500 text-sm text-center">Gagal memuat data pembayaran.</p>`;
  }
}

function displayDoctorMessage(text, timeStr = null) {
  const container = document.getElementById("chat-container");
  const timeDisplay = formatTimestamp(timeStr) || getCurrentTime();
  removePreviousDuplicateTime(currentDoctorName, timeDisplay);

  const doctorHtml = `
    <div class="flex items-end gap-2 max-w-[85%] animate-fade-in-up mb-4">
      <img src="${currentDoctorImg}" class="w-8 h-8 rounded-full object-cover shadow-sm mb-1 flex-shrink-0" />
      <div class="flex flex-col items-start w-full">
        <div class="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm text-slate-800 text-sm leading-relaxed border border-slate-100 inline-block">
          <p>${escapeHtml(text)}</p>
        </div>
        <span class="chat-time text-[10px] text-slate-400 mt-1 ml-1" data-sender="${currentDoctorName}" data-time="${timeDisplay}">${timeDisplay}</span>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", doctorHtml);
  saveMessageToHistory(doctorHtml);
  scrollToBottom();
}

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

function formatTimestamp(timestampStr) {
  if (!timestampStr) return "";
  try {
    const d = new Date(timestampStr);
    if (isNaN(d.getTime())) return timestampStr.slice(11, 16);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "";
  }
}

function removePreviousDuplicateTime(senderName, timeStr) {
  const container = document.getElementById("chat-container");
  if (!container) return;
  const timeSpans = container.querySelectorAll(".chat-time");
  if (timeSpans.length > 0) {
    const lastSpan = timeSpans[timeSpans.length - 1];
    if (
      lastSpan.getAttribute("data-sender") === String(senderName) &&
      lastSpan.getAttribute("data-time") === timeStr
    ) {
      const mainBubble = lastSpan.closest(".animate-fade-in-up");
      lastSpan.remove();

      if (mainBubble) {
        mainBubble.classList.remove("mb-4");
        mainBubble.style.marginBottom = "8px";

        const prevImg = mainBubble.querySelector("img");
        if (prevImg) {
          prevImg.classList.add("opacity-0");
        }
      }
    }
  }
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

window.closeCustomModal = function () {
  const modal = document.getElementById("custom-modal-overlay");
  if (modal) modal.remove();
};

window.confirmEndSession = async function () {
  closeCustomModal();

  if (currentDoctorNoStr) {
    delete paidDoctors[currentDoctorNoStr];
    sessionStorage.setItem("paidDoctors", JSON.stringify(paidDoctors));
  }

  if (chatHistories[currentDoctorName]) {
    delete chatHistories[currentDoctorName];
    sessionStorage.setItem("chatHistories", JSON.stringify(chatHistories));
  }

  if (!isCurrentContactAI && currentRoomId) {
    try {
      await endChatSession(currentRoomId);
      if (stompClient) stompClient.disconnect();
    } catch (e) {}
  }

  loadCurrentChat();
  console.log("Sesi berakhir.");
};

window.simulatePaymentSuccess = async function () {
  const container = document.getElementById("chat-container");

  // Animasi Loading
  container.innerHTML = `<div class="flex items-center justify-center h-full"><p class="text-slate-400 text-sm animate-pulse">Memverifikasi pembayaran...</p></div>`;

  try {
    const result = await processPaymentSimulation(
      currentUser.id,
      currentDoctorNoStr,
    );

    if (result.status === "PAID") {
      paidDoctors[currentDoctorNoStr] = true;
      sessionStorage.setItem("paidDoctors", JSON.stringify(paidDoctors));

      // Animasi Sukses
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
    }
  } catch (err) {
    alert("Koneksi server gagal.");
  }
};

window.selectContact = function (name, img, isAi = false, noStr = "") {
  currentDoctorName = name;
  currentDoctorImg = img;
  currentDoctorNoStr = noStr;
  isCurrentContactAI = isAi;

  const badgeEl = document.getElementById("badge-" + noStr);
  if (badgeEl) {
    badgeEl.classList.add("hidden");
    badgeEl.innerText = "0";
  }

  if (isAi && stompClient) {
    stompClient.disconnect();
    stompClient = null;
    currentRoomId = null;
  }

  document.getElementById("header-name").innerText = name;
  document.getElementById("header-avatar").src = img;

  const endBtn = document.getElementById("end-session-btn");
  const isPsikiater =
    currentUser &&
    currentUser.role &&
    currentUser.role.toLowerCase() === "psikiater";

  if (isAi || isPsikiater) {
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

  const timeDisplay = getCurrentTime();
  const validName = currentUser.namaLengkap || currentUser.username || currentUser.email || "User";
  removePreviousDuplicateTime(validName, timeDisplay);

  const userHtml = `
    <div class="flex items-end justify-end gap-2 animate-fade-in-up mb-4">
      <div class="max-w-[85%] flex flex-col items-end">
        <div class="bg-[#f2ca4b] p-3.5 rounded-2xl rounded-tr-none shadow-sm text-slate-900 text-sm leading-relaxed">
          <p>${escapeHtml(messageText)}</p>
        </div>
        <span class="chat-time text-[10px] text-slate-400 mt-1 mr-1" data-sender="${validName}" data-time="${timeDisplay}">${timeDisplay}</span>
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
      displayDoctorMessage("Maaf, koneksi ke asisten AI terputus.");
    }
  } else {
    if (stompClient && stompClient.connected) {
      const chatMessage = {
        roomId: currentRoomId,
        senderName: validName,
        content: messageText,
        timestamp: new Date(),
      };
      stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
    }
  }
};

window.loadDoctorsFromServer = loadDoctorsFromServer;

window.loadPatientsFromServer = async function (silent = false) {
  const listContainer = document.getElementById("doctor-list");
  if (!listContainer) return;

  const doctorId = currentUser ? currentUser.noStr : "";

  try {
    if (!silent) {
      listContainer.innerHTML = `<p class="text-xs text-slate-400 p-4 text-center animate-pulse">Memuat daftar pasien...</p>`;
    }

    const result = await fetchPatientsByDoctor(doctorId);
    const patients = result.data || result;

    let tempHtml = "";

    if (patients && patients.length > 0) {
      for (const patient of patients) {
        const patientName =
          patient.namaLengkap ||
          patient.username ||
          patient.email ||
          "Tidak Diketahui";
        const patientId = patient.id || patient._id || patient.noStr || "";

        const avatarUrl = patient.picture
          ? patient.picture
          : `${DICEBEAR_BASE_URL}?seed=${encodeURIComponent(patientName)}`;

        let unreadCount = 0;
        if (currentUser && currentUser.noStr) {
          try {
            const validName = currentUser.namaLengkap || currentUser.username || currentUser.email || "User";
            const rId = `room_${patientId}_${currentUser.noStr}`;
            unreadCount = await fetchUnreadCount(rId, validName);
          } catch (e) {}
        }

        const badgeHtml = `<div id="badge-${patientId}" class="absolute -top-1 -right-1 z-10 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm ${unreadCount > 0 ? "" : "hidden"}">${unreadCount}</div>`;
        const html = `
          <div data-contact="${patientName}"
               onclick="selectContact('${patientName}', '${avatarUrl}', false, '${patientId}')"
               class="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm border-2 border-transparent hover:border-slate-100 transition-all cursor-pointer group">
              <div class="relative text-left">
                  <img src="${avatarUrl}" class="w-12 h-12 rounded-full object-cover" />
                  <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  ${badgeHtml}
              </div>
              <div class="flex-1 min-w-0 text-left">
                  <div class="flex justify-between items-baseline">
                      <h4 class="font-semibold text-slate-900 text-sm truncate">${patientName}</h4>
                  </div>
              </div>
          </div>
        `;
        tempHtml += html;
      }
      listContainer.innerHTML = tempHtml;
    } else {
      listContainer.innerHTML = `<p class="text-xs text-slate-400 p-4 text-center">Belum ada obrolan dengan pasien saat ini.</p>`;
    }

    if (currentDoctorName !== "AI Assistant") {
      const activePatientStillExists =
        patients &&
        patients.some(
          (p) => (p.id || p._id || p.noStr || "") === currentDoctorNoStr,
        );

      if (!activePatientStillExists) {
        selectContact(
          "AI Assistant",
          "../assets/image/cloud (3).png",
          true,
          "",
        );
      } else if (silent) {
        setActiveContact(currentDoctorName);
      }
    }
  } catch (error) {
    console.error("Error fetching patients:", error);
    if (!silent) {
      listContainer.innerHTML = `<p class="text-[10px] text-red-400 p-2 text-center">Endpoint API Pasien kemungkinan belum dibuat di BE.<br>(${error.message})</p>`;
    }
  }
};
