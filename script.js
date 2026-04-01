const preloader = document.getElementById("preloader");
const envelope = document.getElementById("envelope");
const sealBtn = document.getElementById("seal-btn");

const fabGift = document.getElementById("fab-gift");
const fabMusic = document.getElementById("fab-music");
const bgAudio = document.getElementById("bg-audio");

const openQr = document.getElementById("open-qr");
const closeQr = document.getElementById("close-qr");
const qrModal = document.getElementById("qr-modal");

const openRsvp = document.getElementById("open-rsvp");
const closeRsvp = document.getElementById("close-rsvp");
const rsvpModal = document.getElementById("rsvp-modal");

const guestbookForm = document.getElementById("guestbook-form");
const guestName = document.getElementById("guest-name");
const guestMessage = document.getElementById("guest-message");
const chatList = document.getElementById("chat-list");
const chatEmpty = document.getElementById("chat-empty");

const rsvpForm = document.getElementById("rsvp-form");

let invitationOpened = false;
let musicPlaying = false;

function hidePreloader() {
  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.style.transition = "opacity .4s ease";
    setTimeout(() => {
      preloader.style.display = "none";
      autoOpenEnvelope();
    }, 420);
  }, 900);
}

function openInvitation() {
  if (invitationOpened) return;
  invitationOpened = true;

  sealBtn.classList.add("hide");
  envelope.classList.add("open");

  setTimeout(() => {
    envelope.style.display = "none";
  }, 1100);

  playMusic();
}

function autoOpenEnvelope() {
  setTimeout(() => {
    openInvitation();
  }, 2000);
}

function playMusic() {
  bgAudio.play()
    .then(() => {
      musicPlaying = true;
      fabMusic.classList.add("playing");
    })
    .catch(() => {
      musicPlaying = false;
      fabMusic.classList.remove("playing");
    });
}

function pauseMusic() {
  bgAudio.pause();
  musicPlaying = false;
  fabMusic.classList.remove("playing");
}

function toggleMusic() {
  if (musicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function updateCountdown() {
  const target = new Date("2025-12-14T00:00:00+07:00").getTime();
  const now = Date.now();
  const gap = target - now;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minsEl = document.getElementById("mins");
  const secsEl = document.getElementById("secs");

  if (gap <= 0) {
    daysEl.textContent = "000";
    hoursEl.textContent = "00";
    minsEl.textContent = "00";
    secsEl.textContent = "00";
    return;
  }

  const days = Math.floor(gap / (1000 * 60 * 60 * 24));
  const hours = Math.floor((gap / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((gap / (1000 * 60)) % 60);
  const secs = Math.floor((gap / 1000) % 60);

  daysEl.textContent = String(days).padStart(3, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minsEl.textContent = String(mins).padStart(2, "0");
  secsEl.textContent = String(secs).padStart(2, "0");
}

function initReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function openModal(modalEl) {
  modalEl.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(modalEl) {
  modalEl.classList.add("hidden");
  const anyOpen = !qrModal.classList.contains("hidden") || !rsvpModal.classList.contains("hidden");
  if (!anyOpen) {
    document.body.style.overflow = "";
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function appendChatBubble(name, message, animated = true) {
  const bubble = document.createElement("article");
  bubble.className = `chat-bubble ${chatList.children.length % 2 ? "alt" : ""}`;
  bubble.innerHTML = `
    <p class="chat-name">${escapeHtml(name)}</p>
    <p class="chat-message">${escapeHtml(message)}</p>
  `;
  chatList.prepend(bubble);
  if (animated) {
    requestAnimationFrame(() => bubble.classList.add("show"));
  } else {
    bubble.classList.add("show");
  }
}

function storeMessages(messages) {
  localStorage.setItem("wedding_guestbook_messages", JSON.stringify(messages));
}

function loadMessages() {
  try {
    const raw = localStorage.getItem("wedding_guestbook_messages");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function renderMessages() {
  chatList.innerHTML = "";
  const messages = loadMessages();
  if (!messages.length) {
    chatEmpty.style.display = "block";
    return;
  }

  chatEmpty.style.display = "none";

  messages.forEach(item => appendChatBubble(item.name, item.message, false));
}

function addMessage(name, message) {
  const messages = loadMessages();
  messages.unshift({
    name,
    message,
    at: Date.now()
  });
  storeMessages(messages.slice(0, 40));
  renderMessages();
}

function initPetals() {
  const canvas = document.getElementById("petal-canvas");
  const ctx = canvas.getContext("2d");

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  const petals = Array.from({ length: 24 }).map(() => ({
    x: Math.random() * canvas.clientWidth,
    y: Math.random() * canvas.clientHeight,
    w: 8 + Math.random() * 8,
    h: 6 + Math.random() * 6,
    speedY: 0.6 + Math.random() * 1.2,
    speedX: -0.4 + Math.random() * 0.8,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: -0.02 + Math.random() * 0.04,
    alpha: 0.28 + Math.random() * 0.4
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    petals.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rot += p.rotSpeed;

      if (p.y > canvas.clientHeight + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.clientWidth;
      }
      if (p.x < -20) p.x = canvas.clientWidth + 20;
      if (p.x > canvas.clientWidth + 20) p.x = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = "#f4d7dc";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.w, p.h, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

window.addEventListener("load", () => {
  hidePreloader();
  initReveal();
  initPetals();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  renderMessages();
});

sealBtn.addEventListener("click", openInvitation);

fabGift.addEventListener("click", () => {
  document.getElementById("gift-section").scrollIntoView({ behavior: "smooth" });
});

fabMusic.addEventListener("click", toggleMusic);

openQr.addEventListener("click", () => openModal(qrModal));
closeQr.addEventListener("click", () => closeModal(qrModal));

openRsvp.addEventListener("click", () => openModal(rsvpModal));
closeRsvp.addEventListener("click", () => closeModal(rsvpModal));

qrModal.addEventListener("click", e => {
  if (e.target === qrModal) closeModal(qrModal);
});

rsvpModal.addEventListener("click", e => {
  if (e.target === rsvpModal) closeModal(rsvpModal);
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal(qrModal);
    closeModal(rsvpModal);
  }
});

guestbookForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = guestName.value.trim();
  const message = guestMessage.value.trim();

  if (!name || !message) {
    alert("Bạn vui lòng nhập đầy đủ tên và lời chúc.");
    return;
  }

  chatEmpty.style.display = "none";
  appendChatBubble(name, message, true);

  const messages = loadMessages();
  messages.unshift({ name, message, at: Date.now() });
  storeMessages(messages.slice(0, 40));

  guestName.value = "";
  guestMessage.value = "";
});

rsvpForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("rsvp-name").value.trim();
  const count = document.getElementById("rsvp-count").value;
  if (!name || !count) {
    alert("Vui lòng điền đầy đủ thông tin RSVP.");
    return;
  }
  alert(`Cảm ơn ${name}! Đã ghi nhận ${count} khách tham dự.`);
  rsvpForm.reset();
  closeModal(rsvpModal);
});
