function formatPrice(n) {
  return n.toLocaleString('vi-VN') + ' VNĐ';
}

// ===== HAMBURGER NAV =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  hamburger.classList.toggle('active');
});
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===== SMOOTH ANCHOR =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== HERO SLIDER =====
const heroSlides = document.querySelectorAll('.hero__slide');
const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');
let currentHeroSlide = 0;

if(heroSlides.length > 0) {
  function showHeroSlide(index) {
    heroSlides.forEach(slide => slide.classList.remove('active'));
    currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
    heroSlides[currentHeroSlide].classList.add('active');
  }

  heroPrev.addEventListener('click', () => showHeroSlide(currentHeroSlide - 1));
  heroNext.addEventListener('click', () => showHeroSlide(currentHeroSlide + 1));
  
  // Auto slide every 5 seconds
  setInterval(() => {
    showHeroSlide(currentHeroSlide + 1);
  }, 5000);
}
