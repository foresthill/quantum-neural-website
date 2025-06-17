// Achievements Page - Interactive Features
// 3D visualization, animations, and filtering

import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 3D Achievement Visualizer
class AchievementVisualizer {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.icons = new Map();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectedObject = null;
    
    this.init();
  }
  
  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.create3DIcons();
    this.setupEventListeners();
    this.animate();
  }
  
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);
  }
  
  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 15);
  }
  
  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    this.scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00ffff, 2, 50);
    pointLight1.position.set(10, 10, 10);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    this.scene.add(pointLight2);
  }
  
  create3DIcons() {
    const iconTypes = ['city', 'quantum', 'medical'];
    const positions = [
      { x: -5, y: 3, z: 0 },
      { x: 0, y: -2, z: 2 },
      { x: 5, y: 1, z: -1 }
    ];
    
    iconTypes.forEach((type, index) => {
      const icon = this.createIcon(type);
      icon.position.set(positions[index].x, positions[index].y, positions[index].z);
      this.scene.add(icon);
      this.icons.set(type, icon);
      
      // Floating animation
      gsap.to(icon.position, {
        y: positions[index].y + 0.5,
        duration: 2 + Math.random(),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
      
      // Rotation animation
      gsap.to(icon.rotation, {
        y: Math.PI * 2,
        duration: 10 + Math.random() * 5,
        ease: 'none',
        repeat: -1
      });
    });
  }
  
  createIcon(type) {
    const group = new THREE.Group();
    
    // Outer glow sphere
    const glowGeometry = new THREE.SphereGeometry(2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: type === 'city' ? 0x00ffff : type === 'quantum' ? 0xff00ff : 0x00ff00,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.scale.set(1.5, 1.5, 1.5);
    group.add(glow);
    
    // Core geometry based on type
    let geometry;
    switch(type) {
      case 'city':
        geometry = new THREE.BoxGeometry(2, 2, 2);
        break;
      case 'quantum':
        geometry = new THREE.OctahedronGeometry(1.5);
        break;
      case 'medical':
        geometry = new THREE.TetrahedronGeometry(1.5);
        break;
      default:
        geometry = new THREE.SphereGeometry(1.5);
    }
    
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: type === 'city' ? 0x00ffff : type === 'quantum' ? 0xff00ff : 0x00ff00,
      emissiveIntensity: 0.5,
      shininess: 100,
      transparent: true,
      opacity: 0.8
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    
    // Wireframe overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    wireframe.scale.set(1.1, 1.1, 1.1);
    group.add(wireframe);
    
    group.userData = { type };
    return group;
  }
  
  setupEventListeners() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }
  
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Camera follow mouse slightly
    gsap.to(this.camera.position, {
      x: this.mouse.x * 2,
      y: this.mouse.y * 2,
      duration: 0.5,
      ease: 'power2.out'
    });
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    
    if (intersects.length > 0) {
      const object = intersects[0].object.parent;
      if (object !== this.selectedObject) {
        if (this.selectedObject) {
          gsap.to(this.selectedObject.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        }
        this.selectedObject = object;
        gsap.to(object.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3 });
      }
    } else if (this.selectedObject) {
      gsap.to(this.selectedObject.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      this.selectedObject = null;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  destroy() {
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}

// Project Card 3D Rotation
class ProjectCard3D {
  constructor() {
    this.cards = document.querySelectorAll('.project-card');
    this.init();
  }
  
  init() {
    this.cards.forEach((card, index) => {
      const cardInner = card.querySelector('.card-inner');
      let isFlipped = false;
      
      // Mouse movement effect
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        if (!isFlipped) {
          gsap.to(cardInner, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 1000
          });
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (!isFlipped) {
          gsap.to(cardInner, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      });
      
      // Click to flip
      card.addEventListener('click', () => {
        isFlipped = !isFlipped;
        gsap.to(cardInner, {
          rotationY: isFlipped ? 180 : 0,
          duration: 0.8,
          ease: 'power2.inOut'
        });
      });
      
      // Initial reveal animation
      gsap.from(card, {
        scale: 0,
        rotation: 180,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          once: true
        }
      });
    });
  }
}

// Count Up Animation
class CountUpAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat-orb');
    this.hasAnimated = false;
    this.init();
  }
  
  init() {
    ScrollTrigger.create({
      trigger: '.floating-stats',
      start: 'top 80%',
      onEnter: () => {
        if (!this.hasAnimated) {
          this.animateCounters();
          this.hasAnimated = true;
        }
      }
    });
  }
  
  animateCounters() {
    this.counters.forEach((counter, index) => {
      const target = parseInt(counter.dataset.value);
      const numberElement = counter.querySelector('.stat-number');
      
      // Animate orb entrance
      gsap.from(counter, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'elastic.out(1, 0.5)'
      });
      
      // Count up animation
      const countUp = { value: 0 };
      gsap.to(countUp, {
        value: target,
        duration: 2,
        delay: index * 0.2,
        ease: 'power2.out',
        onUpdate: () => {
          numberElement.textContent = Math.floor(countUp.value);
        },
        onComplete: () => {
          // Add glow pulse
          gsap.to(counter, {
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.8)',
            duration: 0.5,
            yoyo: true,
            repeat: 1
          });
        }
      });
    });
  }
}

// Timeline Animation
class TimelineAnimation {
  constructor() {
    this.timeline = document.querySelector('.quantum-timeline');
    this.path = document.querySelector('.quantum-path');
    this.events = document.querySelectorAll('.timeline-event');
    this.init();
  }
  
  init() {
    // Draw timeline path
    const pathLength = this.path.getTotalLength();
    this.path.style.strokeDasharray = pathLength;
    this.path.style.strokeDashoffset = pathLength;
    
    gsap.to(this.path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: this.timeline,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1
      }
    });
    
    // Animate timeline events
    this.events.forEach((event, index) => {
      const orb = event.querySelector('.event-orb');
      const content = event.querySelector('.event-content');
      
      // Create quantum particle effect
      this.createParticleEffect(orb);
      
      // Animate event entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: event,
          start: 'top 80%',
          once: true
        }
      });
      
      tl.from(orb, {
        scale: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      })
      .from(content, {
        opacity: 0,
        x: event.classList.contains('right') ? 100 : -100,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.3');
    });
  }
  
  createParticleEffect(orb) {
    const particleCount = 6;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'quantum-particle';
      orb.appendChild(particle);
      
      // Random animation parameters
      const angle = (360 / particleCount) * i;
      const distance = 50 + Math.random() * 30;
      const duration = 2 + Math.random() * 2;
      
      gsap.set(particle, {
        rotation: angle
      });
      
      gsap.to(particle, {
        x: Math.cos(angle * Math.PI / 180) * distance,
        y: Math.sin(angle * Math.PI / 180) * distance,
        scale: 0,
        opacity: 0,
        duration: duration,
        ease: 'power2.out',
        repeat: -1,
        delay: Math.random() * duration
      });
    }
  }
}

// Filter System
class FilterSystem {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.projectCards = document.querySelectorAll('.project-card');
    this.activeFilter = 'all';
    this.init();
  }
  
  init() {
    this.filterButtons.forEach(button => {
      // Add glow effect on hover
      button.addEventListener('mouseenter', () => {
        gsap.to(button.querySelector('.btn-glow'), {
          scale: 1.5,
          opacity: 0.5,
          duration: 0.3
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button.querySelector('.btn-glow'), {
          scale: 1,
          opacity: 0,
          duration: 0.3
        });
      });
      
      // Filter functionality
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        this.setActiveFilter(filter);
        this.filterProjects(filter);
      });
    });
  }
  
  setActiveFilter(filter) {
    this.filterButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.filter === filter) {
        btn.classList.add('active');
        
        // Pulse effect on activation
        gsap.to(btn, {
          scale: 1.1,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      }
    });
    
    this.activeFilter = filter;
  }
  
  filterProjects(filter) {
    this.projectCards.forEach((card, index) => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category === filter;
      
      if (shouldShow) {
        gsap.to(card, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: index * 0.05,
          ease: 'power2.out',
          onStart: () => {
            card.style.pointerEvents = 'auto';
          }
        });
      } else {
        gsap.to(card, {
          opacity: 0.3,
          scale: 0.9,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            card.style.pointerEvents = 'none';
          }
        });
      }
    });
  }
}

// Award Badge Holographic Effect
class HolographicBadges {
  constructor() {
    this.badges = document.querySelectorAll('.award-badge');
    this.init();
  }
  
  init() {
    this.badges.forEach((badge, index) => {
      // Create holographic shimmer
      const shimmer = document.createElement('div');
      shimmer.className = 'holographic-shimmer';
      badge.appendChild(shimmer);
      
      // Floating animation
      gsap.to(badge, {
        y: -10,
        duration: 2 + Math.random(),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: index * 0.2
      });
      
      // Rotation animation
      gsap.to(badge, {
        rotationY: 360,
        duration: 8,
        ease: 'none',
        repeat: -1
      });
      
      // Shimmer effect
      gsap.to(shimmer, {
        backgroundPosition: '200% 50%',
        duration: 3,
        ease: 'none',
        repeat: -1
      });
      
      // Interactive hover
      badge.addEventListener('mouseenter', () => {
        gsap.to(badge, {
          scale: 1.2,
          rotationX: 15,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      badge.addEventListener('mouseleave', () => {
        gsap.to(badge, {
          scale: 1,
          rotationX: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }
}

// Client Logo Carousel
class ClientCarousel {
  constructor() {
    this.track = document.querySelector('.clients-track');
    this.logos = document.querySelectorAll('.client-logo');
    this.init();
  }
  
  init() {
    // Clone logos for infinite scroll
    this.logos.forEach(logo => {
      const clone = logo.cloneNode(true);
      this.track.appendChild(clone);
    });
    
    // Continuous scroll animation
    const totalWidth = this.logos.length * 220; // logo width + gap
    
    gsap.to(this.track, {
      x: -totalWidth,
      duration: 20,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });
    
    // Hover pause
    this.track.addEventListener('mouseenter', () => {
      gsap.to(this.track, { timeScale: 0, duration: 0.3 });
    });
    
    this.track.addEventListener('mouseleave', () => {
      gsap.to(this.track, { timeScale: 1, duration: 0.3 });
    });
  }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  // Hide loading screen
  setTimeout(() => {
    gsap.to('.loading-screen', {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        document.querySelector('.loading-screen').style.display = 'none';
      }
    });
  }, 1000);
  
  // Initialize 3D visualizer
  const canvas = document.getElementById('achievements-canvas');
  if (canvas) {
    window.achievementVisualizer = new AchievementVisualizer(canvas);
  }
  
  // Initialize components
  window.projectCards = new ProjectCard3D();
  window.countUp = new CountUpAnimation();
  window.timeline = new TimelineAnimation();
  window.filterSystem = new FilterSystem();
  window.badges = new HolographicBadges();
  window.carousel = new ClientCarousel();
  
  // Page transition animation
  gsap.from('.achievements-hero', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out'
  });
});

// Export for external use
export {
  AchievementVisualizer,
  ProjectCard3D,
  CountUpAnimation,
  TimelineAnimation,
  FilterSystem,
  HolographicBadges,
  ClientCarousel
};