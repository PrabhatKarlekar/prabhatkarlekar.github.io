// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle
const toggle = document.getElementById("theme-toggle");
const icon = toggle.querySelector("i");

const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

document.documentElement.setAttribute("data-theme", savedTheme);
icon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

toggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  icon.className = next === "dark" ? "fas fa-sun" : "fas fa-moon";
});
