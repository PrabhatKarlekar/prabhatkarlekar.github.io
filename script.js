// Main Portfolio JavaScript
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        // Set current year
        this.setCurrentYear();
        
        // Initialize components
        this.initThemeToggle();
        this.initParticles();
        this.initNavigation();
        this.initAnimations();
        this.initContactForm();
        this.initTypewriter();
        this.initScrollAnimations();
        
        // Initial animations
        setTimeout(() => {
            this.animateStats();
            this.animateSkillBars();
        }, 1000);
    }

    setCurrentYear() {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('i');
        
        // Check for saved theme or prefer-color-scheme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('theme') || 
            (prefersDark.matches ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme, themeIcon);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme, themeIcon);
        });
        
        // Listen for system theme changes
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                this.updateThemeIcon(newTheme, themeIcon);
            }
        });
    }

    updateThemeIcon(theme, icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId = null;
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = document.documentElement.getAttribute('data-theme') === 'dark' 
                    ? 'rgba(59, 130, 246, 0.5)' 
                    : 'rgba(59, 130, 246, 0.3)';
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Create particles
        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(100, Math.floor(canvas.width * canvas.height / 15000));
            
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        
        // Connect particles
        const connectParticles = () => {
            const maxDistance = 100;
            
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'dark'
                            ? `rgba(59, 130, 246, ${0.2 * (1 - distance / maxDistance)})`
                            : `rgba(59, 130, 246, ${0.1 * (1 - distance / maxDistance)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            connectParticles();
            animationId = requestAnimationFrame(animate);
        };
        
        // Initialize and start
        initParticles();
        animate();
        
        // Handle theme changes
        const observer = new MutationObserver(() => {
            particles.forEach(particle => {
                particle.color = document.documentElement.getAttribute('data-theme') === 'dark'
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'rgba(59, 130, 246, 0.3)';
            });
        });
        
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        
        // Cleanup on page hide
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    initNavigation() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '#hero') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    anchor.classList.add('active');
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
        
        // Update active nav on scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const updateActiveNav = () => {
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
        };
        
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav(); // Initial call
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
        const form = document.getElementById('quickContactForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const formValues = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', formValues);
            
            // Show success message
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                form.reset();
            }, 3000);
        });
    }

    initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter, .typewriter-delay, .typewriter-delay-2');
        
        typewriterElements.forEach((el, index) => {
            const text = el.getAttribute('data-text') || el.textContent;
            el.textContent = '';
            el.style.borderRight = '2px solid var(--accent-primary)';
            
            let i = 0;
            const speed = 50;
            const delay = index * 1000; // Stagger animations
            
            setTimeout(() => {
                const type = () => {
                    if (i < text.length) {
                        el.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, speed);
                    } else {
                        // Remove cursor after typing
                        setTimeout(() => {
                            el.style.borderRight = 'none';
                        }, 1000);
                    }
                };
                type();
            }, delay);
        });
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.textContent.includes('%') ? '%' : '';
            const duration = 2000; // 2 seconds
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
                }
            };
            
            animate();
        });
    }

    animateSkillBars() {
        const skillProgresses = document.querySelectorAll('.skill-progress');
        
        skillProgresses.forEach(progress => {
            const level = parseInt(progress.getAttribute('data-level'));
            const duration = 1500;
            const startTime = Date.now();
            
            const animate = () => {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const currentProgress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutCubic = 1 - Math.pow(1 - currentProgress, 3);
                
                const currentWidth = easeOutCubic * level;
                progress.style.width = `${currentWidth}%`;
                
                if (currentProgress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            // Start animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animate();
                    observer.unobserve(progress);
                }
            });
            
            observer.observe(progress);
        });
    }

    initScrollAnimations() {
        // Add parallax effect to floating card
        const floatingCard = document.querySelector('.floating-card');
        
        if (floatingCard) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.1;
                floatingCard.style.transform = `translateY(${rate}px)`;
            });
        }
        
        // Add fade-in animation for sections
        const fadeElements = document.querySelectorAll('.section');
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeObserver.observe(el);
        });
    }

    closeMobileMenu() {
        // If you add a mobile menu later, implement this
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh animations when page becomes visible
        const portfolioApp = new PortfolioApp();
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
    
    // Tab key navigation for accessibility
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse click
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add smooth scrolling polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    import('https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
        .then(() => {
            // Polyfill loaded
        });
}
