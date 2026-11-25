const loader = document.querySelector(".page-loader");
if (loader) {
  window.addEventListener("load", () => setTimeout(() => loader.classList.add("done"), 350));
}

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

function updateHeader() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 12);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const pageName = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = link.getAttribute("href");
  link.classList.toggle("active", href === pageName);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow && window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

function toast(message) {
  const region = document.querySelector(".toast-region");
  if (!region) return;
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  region.append(item);
  setTimeout(() => item.remove(), 3200);
}

document.querySelectorAll(".resume-download").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    fetch(link.getAttribute("href"), { method: "HEAD" })
      .then((response) => {
        if (response.ok) {
          window.location.href = link.getAttribute("href");
        } else {
          toast("Resume PDF not added yet");
        }
      })
      .catch(() => toast("Resume PDF not added yet"));
  });
});

document.querySelectorAll(".project-link").forEach((button) => {
  button.addEventListener("click", () => {
    toast(`${button.dataset.type} link can be added here`);
  });
});

document.querySelectorAll(".verification-placeholder").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    toast("Verification link placeholder");
  });
});

const contactForm = document.querySelector("#contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;
    const name = contactForm.elements.name;
    const email = contactForm.elements.email;
    const message = contactForm.elements.message;

    const setError = (field, text) => {
      field.classList.toggle("invalid", Boolean(text));
      const error = contactForm.querySelector(`[data-error-for="${field.name}"]`);
      if (error) error.textContent = text;
    };

    setError(name, name.value.trim() ? "" : "Please enter your name.");
    setError(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "" : "Please enter a valid email.");
    setError(message, message.value.trim().length >= 10 ? "" : "Please enter at least 10 characters.");

    valid = Boolean(name.value.trim()) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) &&
      message.value.trim().length >= 10;

    if (valid) {
      toast("Form validated successfully. Backend integration is still required.");
      contactForm.reset();
      setError(name, "");
      setError(email, "");
      setError(message, "");
    }
  });
}
