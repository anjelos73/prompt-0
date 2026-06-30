const slides = document.querySelectorAll('.slide');
const total = slides.length;
let current = 1;

// === ZOOM TESTO ===
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 1.6;
const ZOOM_STEP = 0.1;
let fontScale = 1;
try { fontScale = parseFloat(localStorage.getItem('corso_font_scale')) || 1; } catch(e) {}

function applyZoom() {
  document.documentElement.style.setProperty('--font-scale', fontScale);
  const label = document.getElementById('zoom-label');
  if (label) label.textContent = Math.round(fontScale * 100) + '%';
  try { localStorage.setItem('corso_font_scale', fontScale); } catch(e) {}
}

function zoomIn() {
  fontScale = Math.min(ZOOM_MAX, +(fontScale + ZOOM_STEP).toFixed(2));
  applyZoom();
}
function zoomOut() {
  fontScale = Math.max(ZOOM_MIN, +(fontScale - ZOOM_STEP).toFixed(2));
  applyZoom();
}
function zoomReset() {
  fontScale = 1;
  applyZoom();
}

function show(n) {
  if (n < 1 || n > total) return;
  slides.forEach(s => s.classList.remove('active'));
  current = n;
  var s = slides[current - 1];
  s.classList.add('active');
  document.getElementById('counter').textContent = current + ' / ' + total;
  document.getElementById('progress-bar').style.width = (current / total * 100) + '%';
  s.scrollTop = 0;
  s.focus({ preventScroll: true });
}

function next() { show(Math.min(current + 1, total)); }
function prev() { show(Math.max(current - 1, 1)); }
function goTo(n) { show(n); }

document.addEventListener('keydown', e => {
  // Scorciatoie zoom (non attive se l'utente sta scrivendo in un input)
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); return; }
  if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomOut(); return; }
  if (e.key === '0') { e.preventDefault(); zoomReset(); return; }
  if (e.key === 'i' || e.key === 'I') { e.preventDefault(); goTo(2); return; }

  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
  else if (e.key === ' ') { e.preventDefault(); next(); }
  else if (e.key === 'Home') { show(1); }
  else if (e.key === 'End') { show(total); }
});

// Propaga il wheel scroll alla slide attiva
document.addEventListener('wheel', function(e) {
  var activeSlide = document.querySelector('.slide.active');
  if (activeSlide) {
    var atTop = activeSlide.scrollTop <= 0;
    var atBottom = activeSlide.scrollTop + activeSlide.clientHeight >= activeSlide.scrollHeight - 1;
    if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
      return;
    }
    activeSlide.scrollTop += e.deltaY;
  }
}, { passive: true });

show(1);
applyZoom();
