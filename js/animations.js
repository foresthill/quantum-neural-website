// Quantum Neural Website - Advanced Animation Controller
// GSAP-based animations with performance optimization

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplitText } from 'gsap/SplitText';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, DrawSVGPlugin, MorphSVGPlugin, SplitText);

class AnimationController {
  constructor() {
    this.animations = new Map();
    this.scrollTriggers = [];
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.fps = 60;
    this.lastTime = 0;
    
    this.init();
  }
  
  init() {
    // Set global GSAP defaults
    gsap.defaults({
      ease: 'power3.out',
      duration: 1
    });
    
    // Initialize animations
    this.setupHeroAnimations();
    this.setupScrollAnimations();
    this.setupMicroInteractions();
    this.setupPerformanceMonitoring();
  }
  
  setupHeroAnimations() {
    // Hero section timeline
    const heroTL = gsap.timeline({
      defaults: { duration: 1.2, ease: 'expo.out' }
    });
    
    // Stagger reveal for hero elements
    heroTL
      .from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
      })
      .from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1.2
      }, '-=0.8')
      .from('.hero-cta', {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, '-=0.5');
    
    // Text scramble effect
    if (!this.isReduced) {
      this.createTextScramble('.hero-title');
    }
    
    // Floating animation for hero elements
    gsap.to('.hero-float', {
      y: -20,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.2,
        from: 'random'
      }
    });
    
    this.animations.set('hero', heroTL);
  }
  
  setupScrollAnimations() {
    // Section reveal animations
    gsap.utils.toArray('.section').forEach((section, index) => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => this.animateSection(section),
        onEnterBack: () => this.animateSection(section),
        once: false
      });
      
      this.scrollTriggers.push(trigger);
    });
    
    // Parallax scrolling with performance optimization
    gsap.utils.toArray('[data-speed]').forEach(element => {
      const speed = parseFloat(element.dataset.speed) || 0.5;
      
      gsap.to(element, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    });
    
    // Progressive reveal for cards
    gsap.utils.toArray('.card').forEach((card, index) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });
    
    // Horizontal scroll sections
    const horizontalSections = gsap.utils.toArray('.horizontal-scroll');
    horizontalSections.forEach(section => {
      const slides = section.querySelectorAll('.slide');
      
      gsap.to(slides, {
        xPercent: -100 * (slides.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          snap: 1 / (slides.length - 1),
          end: () => '+=' + section.offsetWidth
        }
      });
    });
    
    // Sticky elements with dynamic positioning
    gsap.utils.toArray('.sticky-element').forEach(element => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 20%',
        end: 'bottom 80%',
        pin: true,
        pinSpacing: false
      });
    });
  }
  
  animateSection(section) {
    const timeline = gsap.timeline();
    
    // Animate section title
    const title = section.querySelector('.section-title');
    if (title) {
      const splitTitle = new SplitText(title, { type: 'chars,words' });
      timeline.from(splitTitle.chars, {
        opacity: 0,
        y: 50,
        rotateX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });
    }
    
    // Animate section content
    const content = section.querySelectorAll('.animate-in');
    if (content.length) {
      timeline.from(content, {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6
      }, '-=0.4');
    }
    
    // Animate SVG paths
    const svgPaths = section.querySelectorAll('.draw-svg path');
    if (svgPaths.length) {
      timeline.from(svgPaths, {
        drawSVG: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power2.inOut'
      }, '-=0.5');
    }
    
    return timeline;
  }
  
  setupMicroInteractions() {
    // Button hover effects
    document.querySelectorAll('.quantum-btn').forEach(button => {
      const hoverTL = gsap.timeline({ paused: true });
      
      hoverTL
        .to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })
        .to(button.querySelector('.btn-bg'), {
          scale: 1.5,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, 0);
      
      button.addEventListener('mouseenter', () => hoverTL.play());
      button.addEventListener('mouseleave', () => hoverTL.reverse());
    });
    
    // Magnetic cursor effect
    if (!this.isReduced && !('ontouchstart' in window)) {
      this.createMagneticCursor();
    }
    
    // Link underline animations
    document.querySelectorAll('.animated-link').forEach(link => {
      const underline = link.querySelector('.underline') || this.createUnderline(link);
      
      gsap.set(underline, { scaleX: 0, transformOrigin: 'left center' });
      
      link.addEventListener('mouseenter', () => {
        gsap.to(underline, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
      });
      
      link.addEventListener('mouseleave', () => {
        gsap.to(underline, { scaleX: 0, duration: 0.3, ease: 'power2.in' });
      });
    });
    
    // Image reveal on hover
    document.querySelectorAll('.image-reveal').forEach(container => {
      const image = container.querySelector('img');
      const overlay = container.querySelector('.overlay');
      
      const revealTL = gsap.timeline({ paused: true });
      revealTL
        .to(overlay, {
          scaleY: 0,
          duration: 0.6,
          ease: 'power3.inOut'
        })
        .from(image, {
          scale: 1.3,
          duration: 0.6,
          ease: 'power3.out'
        }, 0);
      
      container.addEventListener('mouseenter', () => revealTL.play());
      container.addEventListener('mouseleave', () => revealTL.reverse());
    });
  }
  
  createTextScramble(selector) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      const originalText = element.textContent;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
      
      let iteration = 0;
      const scrambleInterval = setInterval(() => {
        element.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        if (iteration >= originalText.length) {
          clearInterval(scrambleInterval);
        }
        
        iteration += 1 / 3;
      }, 30);
    });
  }
  
  createMagneticCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'magnetic-cursor';
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    const animateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.1;
      cursorY += dy * 0.1;
      
      gsap.set(cursor, {
        x: cursorX,
        y: cursorY
      });
      
      requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
    
    // Magnetic effect on interactive elements
    document.querySelectorAll('.magnetic').forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(element, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3
        });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3
        });
      });
    });
  }
  
  createUnderline(link) {
    const underline = document.createElement('span');
    underline.className = 'underline';
    link.appendChild(underline);
    return underline;
  }
  
  setupPerformanceMonitoring() {
    // FPS monitoring
    const monitorFPS = () => {
      const currentTime = performance.now();
      const delta = currentTime - this.lastTime;
      this.fps = Math.round(1000 / delta);
      this.lastTime = currentTime;
      
      // Reduce animation complexity if FPS drops
      if (this.fps < 30 && !this.isReduced) {
        this.enableReducedMotion();
      }
      
      requestAnimationFrame(monitorFPS);
    };
    
    if (!this.isReduced) {
      monitorFPS();
    }
  }
  
  enableReducedMotion() {
    this.isReduced = true;
    
    // Kill complex animations
    gsap.globalTimeline.getChildren().forEach(animation => {
      if (animation.duration() > 2) {
        animation.kill();
      }
    });
    
    // Simplify scroll triggers
    this.scrollTriggers.forEach(trigger => {
      trigger.vars.scrub = false;
    });
    
    console.log('Performance mode enabled - reducing animation complexity');
  }
  
  // Public methods
  playAnimation(name) {
    const animation = this.animations.get(name);
    if (animation) {
      animation.play();
    }
  }
  
  pauseAnimation(name) {
    const animation = this.animations.get(name);
    if (animation) {
      animation.pause();
    }
  }
  
  refresh() {
    ScrollTrigger.refresh();
  }
  
  destroy() {
    // Clean up all animations and triggers
    this.animations.forEach(animation => animation.kill());
    this.scrollTriggers.forEach(trigger => trigger.kill());
    gsap.globalTimeline.clear();
  }
}

// Intersection Observer for scroll-triggered animations
class ScrollAnimationObserver {
  constructor() {
    this.observedElements = new Map();
    this.observer = null;
    this.init();
  }
  
  init() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.handleIntersection(entry);
      });
    }, options);
    
    // Observe elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(element => {
      this.observe(element);
    });
  }
  
  observe(element) {
    const animationType = element.dataset.animate;
    const delay = parseFloat(element.dataset.animateDelay) || 0;
    const duration = parseFloat(element.dataset.animateDuration) || 1;
    
    this.observedElements.set(element, {
      type: animationType,
      delay,
      duration,
      hasAnimated: false
    });
    
    this.observer.observe(element);
  }
  
  handleIntersection(entry) {
    const element = entry.target;
    const config = this.observedElements.get(element);
    
    if (!config) return;
    
    if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
      if (!config.hasAnimated || element.dataset.animateRepeat === 'true') {
        this.animateElement(element, config);
        config.hasAnimated = true;
      }
    } else if (entry.intersectionRatio === 0 && element.dataset.animateRepeat === 'true') {
      // Reset animation when element is out of view
      gsap.set(element, { clearProps: 'all' });
      config.hasAnimated = false;
    }
  }
  
  animateElement(element, config) {
    const animations = {
      fadeIn: { opacity: 0, y: 30 },
      fadeInUp: { opacity: 0, y: 50 },
      fadeInDown: { opacity: 0, y: -50 },
      fadeInLeft: { opacity: 0, x: -50 },
      fadeInRight: { opacity: 0, x: 50 },
      scaleIn: { opacity: 0, scale: 0.8 },
      rotateIn: { opacity: 0, rotation: 180 },
      flipIn: { opacity: 0, rotationX: 90 },
      slideInLeft: { x: '-100%' },
      slideInRight: { x: '100%' },
      bounceIn: { opacity: 0, scale: 0.3, ease: 'back.out(1.7)' }
    };
    
    const fromVars = animations[config.type] || animations.fadeIn;
    
    gsap.fromTo(element, 
      fromVars,
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        rotationX: 0,
        duration: config.duration,
        delay: config.delay,
        ease: fromVars.ease || 'power3.out',
        clearProps: 'all'
      }
    );
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.animationController = new AnimationController();
  window.scrollObserver = new ScrollAnimationObserver();
  
  // Refresh animations on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      window.animationController.refresh();
    }, 250);
  });
});

// Export for use in other modules
export { AnimationController, ScrollAnimationObserver };