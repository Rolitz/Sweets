// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('rolitz_cart') || '[]');

function saveCart() {
  localStorage.setItem('rolitz_cart', JSON.stringify(cart));
}

function formatPrice(n) {
  return n.toLocaleString('vi-VN') + ' VNĐ';
}

function addToCart(id, name, price) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  saveCart();
  renderCart();
  showToast('🛒 Đã thêm vào giỏ hàng!');
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); renderCart(); }
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  countEl.textContent = count;
  countEl.classList.toggle('visible', count > 0);
  totalEl.textContent = formatPrice(total);

  if (!cart.length) {
    container.innerHTML = '<p class="cart-empty">Giỏ hàng trống</p>';
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">${formatPrice(item.price)}</div>
      </div>
      <div class="cart-item__qty">
        <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
      </div>
      <button class="cart-item__remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');
}

// ===== CART DRAWER =====
const cartBtn = document.getElementById('cartBtn');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
document.getElementById('cartCheckout').addEventListener('click', () => {
  closeCart();
  if (cart.length) {
    const productField = document.getElementById('productSelect');
    if (productField && cart.length === 1) {
      productField.value = cart[0].name + ' – ' + formatPrice(cart[0].price);
    }
  }
});

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

// ===== ORDER FORM =====
document.getElementById('orderForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  if (!name || !phone) {
    showToast('⚠️ Vui lòng điền tên và số điện thoại!');
    return;
  }
  const btn = document.getElementById('submitOrder');
  btn.disabled = true;
  btn.textContent = 'Đang gửi...';
  setTimeout(() => {
    alert('🌹 Đơn hàng đã gửi!\n\nCảm ơn ' + name + ' đã đặt hàng.\nChúng tôi sẽ liên hệ qua SĐT ' + phone + ' trong vòng 30 phút!');
    this.reset();
    cart = [];
    saveCart();
    renderCart();
    btn.disabled = false;
    btn.textContent = 'Đặt hàng ngay 🌹';
  }, 800);
});

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
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

// ===== INIT =====
renderCart();
