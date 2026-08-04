/* ===========================================================================
   Yanelly Fuels interactivity
   ---------------------------------------------------------------------------
   This file handles:
     1. Mobile menu open and close
     2. Sticky nav styling once you scroll
     3. Scroll reveal animations
     4. The free guide form reveal
     5. The current year in the footer
   =========================================================================== */

/* ---- 1. Mobile menu ------------------------------------------------------ */
const toggle = document.querySelector(".nav__toggle");
const links = document.querySelector(".nav__links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---- 2. Sticky nav styling ---------------------------------------------- */
const nav = document.querySelector("[data-nav]");
if (nav) {
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---- 3. Scroll reveal ----------------------------------------------------
   Elements with [data-reveal] fade in as they enter the viewport. The fallback
   paths keep content visible when motion is reduced or observer support fails. */
const revealEls = document.querySelectorAll("[data-reveal]");
const showAll = () => revealEls.forEach((el) => el.classList.add("is-in"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));

  const revealInView = () =>
    revealEls.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
        el.classList.add("is-in");
      }
    });

  revealInView();
  window.addEventListener("load", revealInView);
  setTimeout(showAll, 2500);
} else {
  showAll();
}

/* ---- 4. Free guide form --------------------------------------------------
   This static GitHub Pages form validates the visitor's email, then reveals
   the local Balanced Plate Guide download. It does not store email addresses.
   To collect subscribers later, replace this local reveal with a real email
   platform form or endpoint, such as Kit, without placing private keys here. */
document.querySelectorAll("form.optin").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fields = form.querySelector(".optin__fields");
    const note = form.querySelector(".optin__note");
    const hook = form.querySelector(".optin__hook");
    const success = form.querySelector(".optin__success");

    if (fields) fields.hidden = true;
    if (note) note.hidden = true;
    if (hook) hook.hidden = true;
    if (success) success.hidden = false;
  });
});

/* ---- 5. Current year ----------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
