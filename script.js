/* ── script.js – Pixel Art × Far Cry 4 Portfolio ── */

// ── THEME TOGGLE ──
const themeBtn = document.getElementById('theme-toggle');
const themeBtnMob = document.getElementById('theme-toggle-mob');
let currentTheme = localStorage.getItem('theme') || 'dark';

function updateTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

// Apply initial theme
updateTheme(currentTheme);

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', currentTheme);
  updateTheme(currentTheme);
}

if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
if (themeBtnMob) themeBtnMob.addEventListener('click', toggleTheme);


// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER ──
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobile-menu');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mob.classList.toggle('open');
});
mob.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
  ham.classList.remove('open'); mob.classList.remove('open');
}));

// ── PARTICLE CANVAS (ember/fire particles) ──
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = ['#c8860a', '#f0b429', '#8b1a10', '#4a8c2a', '#e8a020'];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = H + 10;
    this.vy = -(Math.random() * 1.2 + 0.4);
    this.vx = (Math.random() - 0.5) * 0.6;
    this.size = Math.floor(Math.random() * 3 + 1) * 3; // pixel sizes: 3,6,9
    this.alpha = Math.random() * 0.6 + 0.2;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.life++;
    this.alpha = (1 - this.life / this.maxLife) * 0.7;
    if (this.life >= this.maxLife || this.y < -20) this.reset();
  }
  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(Math.round(this.x), Math.round(this.y), this.size, this.size);
  }
}

for (let i = 0; i < 80; i++) {
  const p = new Particle();
  p.y = Math.random() * H; // scatter on load
  particles.push(p);
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

// ── STAT COUNTER ──
function countUp(el, target, duration) {
  let start = 0, step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    if (start < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statConfig = {
  'stat-games': { count: 6, suffix: '' },
  'stat-years': { count: 1, suffix: '' },
  'stat-players': { count: 300, suffix: '+' },
};

let statsStarted = false;
function tryStartStats() {
  if (statsStarted) return;
  const hero = document.getElementById('hero');
  if (!hero) return;
  const rect = hero.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    statsStarted = true;
    Object.entries(statConfig).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (el) { el.dataset.suffix = cfg.suffix; countUp(el, cfg.count, 1500); }
    });
  }
}
window.addEventListener('scroll', tryStartStats);
setTimeout(tryStartStats, 500);

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('section, .game-card, .about-card, .contact-item');
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// ── FILTER GAMES ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.game-card').forEach(card => {
      const genres = card.dataset.genre.split(' ');
      const match = filter === 'all' || genres.includes(filter);
      card.classList.toggle('hidden', !match);
      if (match) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = 'fadeUp .4s ease both'; }
    });
  });
});

// ── VIDEO MODAL ──
const backdrop = document.getElementById('modal-backdrop');
const iframe = document.getElementById('modal-iframe');
const closeBtn = document.getElementById('modal-close');

function openVideo(url) {
  iframe.src = url;
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  backdrop.classList.remove('open');
  iframe.src = '';
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

window.openVideo = openVideo; // expose globally for inline onclick

// ── CONTACT FORM ──
// ── CONTACT FORM ──
// Removed as per request

// ── PIXEL CURSOR TRAIL ──
const trail = [];
const MAX_TRAIL = 8;
document.addEventListener('mousemove', e => {
  trail.push({ x: e.clientX, y: e.clientY, life: 1 });
  if (trail.length > MAX_TRAIL) trail.shift();
});

// draw pixel trail over canvas
function drawTrail() {
  trail.forEach((p, i) => {
    const size = (i + 1) * 2;
    const alpha = (i / trail.length) * 0.5;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#c8860a';
    ctx.fillRect(Math.round(p.x - size / 2), Math.round(p.y - size / 2), size, size);
  });
}
// patch into animate loop
const _origAnimate = animate;
function animateWithTrail() {
  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  particles.forEach(p => { p.update(); p.draw(); });
  drawTrail();
  requestAnimationFrame(animateWithTrail);
}
// restart loop with trail
cancelAnimationFrame(window._animFrame);
(function loop() { window._animFrame = requestAnimationFrame(loop); ctx.clearRect(0, 0, W, H); particles.forEach(p => { p.update(); p.draw(); }); drawTrail(); })();

// ── CARD HOVER PIXEL SOUND (visual only) & VIDEO PLAY ──
document.querySelectorAll('.game-card').forEach(card => {
  const video = card.querySelector('.card-video');

  card.addEventListener('mouseenter', () => {
    card.style.setProperty('--px-pop', '1');
    if (video) {
      video.play().catch(err => console.log('Video play prevented:', err));
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.removeProperty('--px-pop');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  });
});

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});



console.log('%c PIXELFORGE LOADED ', 'background:#c8860a;color:#000;font-family:"Press Start 2P",monospace;font-size:12px;padding:8px;');