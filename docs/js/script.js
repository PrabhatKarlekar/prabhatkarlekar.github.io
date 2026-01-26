document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    };

    const savedTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // 2. Update Year
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // 3. Typewriter Effect
    const typeWriterElements = document.querySelectorAll('.typewriter, .typewriter-delay, .typewriter-delay-2');
    typeWriterElements.forEach((el, index) => {
        const text = el.getAttribute('data-text');
        el.textContent = '';
        let i = 0;
        setTimeout(() => {
            const typing = setInterval(() => {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                }
            }, 100);
        }, index * 1500);
    });

    // 4. Animate Stats
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const updateCount = () => {
            const count = +stat.innerText;
            const inc = target / 100;
            if (count < target) {
                stat.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                stat.innerText = target + "+";
            }
        };
        updateCount();
    });

    // 5. Neural Background Animation
    const canvas = document.getElementById('neural-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.size = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < 50; i++) particles.push(new Particle());
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary');
                    ctx.globalAlpha = 1 - dist / 100;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            });
        });
        requestAnimationFrame(animate);
    };

    initParticles();
    animate();
});