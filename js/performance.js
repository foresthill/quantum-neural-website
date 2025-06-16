// Performance Optimization Module
// Ensures 60fps performance across all devices

class PerformanceOptimizer {
  constructor() {
    this.rafCallbacks = new Map();
    this.rafId = null;
    this.throttledFunctions = new Map();
    this.debouncedFunctions = new Map();
    this.resourceHints = new Set();
    
    this.init();
  }
  
  init() {
    this.setupRAFLoop();
    this.setupLazyLoading();
    this.setupResourceHints();
    this.setupWebWorkers();
    this.monitorPerformance();
  }
  
  // Centralized requestAnimationFrame loop
  setupRAFLoop() {
    const loop = (timestamp) => {
      this.rafCallbacks.forEach((callback, id) => {
        if (callback.active) {
          callback.fn(timestamp);
        }
      });
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
  
  addRAFCallback(id, callback) {
    this.rafCallbacks.set(id, {
      fn: callback,
      active: true
    });
  }
  
  removeRAFCallback(id) {
    this.rafCallbacks.delete(id);
  }
  
  // Throttle function calls
  throttle(fn, delay) {
    const key = fn.toString();
    
    if (!this.throttledFunctions.has(key)) {
      let lastCall = 0;
      
      this.throttledFunctions.set(key, (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          return fn.apply(this, args);
        }
      });
    }
    
    return this.throttledFunctions.get(key);
  }
  
  // Debounce function calls
  debounce(fn, delay) {
    const key = fn.toString();
    
    if (!this.debouncedFunctions.has(key)) {
      let timeoutId;
      
      this.debouncedFunctions.set(key, (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      });
    }
    
    return this.debouncedFunctions.get(key);
  }
  
  // Lazy loading for images and videos
  setupLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.tagName === 'IMG') {
            element.src = element.dataset.lazy;
            element.classList.add('lazy-loaded');
          } else if (element.tagName === 'VIDEO') {
            element.src = element.dataset.lazy;
            element.load();
          } else {
            // Background images
            element.style.backgroundImage = `url(${element.dataset.lazy})`;
            element.classList.add('lazy-loaded');
          }
          
          lazyObserver.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    lazyElements.forEach(element => lazyObserver.observe(element));
  }
  
  // Preload critical resources
  setupResourceHints() {
    // Preconnect to external domains
    const domains = ['https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'];
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
    
    // Prefetch next page resources
    document.querySelectorAll('a[data-prefetch]').forEach(link => {
      link.addEventListener('mouseenter', () => {
        if (!this.resourceHints.has(link.href)) {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = link.href;
          document.head.appendChild(prefetchLink);
          this.resourceHints.add(link.href);
        }
      });
    });
  }
  
  // Web Worker for heavy computations
  setupWebWorkers() {
    if (window.Worker) {
      // Create computation worker
      const workerCode = `
        self.addEventListener('message', (e) => {
          const { type, data } = e.data;
          
          switch(type) {
            case 'calculateParticles':
              const result = calculateParticlePositions(data);
              self.postMessage({ type: 'particlesCalculated', data: result });
              break;
          }
        });
        
        function calculateParticlePositions(params) {
          const positions = [];
          for (let i = 0; i < params.count; i++) {
            positions.push({
              x: Math.cos(i * params.angleStep) * params.radius,
              y: Math.sin(i * params.angleStep) * params.radius,
              z: (Math.random() - 0.5) * params.depth
            });
          }
          return positions;
        }
      `;
      
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
    }
  }
  
  // Performance monitoring
  monitorPerformance() {
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry);
            // Implement adaptive quality reduction
            this.reduceQuality();
          }
        }
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Longtask observer not supported
      }
      
      // Monitor FPS
      let lastTime = performance.now();
      let frames = 0;
      
      const checkFPS = () => {
        frames++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
          const fps = Math.round((frames * 1000) / (currentTime - lastTime));
          
          if (fps < 30) {
            this.reduceQuality();
          } else if (fps > 55) {
            this.increaseQuality();
          }
          
          frames = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(checkFPS);
      };
      
      checkFPS();
    }
  }
  
  reduceQuality() {
    // Reduce particle count
    if (window.quantumUniverse) {
      window.quantumUniverse.particleCount = Math.max(1000, window.quantumUniverse.particleCount * 0.8);
    }
    
    // Disable complex animations
    document.body.classList.add('reduced-motion');
    
    // Lower resolution for WebGL
    if (window.quantumUniverse && window.quantumUniverse.renderer) {
      window.quantumUniverse.renderer.setPixelRatio(1);
    }
  }
  
  increaseQuality() {
    // Restore quality if performance improves
    document.body.classList.remove('reduced-motion');
    
    if (window.quantumUniverse && window.quantumUniverse.renderer) {
      window.quantumUniverse.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }
  
  // Utility functions
  measureExecutionTime(fn, label = 'Function') {
    return (...args) => {
      const start = performance.now();
      const result = fn.apply(this, args);
      const end = performance.now();
      console.log(`${label} took ${end - start}ms`);
      return result;
    };
  }
  
  // Clean up
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.worker) {
      this.worker.terminate();
    }
  }
}

// Mobile-specific optimizations
class MobileOptimizer {
  constructor() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isLowEnd = this.detectLowEndDevice();
    
    if (this.isMobile) {
      this.init();
    }
  }
  
  init() {
    this.optimizeTouchEvents();
    this.reduceAnimations();
    this.optimizeImages();
    this.enableHardwareAcceleration();
  }
  
  detectLowEndDevice() {
    // Check for low-end device indicators
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        // Check for common low-end GPUs
        return /Mali-4|Adreno 3|PowerVR SGX/.test(renderer);
      }
    }
    
    // Fallback: check device memory
    return navigator.deviceMemory && navigator.deviceMemory < 4;
  }
  
  optimizeTouchEvents() {
    // Add passive listeners for better scroll performance
    const passiveSupported = (() => {
      let passive = false;
      try {
        const options = {
          get passive() {
            passive = true;
            return false;
          }
        };
        window.addEventListener('test', null, options);
        window.removeEventListener('test', null, options);
      } catch (err) {}
      return passive;
    })();
    
    const passiveOptions = passiveSupported ? { passive: true } : false;
    
    // Convert touch events to passive
    document.addEventListener('touchstart', () => {}, passiveOptions);
    document.addEventListener('touchmove', () => {}, passiveOptions);
    
    // Disable hover effects on touch
    document.addEventListener('touchstart', () => {
      document.body.classList.add('touch-device');
    });
  }
  
  reduceAnimations() {
    if (this.isLowEnd) {
      // Add class for CSS to target
      document.body.classList.add('low-end-device');
      
      // Reduce particle count significantly
      if (window.quantumUniverse) {
        window.quantumUniverse.particleCount = 1000;
      }
      
      // Disable complex CSS animations
      const style = document.createElement('style');
      style.textContent = `
        .low-end-device * {
          animation-duration: 0s !important;
          transition-duration: 0.1s !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  optimizeImages() {
    // Use lower resolution images on mobile
    document.querySelectorAll('img[data-mobile-src]').forEach(img => {
      img.src = img.dataset.mobileSrc;
    });
    
    // Convert to WebP if supported
    if (this.supportsWebP()) {
      document.querySelectorAll('img[data-webp]').forEach(img => {
        img.src = img.dataset.webp;
      });
    }
  }
  
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  }
  
  enableHardwareAcceleration() {
    // Force GPU acceleration for transforms
    const elements = document.querySelectorAll('.accelerate');
    elements.forEach(el => {
      el.style.transform = 'translateZ(0)';
      el.style.willChange = 'transform';
    });
  }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
  window.performanceOptimizer = new PerformanceOptimizer();
  window.mobileOptimizer = new MobileOptimizer();
});

export { PerformanceOptimizer, MobileOptimizer };