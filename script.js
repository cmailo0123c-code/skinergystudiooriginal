/* ============================================================
   SKINERGY — PREMIUM MOTION SYSTEM
   Vanilla JS, sin dependencias. Todo respeta prefers-reduced-motion.
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
const prefersFullMotion = !reduceMotion && hasFinePointer;

/* ---------- 1. TEXT MOTION — reveal por línea + palabra ----------
   Envuelve cada <br>-línea de un heading en una "máscara" (overflow:hidden)
   y cada palabra dentro en su propio span, para poder animarlas con
   stagger (línea → palabra) sin romper <em>/<b> anidados. */
function wrapWordsIn(root){
  function walk(node){
    if(node.nodeType === 3){
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if(part.trim() === ''){
          frag.appendChild(document.createTextNode(part));
        } else {
          const w = document.createElement('span');
          w.className = 'word';
          const wi = document.createElement('span');
          wi.className = 'word-inner';
          wi.textContent = part;
          w.appendChild(wi);
          frag.appendChild(w);
        }
      });
      node.replaceWith(frag);
    } else if(node.nodeType === 1){
      Array.from(node.childNodes).forEach(walk);
    }
  }
  Array.from(root.childNodes).forEach(walk);
  let i = 0;
  root.querySelectorAll('.word-inner').forEach(w => { w.style.setProperty('--i', i++); });
}

function splitTextMotion(el){
  if(!el || el.dataset.split) return;
  el.dataset.split = '1';
  el.classList.remove('reveal', 'load-reveal', 'in');
  const html = el.innerHTML;
  const lines = html.split(/<br\s*\/?>/i);
  el.innerHTML = '';
  lines.forEach((chunk, li) => {
    const mask = document.createElement('span');
    mask.className = 'line-mask';
    const inner = document.createElement('span');
    inner.className = 'line-inner';
    inner.style.setProperty('--li', li);
    inner.innerHTML = chunk;
    wrapWordsIn(inner);
    mask.appendChild(inner);
    el.appendChild(mask);
  });
}

function initTextMotion(){
  const heroHeadings = document.querySelectorAll('.hero h1, .page-hero h1');
  const sectionHeadings = document.querySelectorAll('.section-head h2, .quote-wrap blockquote');

  heroHeadings.forEach(splitTextMotion);
  sectionHeadings.forEach(splitTextMotion);

  // Hero: revela apenas carga la página (parte del "cinematic intro")
  heroHeadings.forEach(h => {
    requestAnimationFrame(() => setTimeout(() => h.classList.add('split-in'), 260));
  });

  // Headings de sección: revelan al entrar en viewport
  const headingIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      e.target.classList.add('split-in');
      headingIO.unobserve(e.target);
    });
  }, { threshold: 0.35 });
  sectionHeadings.forEach(h => headingIO.observe(h));
}

/* ---------- 2. IMAGE MOTION — clip-path + scale + blur→sharp ----------
   Cada foto se envuelve en una "máscara" invisible que lleva la animación
   de entrada (clip-path + scale + blur→nítido). El <img> en sí no se toca,
   así que sus propios efectos de hover (blanco/negro → color) siguen
   funcionando exactamente igual que antes, sin conflictos de especificidad. */
function initImageMotion(){
  // .line-card usa position:absolute + inset:0 para la imagen de fondo del
  // grid del home — se excluye del wrapper para no alterar ese layout.
  const imgs = document.querySelectorAll('main img');
  const wraps = [];
  imgs.forEach(img => {
    if(img.closest('.line-card')) return;
    if(img.parentElement && img.parentElement.classList.contains('reveal-mask')) return;
    const wrap = document.createElement('span');
    wrap.className = 'reveal-mask';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    wraps.push(wrap);
  });

  const imgIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const wrap = e.target;
      const img = wrap.querySelector('img');
      const reveal = () => wrap.classList.add('mask-in');
      if(img.complete && img.naturalWidth > 0){
        requestAnimationFrame(reveal);
      } else {
        img.addEventListener('load', reveal, { once: true });
        img.addEventListener('error', reveal, { once: true });
      }
      imgIO.unobserve(wrap);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
  wraps.forEach(w => imgIO.observe(w));
}

/* ---------- 3. HERO — parallax + scale-on-scroll (profundidad) ---------- */
function initHeroParallax(){
  const heroSection = document.querySelector('.hero, .page-hero');
  const heroVisual = document.querySelector('.hero-visual');
  const heroImg = document.querySelector('.hero-photo-frame img, .hero-visual img');
  if(!heroSection || reduceMotion) return;

  let ticking = false;
  function update(){
    const rect = heroSection.getBoundingClientRect();
    const progress = Math.min(Math.max(1 - (rect.bottom / (rect.height + window.innerHeight)), 0), 1);
    if(heroVisual) heroVisual.style.transform = `scale(${1 + progress * 0.045})`;
    if(heroImg) heroImg.style.transform = `translate3d(0, ${progress * -22}px, 0) scale(1.02)`;
    ticking = false;
  }
  function onScroll(){
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

/* ---------- 4. CUSTOM CURSOR — desactivado a pedido: se usa el cursor normal ---------- */
function initCustomCursor(){
  return;
}

/* ---------- 5. MAGNETIC BUTTONS ---------- */
function initMagnetic(){
  if(!prefersFullMotion) return;
  document.querySelectorAll('.btn').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.setProperty('--mag-x', (x * 0.22).toFixed(1) + 'px');
      el.style.setProperty('--mag-y', (y * 0.32).toFixed(1) + 'px');
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--mag-x', '0px');
      el.style.setProperty('--mag-y', '0px');
    });
  });
}

/* ---------- 6. CARD TILT + SPOTLIGHT ---------- */
function initCardTilt(){
  if(!prefersFullMotion) return;
  document.querySelectorAll('.treat-card, .body-row, .cat, .testi').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--tiltX', ((py - 0.5) * -3.5).toFixed(2) + 'deg');
      card.style.setProperty('--tiltY', ((px - 0.5) * 3.5).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    });
    card.addEventListener('mouseenter', () => card.style.setProperty('--lift', '-8px'));
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tiltX', '0deg');
      card.style.setProperty('--tiltY', '0deg');
      card.style.setProperty('--lift', '0px');
    });
  });
}

/* ---------- 7. SPOTLIGHT en secciones oscuras (quote / contacto) ---------- */
function initDarkSpotlight(){
  if(!prefersFullMotion) return;
  document.querySelectorAll('.quote-section, .contact-band').forEach(section => {
    section.addEventListener('mousemove', (e) => {
      const r = section.getBoundingClientRect();
      section.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      section.style.setProperty('--sy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTextMotion();
  initImageMotion();
  initHeroParallax();
  initCustomCursor();
  initMagnetic();
  initCardTilt();
  initDarkSpotlight();
});

/* ============================================================
   FUNCIONALIDAD EXISTENTE DEL SITIO (sin cambios de comportamiento)
   ============================================================ */

// On touch devices, tapping a link navigates immediately with no time for the
// hover-fill animation to show. Play it first, then open the link.
document.querySelectorAll('a.btn[target="_blank"], .fab-item[target="_blank"]').forEach(link => {
  link.addEventListener('click', function(e){
    if(this.dataset.tapped){ return; } // already played once, let it navigate normally
    e.preventDefault();
    this.classList.add('tap-active');
    this.dataset.tapped = '1';
    const href = this.href, target = this.target || '_self';
    setTimeout(() => { window.open(href, target); }, 380);
  });
});

// Dropdown "Ver tratamientos" — mismo patrón abrir/cerrar que el fab de WhatsApp
const treatToggle = document.getElementById('treatToggle');
const treatMenu = document.getElementById('treatMenu');
if(treatToggle && treatMenu){
  treatToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = treatMenu.classList.toggle('open');
    treatToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', (e) => {
    if(treatMenu.classList.contains('open') && !treatToggle.contains(e.target) && !treatMenu.contains(e.target)){
      treatMenu.classList.remove('open');
      treatToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Header scroll state
const header = document.getElementById('siteHeader');
if(header){
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, {passive:true});
}

// Floating contact group (WhatsApp + Instagram)
const fabToggle = document.getElementById('fabToggle');
const fabGroup = document.getElementById('fabGroup');
if(fabToggle && fabGroup){
  fabToggle.addEventListener('click', () => {
    const isOpen = fabGroup.classList.toggle('open');
    fabToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', (e) => {
    if(fabGroup.classList.contains('open') && !fabGroup.contains(e.target)){
      fabGroup.classList.remove('open');
      fabToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
if(burger && mobileMenu){
  burger.addEventListener('click', () => {
    const isOpen = !burger.classList.contains('open');
    burger.classList.toggle('open', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    if(isOpen && header) header.classList.add('scrolled');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));
}

// Sequential (non-random) stagger for grids where random order looks messy —
// grouped by parent container so each grid's cards cascade 1, 2, 3, 4 in order.
document.addEventListener('DOMContentLoaded', () => {
  const groups = new Map();
  document.querySelectorAll('.reveal-seq').forEach(el => {
    const parent = el.parentElement;
    if(!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach(list => {
    list.forEach((el, i) => { el.dataset.seqDelay = i * 130; });
  });
});

// Load-in: fade + translateY, staggered, for above-the-fold content
// (los headings ya no pasan por aquí — los maneja initTextMotion)
document.addEventListener('DOMContentLoaded', () => {
  const loadEls = document.querySelectorAll('.load-reveal');
  loadEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 150 + i * 120);
  });
});

// Scroll reveal (fade + translateY, triggered on entering viewport)
// Elements with "reveal-rand" pop in at a random delay instead of all at once,
// so grids (categories, treatments, cards) feel more lively — like a random cascade.
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const el = e.target;
    if(el.classList.contains('reveal-rand')){
      const delay = Math.random() * 500;
      const rot = (Math.random() * 6 - 3).toFixed(2);
      el.style.setProperty('--rot', rot + 'deg');
      setTimeout(() => el.classList.add('in'), delay);
    } else if(el.classList.contains('reveal-seq')){
      const delay = Number(el.dataset.seqDelay || 0);
      setTimeout(() => el.classList.add('in'), delay);
    } else {
      el.classList.add('in');
    }
    io.unobserve(el);
  });
}, { threshold:0.05, rootMargin:'0px 0px -2% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if(!q || !a) return;
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if(other !== item){
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      }
    });
    item.classList.toggle('open', !isOpen);
    a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
  });
});

// About "leer más" toggle — animate both open and close using the real content height
// (a fixed max-height would make "open" look instant since it overshoots the real content)
const readMoreBtn = document.querySelector('.read-more-btn');
if(readMoreBtn){
  const extra = document.querySelector('.about-copy .extra');
  readMoreBtn.addEventListener('click', () => {
    const isOpen = extra.classList.contains('open');
    if(!isOpen){
      extra.style.maxHeight = extra.scrollHeight + 'px';
    } else {
      extra.style.maxHeight = extra.scrollHeight + 'px'; // lock current height first
      requestAnimationFrame(() => { extra.style.maxHeight = '0px'; }); // then animate down
    }
    extra.classList.toggle('open', !isOpen);
    readMoreBtn.classList.toggle('open', !isOpen);
    readMoreBtn.querySelector('span').textContent = !isOpen ? 'Leer menos' : 'Leer más';
  });
}
