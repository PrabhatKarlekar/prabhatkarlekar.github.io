// Main Portfolio JavaScript
class PortfolioApp {
    constructor() {
        this.initialized = false;
        this.init();
    }
    init() {
        if (this.initialized) return;
        
        // Set current year
        this.setCurrentYear();
        
        // Initialize components
        this.initThemeToggle();
        this.initNeuronAnimation();
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
        
        this.initialized = true;
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
            this.updateNeuronColor(newTheme);
        });
        
        // Listen for system theme changes
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                this.updateThemeIcon(newTheme, themeIcon);
                this.updateNeuronColor(newTheme);
            }
        });
    }
    updateThemeIcon(theme, icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    initNeuronAnimation() {
        const canvas = document.getElementById('neuron-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        // Resize canvas
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        // Neuron nodes
        const nodes = [];
        const numNodes = 50;
        const connectionDistance = 150;
        
        class Node {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 3 + 1;
                this.vx = Math.random() * 0.5 - 0.25;
                this.vy = Math.random() * 0.5 - 0.25;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
                ctx.fill();
            }
        }
        
        // Create nodes
        for (let i = 0; i < numNodes; i++) {
            nodes.push(new Node());
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            // Update and draw nodes
            nodes.forEach(node => {
                node.update();
                node.draw();
            });
            
            animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
        
        // Handle visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animate();
            }
        });
        
        // Theme update for neurons
        this.updateNeuronColor = (theme) => {
            // Adjust colors if needed for light theme
            if (theme === 'light') {
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
                nodes.forEach(node => node.fillStyle = 'rgba(59, 130, 246, 0.6)');
            } else {
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
                nodes.forEach(node => node.fillStyle = 'rgba(59, 130, 246, 0.8)');
            }
        };
        
        this.updateNeuronColor(document.documentElement.getAttribute('data-theme'));
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
                    
                    // Close mobile menu
                    this.closeMobileMenu();
                }
            });
        });
        
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
        
        // Update active nav on scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinksAll = document.querySelectorAll('.nav-link');
        
        const updateActiveNav = () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}` || (current === 'hero' && href === '#hero')) {
                    link.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav();
    }
    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.getElementById('menu-toggle');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        }
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
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.getElementById('menu-toggle');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
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
        new PortfolioApp();
    }
});
// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('active')) {
            portfolioApp.closeMobileMenu();
        }
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