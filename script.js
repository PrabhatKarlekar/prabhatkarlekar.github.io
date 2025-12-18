// year
document.getElementById("year").textContent = new Date().getFullYear();

// theme toggle
const toggle = document.getElementById("themeToggle");
toggle.onclick = () => {
  const theme = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute(
    "data-theme",
    theme === "light" ? "dark" : "light"
  );
};

// fade-in observer
const observer = new IntersectionObserver(
  entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
  { threshold: 0.1 }
);

document.querySelectorAll(".fade").forEach(el => observer.observe(el));
