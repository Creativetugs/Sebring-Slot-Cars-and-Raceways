const FACEBOOK = "https://www.facebook.com/p/Sebring-Slot-Cars-and-Raceways-100061230132801/";
const MAIL = "sebringslotcars@gmail.com";

const mast = document.querySelector(".mast");
const nav = document.querySelector("#site-nav");
const toggle = document.querySelector(".nav-toggle");
const progress = document.querySelector(".progress");
const dialog = document.querySelector("#lead");
const panels = dialog.querySelectorAll("[data-panel]");
const thanks = dialog.querySelector(".thanks");

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  mast.classList.toggle("is-stuck", window.scrollY > 8);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
  document.body.style.overflow = open ? "" : "hidden";
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.style.overflow = "";
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1360) {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.style.overflow = "";
  }
});

function openLead(mode, data = {}) {
  thanks.hidden = true;
  panels.forEach((panel) => {
    const show = panel.dataset.panel === mode;
    panel.hidden = !show;
    if (show) panel.querySelector("form")?.reset();
  });
  if (data.track) {
    const field = dialog.querySelector("#book-track");
    if (field) field.value = data.track;
  }
  if (data.event) {
    const field = dialog.querySelector("#event-type");
    if (field) field.value = data.event;
  }
  if (data.interest) {
    const field = dialog.querySelector("#shop-interest");
    if (field) field.value = data.interest;
  }
  if (typeof dialog.showModal === "function") dialog.showModal();
}

document.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-open]");
  if (!opener) return;
  event.preventDefault();
  openLead(opener.dataset.open, opener.dataset);
});

dialog.querySelector(".lead-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => {
  thanks.hidden = true;
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== "book";
  });
});

dialog.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.company && form.company.value) return;
    const lines = [];
    const data = new FormData(form);
    data.forEach((value, key) => {
      if (key === "company" || !String(value).trim()) return;
      lines.push(`${key}: ${value}`);
    });
    const subject = form.dataset.subject || "Sebring Slot Cars inquiry";
    window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    panels.forEach((panel) => {
      panel.hidden = true;
    });
    thanks.hidden = false;
  });
});

document.querySelectorAll("[data-facebook]").forEach((link) => {
  if (!link.getAttribute("href") || link.getAttribute("href") === "#") {
    link.href = FACEBOOK;
  }
});
