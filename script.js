/* ===========================================================================
   Yanelly Fuels — interactivity
   ---------------------------------------------------------------------------
   This file handles:
     1. Mobile menu open/close
     2. Sticky nav shrinking once you scroll
     3. Scroll-reveal animations (things fade in as you reach them)
     4. The email signup form (shows a thank-you for now)
     5. The current year in the footer
   You usually won't need to edit this file.
   =========================================================================== */

/* ---- 1. Mobile menu ------------------------------------------------------ */
const toggle = document.querySelector(".nav__toggle");
const links = document.querySelector(".nav__links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---- 2. Shrink the nav after scrolling ----------------------------------- */
const nav = document.querySelector("[data-nav]");
if (nav) {
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---- 3. Scroll reveal ----------------------------------------------------
   Elements with [data-reveal] start hidden and fade/rise in as you reach them.
   This is purely decorative, so it is built to FAIL SAFE: content can never
   stay invisible. Anything on screen shows immediately, and a backstop timer
   reveals everything shortly after load even if the observer never fires.     */
const revealEls = document.querySelectorAll("[data-reveal]");
const showAll = () => revealEls.forEach((el) => el.classList.add("is-in"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target); // animate once, then stop watching
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));

  // Safety nets so nothing is ever stuck hidden:
  const revealInView = () =>
    revealEls.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add("is-in");
    });
  revealInView();                              // show whatever is on screen now
  window.addEventListener("load", revealInView); // ...and again once fully loaded
  setTimeout(showAll, 2500);                    // backstop: reveal everything
} else {
  // No observer support, or the visitor prefers reduced motion → show it all
  showAll();
}

/* ---- 4. Email opt-in forms (the main call-to-action) --------------------
   Every form with class "optin" captures a first name + email and then shows
   the success state with the cheat-sheet download.

   To actually COLLECT the emails, wire this up to an email tool (Kit/ConvertKit
   recommended) where the "TODO" is marked below —
   e.g. POST the name + email to her Kit form endpoint, or swap each <form> for
   Kit's embed snippet. Right now it delivers the download but doesn't store
   the address anywhere.                                                        */
document.querySelectorAll("form.optin").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    // const data = { first_name: form.querySelector(".optin__name").value,
    //                email: form.querySelector(".optin__email").value };
    // TODO: send `data` to the email provider (Kit/ConvertKit) here.

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
