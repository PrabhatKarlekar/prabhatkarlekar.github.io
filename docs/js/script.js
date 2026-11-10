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

    prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        if (this.initialized) return;

        try { this.setCurrentYear(); } catch (e) { console.error('Year init:', e); }
        try { this.initThemeToggle(); } catch (e) { console.error('Theme init:', e); }
        try { this.initMobileNav(); } catch (e) { console.error('Mobile nav init:', e); }
        try { this.initNavigation(); } catch (e) { console.error('Nav init:', e); }
        try { this.initAnimations(); } catch (e) { console.error('Animations init:', e); }
        try { this.initContactForm(); } catch (e) { console.error('Contact init:', e); }
        try { this.initScrollAnimations(); } catch (e) { console.error('Scroll anims init:', e); }

        this.initialized = true;
    }

    setCurrentYear() {
        const yearEl = document.getElementById('currentYear');
        if (yearEl) {
            yearEl.textContent = String(new Date().getFullYear());
        }
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        const themeIcon = themeToggle.querySelector('.icon, i');

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = this.getStoredTheme() || (prefersDark.matches ? 'dark' : 'light');

        document.documentElement.setAttribute('data-theme', savedTheme);
        if (themeIcon) this.updateThemeIcon(savedTheme, themeIcon);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            this.setStoredTheme(newTheme);
            if (themeIcon) this.updateThemeIcon(newTheme, themeIcon);
        });

        prefersDark.addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                if (themeIcon) this.updateThemeIcon(newTheme, themeIcon);
            }
        });
    }

    updateThemeIcon(theme, icon) {
        if (icon.tagName.toLowerCase() === 'svg') {
            const useEl = icon.querySelector('use');
            if (useEl) {
                useEl.setAttribute('href', theme === 'dark' ? '#icon-sun' : '#icon-moon');
            }
        } else {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    initNavigation() {
        const aliasMap = {
            projects: 'work',
            skills: 'capabilities',
            education: 'credentials'
        };
        const scrollBehavior = () => (this.prefersReducedMotion() ? 'auto' : 'smooth');

        // Smooth scroll for internal links (supporting legacy anchors)
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
                        behavior: scrollBehavior()
                    });

                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    const activeNavLink = document.querySelector(`.nav-link[href="#${resolvedId}"]`) || anchor;
                    if (activeNavLink && activeNavLink.classList.contains('nav-link')) {
                        activeNavLink.classList.add('active');
                    }

                    if (history.pushState) {
                        history.pushState(null, null, `#${resolvedId}`);
                    }

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
                        behavior: scrollBehavior()
                    });
                }, 150);
            }
        }

        this.initScrollSpy();
    }

    initScrollSpy() {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
        if (!sections.length || !navLinks.length) return;

        let ticking = false;

        const updateActiveSection = () => {
            ticking = false;
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;

            let currentId = sections[0].getAttribute('id');

            // If user reached the bottom of the page, highlight the final section
            if (scrollTop > 0 && winHeight + scrollTop >= docHeight - 40) {
                currentId = sections[sections.length - 1].getAttribute('id');
            } else {
                const offsetThreshold = 140;
                for (const section of sections) {
                    if (section.getBoundingClientRect().top <= offsetThreshold) {
                        currentId = section.getAttribute('id');
                    }
                }
            }

            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${currentId}`;
                link.classList.toggle('active', isActive);
            });
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateActiveSection);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        updateActiveSection();
    }

    initAnimations() {
        const elements = document.querySelectorAll('.timeline-item, .project-card, .capability-card');
        if (!elements.length) return;

        if (this.prefersReducedMotion() || !('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -30px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }

    initContactForm() {
        const copyBtn = document.getElementById('copy-email-btn');
        const textSpan = document.getElementById('copy-email-text');
        if (!copyBtn || !textSpan) return;

        copyBtn.addEventListener('click', async () => {
            const email = 'pritvikarlekar@gmail.com';
            let copied = false;

            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(email);
                    copied = true;
                } catch (e) {
                    // Fall through to execCommand fallback
                }
            }

            if (!copied) {
                try {
                    const tempInput = document.createElement('input');
                    tempInput.value = email;
                    tempInput.setAttribute('readonly', '');
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    copied = document.execCommand('copy');
                    document.body.removeChild(tempInput);
                } catch (e) {
                    copied = false;
                }
            }

            if (copied) {
                const originalText = textSpan.textContent;
                textSpan.textContent = 'Copied to Clipboard!';
                copyBtn.classList.add('btn-copied');

                setTimeout(() => {
                    textSpan.textContent = originalText;
                    copyBtn.classList.remove('btn-copied');
                }, 2000);
            } else {
                window.location.href = `mailto:${email}`;
            }
        });
    }

    initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.section');
        if (!fadeElements.length) return;

        if (!this.prefersReducedMotion() && 'IntersectionObserver' in window) {
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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                this.closeMobileMenu();
                toggle.focus();
            }
        });

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioApp = new PortfolioApp();
    });
} else {
    window.portfolioApp = new PortfolioApp();
}
