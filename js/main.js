// Quantum Neural Website - Main Interactive Features
// Three.js Quantum Flow Universe Implementation

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

class QuantumFlowUniverse {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.particles = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.time = 0;
    this.isInitialized = false;
    
    // Performance settings
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.particleCount = this.isMobile ? 5000 : 15000;
    
    this.init();
  }
  
  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.createQuantumParticles();
    this.setupPostProcessing();
    this.setupEventListeners();
    this.animate();
    this.isInitialized = true;
  }
  
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 2;
    this.container.appendChild(this.renderer.domElement);
  }
  
  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;
  }
  
  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight.position.set(0, 0, 20);
    this.scene.add(pointLight);
  }
  
  createQuantumParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);
    const phases = new Float32Array(this.particleCount);
    
    // Quantum color palette
    const colorPalette = [
      new THREE.Color(0x00ffff), // Cyan
      new THREE.Color(0xff00ff), // Magenta
      new THREE.Color(0x00ff00), // Green
      new THREE.Color(0xffff00), // Yellow
      new THREE.Color(0xff0080)  // Pink
    ];
    
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Spiral galaxy distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 40 + 10;
      const height = (Math.random() - 0.5) * 20;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius;
      
      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 2 + 0.5;
      phases[i] = Math.random() * Math.PI * 2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    
    const vertexShader = `
      attribute float size;
      attribute float phase;
      varying vec3 vColor;
      uniform float time;
      
      void main() {
        vColor = color;
        vec3 pos = position;
        
        // Quantum fluctuation
        float quantumOffset = sin(time * 0.5 + phase) * 2.0;
        pos.y += quantumOffset;
        
        // Spiral rotation
        float angle = time * 0.1 + phase;
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        pos.xz = rot * pos.xz;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    
    const fragmentShader = `
      varying vec3 vColor;
      uniform float time;
      
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        
        if (dist > 0.5) discard;
        
        // Quantum glow effect
        float glow = 1.0 - dist * 2.0;
        glow = pow(glow, 2.0);
        
        // Pulsating brightness
        float pulse = sin(time * 2.0) * 0.2 + 0.8;
        
        gl_FragColor = vec4(vColor * glow * pulse, glow);
      }
    `;
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }
  
  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    this.composer.addPass(bloomPass);
  }
  
  setupEventListeners() {
    // Mouse movement
    document.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Touch movement for mobile
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.targetMouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.composer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.time += 0.01;
    
    // Smooth mouse movement
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    
    // Camera movement based on mouse
    this.camera.position.x = this.mouseX * 20;
    this.camera.position.y = this.mouseY * 10;
    this.camera.lookAt(this.scene.position);
    
    // Update shader uniforms
    if (this.particles) {
      this.particles.material.uniforms.time.value = this.time;
      this.particles.rotation.y = this.time * 0.05;
    }
    
    // Render
    this.composer.render();
  }
  
  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

// Smooth Scroll Controller
class SmoothScrollController {
  constructor() {
    this.currentScroll = 0;
    this.targetScroll = 0;
    this.scrollSpeed = 0.1;
    this.isScrolling = false;
    
    this.init();
  }
  
  init() {
    // Disable default scroll behavior
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Setup scroll listener
    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.targetScroll += e.deltaY * 0.5;
      this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.getMaxScroll()));
    }, { passive: false });
    
    // Touch scroll for mobile
    let touchStart = 0;
    window.addEventListener('touchstart', (e) => {
      touchStart = e.touches[0].clientY;
    });
    
    window.addEventListener('touchmove', (e) => {
      const touchDelta = touchStart - e.touches[0].clientY;
      this.targetScroll += touchDelta * 0.5;
      this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.getMaxScroll()));
      touchStart = e.touches[0].clientY;
    });
    
    this.animate();
  }
  
  getMaxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }
  
  animate() {
    this.currentScroll += (this.targetScroll - this.currentScroll) * this.scrollSpeed;
    
    if (Math.abs(this.targetScroll - this.currentScroll) > 0.1) {
      window.scrollTo(0, this.currentScroll);
      this.isScrolling = true;
    } else {
      this.isScrolling = false;
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Parallax Controller
class ParallaxController {
  constructor() {
    this.elements = [];
    this.init();
  }
  
  init() {
    // Find all parallax elements
    document.querySelectorAll('[data-parallax]').forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      this.elements.push({ element, speed });
    });
    
    // Setup scroll listener
    window.addEventListener('scroll', () => this.updateParallax());
    this.updateParallax();
  }
  
  updateParallax() {
    const scrolled = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    this.elements.forEach(({ element, speed }) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrolled;
      const elementHeight = rect.height;
      
      // Check if element is in viewport
      if (elementTop + elementHeight >= scrolled && elementTop <= scrolled + viewportHeight) {
        const yPos = -(scrolled - elementTop) * speed;
        element.style.transform = `translateY(${yPos}px)`;
      }
    });
  }
}

// Dynamic Content Loader
class DynamicContentLoader {
  constructor() {
    this.loadedSections = new Set();
    this.init();
  }
  
  init() {
    this.observeElements();
  }
  
  observeElements() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.loadedSections.has(entry.target.id)) {
          this.loadContent(entry.target);
          this.loadedSections.add(entry.target.id);
        }
      });
    }, options);
    
    document.querySelectorAll('[data-dynamic-content]').forEach(element => {
      observer.observe(element);
    });
  }
  
  async loadContent(element) {
    const contentType = element.dataset.dynamicContent;
    
    // Simulate content loading with animations
    element.classList.add('loading');
    
    // Add content based on type
    switch (contentType) {
      case 'stats':
        this.loadStats(element);
        break;
      case 'portfolio':
        this.loadPortfolio(element);
        break;
      case 'testimonials':
        this.loadTestimonials(element);
        break;
    }
    
    // Reveal animation
    setTimeout(() => {
      element.classList.remove('loading');
      element.classList.add('loaded');
    }, 500);
  }
  
  loadStats(element) {
    const stats = [
      { label: 'Projects Completed', value: 150, suffix: '+' },
      { label: 'Happy Clients', value: 98, suffix: '%' },
      { label: 'Team Members', value: 25, suffix: '' },
      { label: 'Years Experience', value: 10, suffix: '+' }
    ];
    
    const statsHTML = stats.map(stat => `
      <div class="stat-item" data-value="${stat.value}">
        <div class="stat-number">0${stat.suffix}</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `).join('');
    
    element.innerHTML = statsHTML;
    
    // Animate numbers
    setTimeout(() => {
      element.querySelectorAll('.stat-item').forEach(item => {
        const value = parseInt(item.dataset.value);
        const suffix = item.querySelector('.stat-number').textContent.replace('0', '');
        animateValue(item.querySelector('.stat-number'), 0, value, 2000, suffix);
      });
    }, 100);
  }
  
  loadPortfolio(element) {
    // Portfolio grid implementation
    const portfolioItems = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      title: `Project ${i + 1}`,
      category: ['Web Design', 'Development', 'Branding'][i % 3]
    }));
    
    const portfolioHTML = portfolioItems.map(item => `
      <div class="portfolio-item" data-category="${item.category}">
        <div class="portfolio-image"></div>
        <div class="portfolio-info">
          <h3>${item.title}</h3>
          <p>${item.category}</p>
        </div>
      </div>
    `).join('');
    
    element.innerHTML = portfolioHTML;
  }
  
  loadTestimonials(element) {
    // Testimonials carousel
    const testimonials = [
      { text: 'Amazing work! Exceeded our expectations.', author: 'John Doe', position: 'CEO, TechCorp' },
      { text: 'Innovative solutions and great support.', author: 'Jane Smith', position: 'CTO, StartupXYZ' },
      { text: 'Best development team we\'ve worked with.', author: 'Mike Johnson', position: 'Director, BigCo' }
    ];
    
    const testimonialsHTML = `
      <div class="testimonials-carousel">
        ${testimonials.map((item, i) => `
          <div class="testimonial ${i === 0 ? 'active' : ''}" data-index="${i}">
            <blockquote>"${item.text}"</blockquote>
            <cite>- ${item.author}, ${item.position}</cite>
          </div>
        `).join('')}
      </div>
    `;
    
    element.innerHTML = testimonialsHTML;
  }
}

// Utility function to animate numbers
function animateValue(element, start, end, duration, suffix = '') {
  const startTime = performance.now();
  
  function updateValue(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);
    
    element.textContent = current + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(updateValue);
    }
  }
  
  requestAnimationFrame(updateValue);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Quantum Flow Universe
  const canvas = document.getElementById('quantum-canvas');
  if (canvas) {
    window.quantumUniverse = new QuantumFlowUniverse(canvas);
  }
  
  // Initialize smooth scroll
  window.smoothScroll = new SmoothScrollController();
  
  // Initialize parallax
  window.parallax = new ParallaxController();
  
  // Initialize dynamic content loader
  window.contentLoader = new DynamicContentLoader();
  
  // Performance monitoring
  if (window.performance && performance.mark) {
    performance.mark('quantum-neural-website-loaded');
  }
});

// Export for use in other modules
export { QuantumFlowUniverse, SmoothScrollController, ParallaxController, DynamicContentLoader };