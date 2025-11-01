const kola = document.getElementById("toTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    kola.classList.add("show");
  } else {
    kola.classList.remove("show");
  }
});

kola.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});