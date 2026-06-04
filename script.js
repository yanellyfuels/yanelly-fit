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
   Adds the "is-in" class to each [data-reveal] element as it scrolls into
   view, which triggers the fade-and-rise animation defined in styles.css.    */
const revealEls = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target); // animate once, then stop watching
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  // No IntersectionObserver support → just show everything
  revealEls.forEach((el) => el.classList.add("is-in"));
}

/* ---- 4. Email signup ----------------------------------------------------
   For now this just shows a confirmation. To actually collect emails, connect
   it to a free service (Kit/ConvertKit, Mailchimp, Beehiiv) by pasting their
   embed snippet in place of the <form> in index.html.                         */
const form = document.getElementById("signup-form");
const note = document.getElementById("signup-note");
if (form && note) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    note.hidden = false;
    note.textContent = "Thanks for signing up! 🥑 You'll hear from me soon.";
    form.reset();
  });
}

/* ---- 5. Current year ----------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
