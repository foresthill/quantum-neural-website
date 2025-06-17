// About Page Specific JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Number Counter Animation
    const animateNumbers = () => {
        const numberElements = document.querySelectorAll('[data-count]');
        
        numberElements.forEach(element => {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current).toLocaleString() + element.textContent.replace(/[0-9,]/g, '');
                    requestAnimationFrame(updateNumber);
                } else {
                    element.textContent = target.toLocaleString() + element.textContent.replace(/[0-9,]/g, '');
                }
            };
            
            // Start animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateNumber();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    };
    
    animateNumbers();
    
    // Enhanced Scroll Animations
    const scrollElements = document.querySelectorAll('.philosophy-card, .stat-card, .leader-card, .culture-card, .value-item');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Add initial styles for scroll animation
    scrollElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
    });
    
    // Add scrolled class styles
    const style = document.createElement('style');
    style.textContent = `
        .scrolled {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Trigger animations
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initial check
    handleScrollAnimation();
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.about-hero');
    const heroContent = document.querySelector('.hero-content-about');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (heroSection) {
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            heroContent.style.opacity = 1 - (scrolled / 600);
        }
    });
    
    // Interactive hover effects for leader cards
    const leaderCards = document.querySelectorAll('.leader-card');
    
    leaderCards.forEach(card => {
        const ring = card.querySelector('.quantum-ring');
        
        card.addEventListener('mouseenter', () => {
            ring.style.animationDuration = '10s';
            ring.style.opacity = '0.5';
        });
        
        card.addEventListener('mouseleave', () => {
            ring.style.animationDuration = '20s';
            ring.style.opacity = '0.3';
        });
    });
    
    // Timeline animation for values section
    const valueItems = document.querySelectorAll('.value-item');
    const timelineLine = document.querySelector('.timeline-line');
    
    if (timelineLine) {
        // Create gradient animation for timeline
        let gradient = 0;
        
        const animateTimeline = () => {
            gradient += 1;
            timelineLine.style.background = `linear-gradient(to bottom, 
                var(--primary-color) ${gradient}%, 
                var(--secondary-color) ${gradient + 50}%, 
                transparent ${gradient + 100}%)`;
            
            if (gradient < 100) {
                requestAnimationFrame(animateTimeline);
            }
        };
        
        // Start timeline animation when in view
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateTimeline();
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        if (document.querySelector('.values-timeline')) {
            timelineObserver.observe(document.querySelector('.values-timeline'));
        }
    }
    
    // Smooth hover transitions for cards
    const addSmoothHover = (selector) => {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
    };
    
    addSmoothHover('.philosophy-card');
    addSmoothHover('.stat-card');
    addSmoothHover('.culture-card');
    
    // Quantum particles for light background
    class LightQuantumParticles {
        constructor() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            
            this.init();
        }
        
        init() {
            const quantumBg = document.getElementById('quantum-bg-light');
            if (!quantumBg) return;
            
            quantumBg.appendChild(this.canvas);
            this.resize();
            
            // Create fewer, lighter particles
            for (let i = 0; i < 20; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.3 + 0.1
                });
            }
            
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }
        
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(79, 70, 229, ${particle.opacity})`;
                this.ctx.fill();
            });
            
            requestAnimationFrame(() => this.animate());
        }
    }
    
    // Initialize light quantum particles
    new LightQuantumParticles();
});