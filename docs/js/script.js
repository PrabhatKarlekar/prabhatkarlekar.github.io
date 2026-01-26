// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle
const toggle = document.getElementById("themeToggle");
const root = document.documentElement;
const saved = localStorage.getItem("theme");

if (saved) root.setAttribute("data-theme", saved);

toggle.addEventListener("click", () => {
  const theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
});

// Neural background
const canvas = document.getElementById("neural-bg");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const points = Array.from({ length: 50 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - .5) * .4,
  vy: (Math.random() - .5) * .4
}));

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  points.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x<0||p.x>canvas.width) p.vx*=-1;
    if (p.y<0||p.y>canvas.height) p.vy*=-1;
    ctx.beginPath();
    ctx.arc(p.x,p.y,1.5,0,Math.PI*2);
    ctx.fillStyle="rgba(99,102,241,.6)";
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();
