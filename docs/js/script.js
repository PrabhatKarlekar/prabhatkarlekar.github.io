// Main Portfolio JavaScript
document.documentElement.classList.add('js');

class PortfolioApp {
    constructor() {
        this.initialized = false;
        this.init();
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    setStoredTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // Ignore storage restrictions in incognito/WebViews
        }
    }

    init() {
        if (this.initialized) return;
        
        try { this.setCurrentYear(); } catch (e) { console.error('Year init:', e); }
        try { this.initThemeToggle(); } catch (e) { console.error('Theme init:', e); }
        try { this.initMobileNav(); } catch (e) { console.error('Mobile nav init:', e); }
        try { this.initNavigation(); } catch (e) { console.error('Nav init:', e); }
        try { this.initAnimations(); } catch (e) { console.error('Animations init:', e); }
        try { this.initContactForm(); } catch (e) { console.error('Contact init:', e); }
        try { this.initTypewriter(); } catch (e) { console.error('Typewriter init:', e); }
        try { this.initScrollAnimations(); } catch (e) { console.error('Scroll anims init:', e); }
        
        // Initial animations
        setTimeout(() => {
            try { this.animateStats(); } catch (e) { console.error('Stats anim:', e); }
        }, 1000);
        
        this.initialized = true;
    }

    setCurrentYear() {
        const yearEl = document.getElementById('currentYear');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        const themeIcon = themeToggle.querySelector('i');
        
        // Check for saved theme or prefer-color-scheme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = this.getStoredTheme() || 
            (prefersDark.matches ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (themeIcon) this.updateThemeIcon(savedTheme, themeIcon);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            this.setStoredTheme(newTheme);
            if (themeIcon) this.updateThemeIcon(newTheme, themeIcon);
        });
        
        // Listen for system theme changes
        prefersDark.addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                if (themeIcon) this.updateThemeIcon(newTheme, themeIcon);
            }
        });
    }

    updateThemeIcon(theme, icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    initNavigation() {
        const aliasMap = {
            'projects': 'work',
            'skills': 'capabilities',
            'education': 'credentials'
        };

        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '') return;
                
                const targetId = href.substring(1);
                const resolvedId = aliasMap[targetId] || targetId;
                const targetElement = document.getElementById(resolvedId) || document.querySelector(href);
                
                if (targetElement) {
                    e.preventDefault();
                    const navHeight = 75;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - navHeight;
                    
                    window.scrollTo({
                        top: resolvedId === 'hero' ? 0 : offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    const activeNavLink = document.querySelector(`.nav-link[href="#${resolvedId}"]`) || anchor;
                    if (activeNavLink && activeNavLink.classList.contains('nav-link')) {
                        activeNavLink.classList.add('active');
                    }
                    
                    // Update URL without jump
                    if (history.pushState) {
                        history.pushState(null, null, `#${resolvedId}`);
                    }
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });

        // Handle initial hash on page load (support legacy #projects, #skills, #education)
        if (window.location.hash) {
            const rawHash = window.location.hash.substring(1);
            const resolvedHash = aliasMap[rawHash] || rawHash;
            const target = document.getElementById(resolvedHash);
            if (target) {
                setTimeout(() => {
                    const navHeight = 75;
                    const offsetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                    window.scrollTo({
                        top: resolvedHash === 'hero' ? 0 : offsetPosition,
                        behavior: 'smooth'
                    });
                }, 150);
            }
        }
        
        // High-performance IntersectionObserver Scroll-Spy
        this.initScrollSpy();
    }

    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        if (!sections.length || !navLinks.length) return;
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -65% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        const href = link.getAttribute('href');
                        if (href === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }

    initAnimations() {
        // Add scroll-triggered animation class
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe elements
        document.querySelectorAll('.timeline-item, .project-card, .skill-category').forEach(el => {
            observer.observe(el);
        });
    }

    initContactForm() {
        const copyBtn = document.getElementById('copy-email-btn');
        const textSpan = document.getElementById('copy-email-text');
        if (!copyBtn || !textSpan) return;

        copyBtn.addEventListener('click', async () => {
            const email = 'pritvikarlekar@gmail.com';
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(email);
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = email;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }
                const originalText = textSpan.textContent;
                textSpan.textContent = 'Copied to Clipboard!';
                copyBtn.classList.add('btn-copied');

                setTimeout(() => {
                    textSpan.textContent = originalText;
                    copyBtn.classList.remove('btn-copied');
                }, 2000);
            } catch (err) {
                console.error('Clipboard copy failed, opening mailto:', err);
                window.location.href = `mailto:${email}`;
            }
        });
    }

    initTypewriter() {
        const roles = [
            document.querySelector('.typewriter'),
            document.querySelector('.typewriter-delay'),
            document.querySelector('.typewriter-delay-2')
        ].filter(Boolean);
        
        if (roles.length === 0) return;
        
        let current = 0;
        const typeNext = () => {
            const el = roles[current];
            const text = el.getAttribute('data-text');
            if (!text) return;
            
            el.textContent = '';
            el.style.borderRight = '2px solid var(--accent-primary)';
            let i = 0;
            const type = () => {
                if (i < text.length) { 
                    el.textContent += text[i]; 
                    i++; 
                    setTimeout(type, 60); 
                }
                else {
                    setTimeout(() => {
                        el.style.borderRight = 'none';
                        current = (current + 1) % roles.length;
                        setTimeout(typeNext, 2000); // pause before next
                    }, 1000);
                }
            };
            type();
        };
        typeNext();
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const suffix = stat.getAttribute('data-suffix') !== null ? stat.getAttribute('data-suffix') : (stat.textContent.includes('+') ? '+' : '');
            const duration = 2000;
            const startTime = Date.now();
            
            const animate = () => {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                
                const currentValue = Math.floor(easeOutQuart * target);
                stat.textContent = currentValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    stat.textContent = target + suffix;
                }
            };
            
            animate();
        });
    }

    animateSkillBars() {
        // Deprecated in Phase 4: Replaced by grouped semantic capability chips
    }

    initScrollAnimations() {
        // Add progressive reveal animation for sections
        const fadeElements = document.querySelectorAll('.section');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion && 'IntersectionObserver' in window) {
            fadeElements.forEach(el => el.classList.add('reveal-item'));
            const fadeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        fadeObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0,
                rootMargin: '0px 0px -40px 0px'
            });
            
            fadeElements.forEach(el => fadeObserver.observe(el));
        }
        
        // Animate project metrics
        const metricValues = document.querySelectorAll('.metric-value[data-target]');
        
        metricValues.forEach(metric => {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    const target = parseFloat(metric.getAttribute('data-target'));
                    const suffix = metric.getAttribute('data-suffix') !== null ? metric.getAttribute('data-suffix') : (metric.textContent.includes('%') ? '%' : '');
                    const decimals = parseInt(metric.getAttribute('data-decimals') || '0', 10);
                    const duration = 1500;
                    const startTime = Date.now();
                    
                    const animate = () => {
                        const currentTime = Date.now();
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                        const currentValue = easeOutCubic * target;
                        
                        metric.textContent = currentValue.toFixed(decimals) + suffix;
                        
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            metric.textContent = target.toFixed(decimals) + suffix;
                        }
                    };
                    
                    animate();
                    observer.unobserve(metric);
                }
            });
            
            observer.observe(metric);
        });
    }

    initMobileNav() {
        const toggle = document.getElementById('mobile-nav-toggle');
        const navLinks = document.getElementById('primary-nav');
        if (!toggle || !navLinks) return;

        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            const nextState = !isExpanded;
            toggle.setAttribute('aria-expanded', String(nextState));
            navLinks.classList.toggle('open', nextState);
            document.body.classList.toggle('nav-open', nextState);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                this.closeMobileMenu();
                toggle.focus();
            }
        });

        // Close when clicking outside nav
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open') &&
                !navLinks.contains(e.target) &&
                !toggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        const toggle = document.getElementById('mobile-nav-toggle');
        const navLinks = document.getElementById('primary-nav');
        if (navLinks && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
            document.body.classList.remove('nav-open');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.portfolioApp) {
        // Refresh animations when page becomes visible
        window.portfolioApp.init();
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes any modals (if added later)
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Update active navigation
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (current === 'hero' && href === '#')) {
                link.classList.add('active');
            }
        });
    }, 100);
});

// Add smooth scrolling polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    script.onload = () => smoothscroll.polyfill();
    document.head.appendChild(script);
}

/* ===== Neural Background Animation ===== */
(function initNeuralBackground() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles;

  const MAX_PARTICLES = window.innerWidth < 768 ? 40 : 70;
  const CONNECT_DISTANCE = 120;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
    }

    move() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x <= 0 || this.x >= width) this.vx *= -1;
      if (this.y <= 0 || this.y >= height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99,102,241,0.6)';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from({ length: MAX_PARTICLES }, () => new Particle());
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DISTANCE) {
          ctx.strokeStyle = `rgba(99,102,241,${1 - dist / CONNECT_DISTANCE})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.move();
      p.draw();
    });
    connect();
    requestAnimationFrame(animate);
  }

  // Respect reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    resize();
    initParticles();
    animate();
    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });
  }
})();