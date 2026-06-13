// ===== PAGE NAVIGATION =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (pageId === 'home') animateCounters();
  }
  // Update active nav link
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === '#' + pageId) {
      a.style.color = 'var(--gold)';
    }
  });
  // Close mobile menu
  document.getElementById('navLinks').classList.remove('open');
}

// ===== MOBILE MENU =====
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = Number(el.dataset.target) || 0;
    const duration = 1200;
    const startTime = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const update = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      el.textContent = Math.round(target * easeOut(progress));
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };

    el.textContent = '0';
    requestAnimationFrame(update);
  });
}

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 40) {
    nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
  } else {
    nav.style.boxShadow = 'none';
  }
});

// ===== PROJECTS FILTER =====
function filterProjects(cat, btn) {
  // Update button states
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Filter cards
  document.querySelectorAll('.project-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.classList.remove('hidden');
      card.style.animation = 'fadeIn 0.4s ease forwards';
    } else {
      card.classList.add('hidden');
    }
  });
}

// ===== PAYMENT MODAL =====
function openPayment() {
  document.getElementById('paymentModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  // Reset to step 1
  showStep('step1');
}

function closePayment() {
  document.getElementById('paymentModal').classList.remove('open');
  document.body.style.overflow = '';
  // Reset form
  setTimeout(() => {
    showStep('step1');
    document.getElementById('cardNumDisplay').textContent = '•••• •••• •••• ••••';
    document.getElementById('cardNameDisplay').textContent = 'YOUR NAME';
    document.getElementById('cardExpDisplay').textContent = 'MM/YY';
    // Clear inputs
    ['payName','payEmail','payAmount','cardNum','cardExp','cardCvv'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }, 300);
}

function closePaymentOnOverlay(event) {
  if (event.target === document.getElementById('paymentModal')) {
    closePayment();
  }
}

function showStep(stepId) {
  document.querySelectorAll('.payment-steps .step').forEach(s => s.classList.remove('active'));
  document.getElementById(stepId).classList.add('active');
}

// ===== PAYMENT STEP 1 → 2 =====
function goToCardDetails() {
  const name = document.getElementById('payName').value.trim();
  const email = document.getElementById('payEmail').value.trim();
  const amount = document.getElementById('payAmount').value.trim();

  if (!name) { shakeInput('payName'); showToast('Please enter your full name.'); return; }
  if (!email || !email.includes('@')) { shakeInput('payEmail'); showToast('Please enter a valid email address.'); return; }
  if (!amount || isNaN(amount) || Number(amount) <= 0) { shakeInput('payAmount'); showToast('Please enter a valid amount.'); return; }

  // Update card preview name
  document.getElementById('cardNameDisplay').textContent = name.toUpperCase().substring(0, 22);
  showStep('step2');
}

function goBack() {
  showStep('step1');
}

// ===== CARD NUMBER FORMATTING =====
function formatCard(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  let formatted = val.replace(/(.{4})/g, '$1 ').trim();
  input.value = formatted;

  // Update preview
  if (val.length > 0) {
    let display = val.padEnd(16, '•');
    document.getElementById('cardNumDisplay').textContent =
      display.substring(0,4) + ' ' + display.substring(4,8) + ' ' + display.substring(8,12) + ' ' + display.substring(12,16);
  } else {
    document.getElementById('cardNumDisplay').textContent = '•••• •••• •••• ••••';
  }
}

function formatExp(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 4);
  if (val.length >= 3) val = val.substring(0,2) + '/' + val.substring(2);
  input.value = val;
  document.getElementById('cardExpDisplay').textContent = val || 'MM/YY';
}

// ===== PROCESS PAYMENT =====
function processPayment() {
  const cardNum = document.getElementById('cardNum').value.replace(/\s/g, '');
  const cardExp = document.getElementById('cardExp').value;
  const cardCvv = document.getElementById('cardCvv').value;

  if (cardNum.length < 16) { shakeInput('cardNum'); showToast('Please enter a valid 16-digit card number.'); return; }
  if (!cardExp.includes('/') || cardExp.length < 5) { shakeInput('cardExp'); showToast('Please enter a valid expiry date (MM/YY).'); return; }
  if (cardCvv.length < 3) { shakeInput('cardCvv'); showToast('Please enter a valid 3-digit CVV.'); return; }

  // Simulate processing
  const btn = document.querySelector('#step2 .btn-primary');
  const original = btn.textContent;
  btn.textContent = 'Processing...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    btn.style.opacity = '1';

    // Build receipt
    const amount = document.getElementById('payAmount').value;
    const service = document.getElementById('payService').value;
    const ref = 'RAF-' + Math.random().toString(36).substring(2,8).toUpperCase();

    document.getElementById('receiptRef').textContent = ref;
    document.getElementById('receiptAmount').textContent = 'GHS ' + Number(amount).toLocaleString('en-GH', {minimumFractionDigits: 2});
    document.getElementById('receiptService').textContent = service;

    showStep('step3');
  }, 2200);
}

// ===== CONTACT FORM SUBMIT =====
function submitForm() {
  showToast('✓ Message sent! We\'ll respond within 24 hours.', 'success');
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'error') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${type === 'success' ? '#28a745' : '#c0392b'};
    color: white;
    padding: 0.85rem 1.8rem;
    border-radius: 6px;
    font-size: 0.88rem;
    font-family: Inter, sans-serif;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    opacity: 0;
    transition: all 0.3s ease;
    white-space: nowrap;
    max-width: 90vw;
    text-align: center;
  `;

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== SHAKE ANIMATION =====
function shakeInput(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  el.style.borderColor = '#c0392b';
  setTimeout(() => {
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('input', () => {
      el.style.borderColor = '';
      el.style.animation = '';
    }, { once: true });
  }, 10);
}

// ===== FADE-IN ANIMATION (CSS injection) =====
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(styleEl);

// ===== SCROLL REVEAL =====
function revealOnScroll() {
  const cards = document.querySelectorAll('.feature-card, .service-item, .project-card, .value-item, .team-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = entry.target.style.transform.replace('translateY(24px)', 'translateY(0)');
          entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = (card.style.transform || '') + ' translateY(24px)';
    observer.observe(card);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  revealOnScroll();

  // Keyboard: close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePayment();
  });

  // Re-run scroll reveal when page changes
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(revealOnScroll, 100);
    });
  });
});
