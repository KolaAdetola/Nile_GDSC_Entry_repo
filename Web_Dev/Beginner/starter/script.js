document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const modeBtn = document.getElementById("mode-toggle");
  const menuBtn = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const toTopBtn = document.getElementById("to-top");
  const yearEl = document.getElementById("year");

  yearEl.textContent = new Date().getFullYear();

  const saved = localStorage.getItem("theme");
  if (saved === "dark") html.classList.add("dark");
  updateIcon();

  modeBtn.addEventListener("click", () => {
    html.classList.toggle("dark");
    const isDark = html.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateIcon();
  });

  function updateIcon() {
    const isDark = html.classList.contains("dark");
    modeBtn.textContent = isDark ? "☀️" : "🌙";
  }

  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
  document.querySelectorAll(".nav-links a").forEach(link =>
    link.addEventListener("click", () => navLinks.classList.remove("active"))
  );

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      toTopBtn.classList.add("show");
    } else {
      toTopBtn.classList.remove("show");
    }
  });
  toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  
  const faders = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  });
  faders.forEach(el => observer.observe(el));
});
