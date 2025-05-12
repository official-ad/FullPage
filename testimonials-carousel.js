// testimonials-carousel.js

// Versión mejorada del carrusel de testimonios con configuraciones y transiciones suaves
class TestimonialsCarousel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) throw new Error(`Container #${containerId} not found.`);

    // Configuración predeterminada
    const defaults = {
      interval: 4000,
      transitionDuration: 600,
      startIndex: 0,
      vertical: true,
      pauseOnHover: true,
      showControls: true,
      showIndicators: true,
    };
    this.settings = { ...defaults, ...options };
    this.items = [];
    this.currentIndex = this.settings.startIndex;
    this.timer = null;

    this._setupCarousel();
    this.show(this.currentIndex);
    this._startAutoScroll();
    this._bindEvents();
  }

  // Carga los datos dinámicamente (puede reemplazarse por fetch API)
  static loadData() {
    return [
      {name: "María P.", city: "Buenos Aires", time: "16:23", text: "¡Excelente experiencia, retiros inmediatos!"},
      {name: "Lucía G.", city: "Córdoba", time: "09:12", text: "Muy fácil de usar y con gran atención."},
      // ... más testimonios
    ];
  }

  _setupCarousel() {
    this.container.classList.add('testimonials-carousel');
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Testimonios de usuarios');

    // Create items
    const data = TestimonialsCarousel.loadData();
    data.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'testimonial-item';
      div.setAttribute('aria-hidden', 'true');
      div.innerHTML = `
        <blockquote>“${item.text}”</blockquote>
        <footer>${item.name}, ${item.city} · <time datetime="${this._getDateTime(item.time)}">${item.time}</time></footer>
      `;
      this.container.appendChild(div);
      this.items.push(div);
    });

    // Indicadores
    if (this.settings.showIndicators) this._createIndicators();
    // Controles
    if (this.settings.showControls) this._createControls();

    // CSS variables para transición
    this.container.style.setProperty('--transition-duration', this.settings.transitionDuration + 'ms');
  }

  _createIndicators() {
    this.indicatorContainer = document.createElement('div');
    this.indicatorContainer.className = 'indicators';
    this.items.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'indicator-btn';
      btn.setAttribute('aria-label', `Mostrar testimonio ${i + 1}`);
      btn.addEventListener('click', () => this.goTo(i));
      this.indicatorContainer.appendChild(btn);
    });
    this.container.appendChild(this.indicatorContainer);
    this.indicators = this.indicatorContainer.querySelectorAll('.indicator-btn');
  }

  _createControls() {
    ['prev', 'next'].forEach(dir => {
      const btn = document.createElement('button');
      btn.className = `control-btn ${dir}`;
      btn.setAttribute('aria-label', dir === 'prev' ? 'Anterior' : 'Siguiente');
      btn.innerHTML = dir === 'prev' ? '&larr;' : '&rarr;';
      btn.addEventListener('click', () => dir === 'prev' ? this.prev() : this.next());
      this.container.appendChild(btn);
    });
  }

  _bindEvents() {
    if (this.settings.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this._stopAutoScroll());
      this.container.addEventListener('mouseleave', () => this._startAutoScroll());
      this.container.addEventListener('touchstart', () => this._stopAutoScroll());
      this.container.addEventListener('touchend', () => this._startAutoScroll());
    }

    // Soporte swipe para móviles
    let startY = 0;
    this.container.addEventListener('touchstart', e => startY = e.touches[0].clientY);
    this.container.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientY - startY;
      if (delta > 50) this.prev();
      else if (delta < -50) this.next();
    });
  }

  _getDateTime(timeStr) {
    const today = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    today.setHours(hours, minutes);
    return today.toISOString();
  }

  _startAutoScroll() {
    this._stopAutoScroll();
    this.timer = setInterval(() => this.next(), this.settings.interval);
  }

  _stopAutoScroll() {
    if (this.timer) clearInterval(this.timer);
  }

  show(index) {
    this.items.forEach((el, i) => {
      const active = i === index;
      el.classList.toggle('active', active);
      el.setAttribute('aria-hidden', !active);
      if (this.indicators) this.indicators[i].classList.toggle('active', active);
    });
    this.currentIndex = index;
  }

  next() {
    this.show((this.currentIndex + 1) % this.items.length);
  }

  prev() {
    this.show((this.currentIndex - 1 + this.items.length) % this.items.length);
  }

  goTo(index) {
    if (index < 0 || index >= this.items.length) return;
    this.show(index);
  }
}

// Inicialización
// new TestimonialsCarousel('testimonialsCarousel', { interval: 5000, transitionDuration: 800 });
