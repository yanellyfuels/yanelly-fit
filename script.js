/* ===========================================================================
   Yanelly Fuels — interactivity
   ---------------------------------------------------------------------------
   This file handles:
     1. Mobile menu open/close
     2. Sticky nav shrinking once you scroll
     3. Scroll-reveal animations (things fade in as you reach them)
     4. The email signup form display state
     5. The current year in the footer
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
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));

  const revealInView = () =>
    revealEls.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add("is-in");
    });
  revealInView();
  window.addEventListener("load", revealInView);
  setTimeout(showAll, 2500);
} else {
  showAll();
}

/* ---- 4. Email opt-in forms -----------------------------------------------
   Intended delivery: Kit sends "Could You Be Underfueling? A Reflection Guide
   for Active Women" through an incentive or automated email.

   TODO: Replace KIT_FORM_ACTION_PLACEHOLDER in index.html with the public Kit
   form action URL, or replace the form markup with Kit's official embed code.
   Do not add private Kit API keys to frontend code.

   HA_FREEBIE_URL is here as a future public file reference if needed, but the
   preferred delivery method is Kit email, not a public direct download.        */
const KIT_PLACEHOLDER = "KIT_FORM_ACTION_PLACEHOLDER";
const HA_FREEBIE_URL = "";

document.querySelectorAll("form.optin").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const action = form.dataset.kitFormAction || form.getAttribute("action") || "";
    const hasKitAction = action && action !== KIT_PLACEHOLDER;

    if (hasKitAction) {
      try {
        await fetch(action, {
          method: form.method || "POST",
          mode: "no-cors",
          body: new FormData(form)
        });
      } catch (error) {
        console.warn("Kit form submission could not be confirmed.", error);
      }
    }

    const fields = form.querySelector(".optin__fields");
    const note = form.querySelector(".optin__note");
    const hook = form.querySelector(".optin__hook");
    const subtitle = form.querySelector(".freebie__subtitle");
    const success = form.querySelector(".optin__success");
    if (fields) fields.hidden = true;
    if (note) note.hidden = true;
    if (hook) hook.hidden = true;
    if (subtitle) subtitle.hidden = true;
    if (success) success.hidden = false;
  });
});

/* ---- 5. Current year ----------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
