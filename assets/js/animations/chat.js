let currentDoctorName = "AI Assistant";
let currentDoctorImg = "../assets/image/cloud (3).png";

document.addEventListener("DOMContentLoaded", function () {
  scrollToBottom();
});

function scrollToBottom() {
  const container = document.getElementById("chat-container");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function handleEnter(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const messageText = input.value.trim();
  const container = document.getElementById("chat-container");

  if (messageText === "") return;

  const userHtml = `
    <div class="flex items-end justify-end gap-2 animate-fade-in-up">
      <div class="max-w-[85%] flex flex-col items-end">
        <div class="bg-[#f2ca4b] p-3.5 rounded-2xl rounded-tr-none shadow-sm text-slate-900 text-sm leading-relaxed">
          <p>${escapeHtml(messageText)}</p>
        </div>
        <span class="text-[10px] text-slate-400 mt-1 mr-1">${getCurrentTime()}</span>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", userHtml);
  input.value = "";
  scrollToBottom();

  setTimeout(() => {
    showTypingIndicator();
    scrollToBottom();

    setTimeout(() => {
      removeTypingIndicator();
      const doctorHtml = `
        <div class="flex items-end gap-2 max-w-[85%] animate-fade-in-up">
          <img src="${currentDoctorImg}" class="w-8 h-8 rounded-full object-cover shadow-sm mb-1" />
          <div class="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm text-slate-800 text-sm leading-relaxed border border-slate-100">
            <p>I hear you. Can you tell me more about that? ${currentDoctorName.includes("AI") ? "I'm processing this info." : "I'm here to listen."}</p>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", doctorHtml);
      scrollToBottom();
    }, 1500);
  }, 500);
}

function selectContact(name, img, isAi = false) {
  currentDoctorName = name;
  currentDoctorImg = img;

  document.getElementById("header-name").innerText = name;
  document.getElementById("header-avatar").src = img;
  const endBtn = document.getElementById("end-session-btn");

  if (isAi) {
    endBtn.classList.add("hidden");
  } else {
    endBtn.classList.remove("hidden");
  }

  const container = document.getElementById("chat-container");
  container.innerHTML = `
    <div class="flex justify-center">
      <span class="text-[10px] font-medium text-slate-400 bg-slate-200/50 px-2 py-1 rounded-full">Conversation started with ${name}</span>
    </div>
  `;

  setActiveContact(name);
}

function setActiveContact(name) {
  const allContacts = document.querySelectorAll("[data-contact]");
  allContacts.forEach((contact) => {
    const isAI = contact.getAttribute("data-contact") === "AI Assistant";

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
     <div id="typing-indicator" class="flex items-end gap-2 max-w-[85%]">
      <img src="${currentDoctorImg}" class="w-8 h-8 rounded-full object-cover shadow-sm mb-1" />
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
