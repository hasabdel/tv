// Utility helpers
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Year
$('#year').textContent = new Date().getFullYear();

// Sticky header + back-to-top visibility
const header = $('#header');
const toTop = $('#toTop');
const onScroll = () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  header.classList.toggle('scrolled', y > 10);
  toTop.classList.toggle('show', y > 600);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav
const hamburger = $('#hamburger');
const nav = $('#nav');
const closeNav = () => {
  nav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
};
hamburger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});
$$('#nav a').forEach(a => a.addEventListener('click', closeNav));

// Smooth scroll fix for hash links
$$('#nav a, .cta a, .price-card a').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    }
  });
});

// Back to top
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Fake hero player progress
const progress = $('#progress');
const play = $('#fakePlay');
let playing = false, timer = null;
const tick = () => {
  const w = parseFloat(progress.style.width);
  const next = (w + 0.4) % 100;
  progress.style.width = next + '%';
};
const start = () => { if (!timer) timer = setInterval(tick, 50); playing = true; play.textContent = '⏸'; };
const stop = () => { clearInterval(timer); timer = null; playing = false; play.textContent = '▶'; };
play.addEventListener('click', () => (playing ? stop() : start()));

// Testimonials auto-scroll (gentle)
const slider = $('#slider');
let autoScroll;
function startAutoScroll(){
  stopAutoScroll();
  autoScroll = setInterval(() => {
    slider.scrollBy({ left: 320, behavior: 'smooth' });
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, 3000);
}
function stopAutoScroll(){ if (autoScroll) clearInterval(autoScroll); }
slider?.addEventListener('mouseenter', stopAutoScroll);
slider?.addEventListener('mouseleave', startAutoScroll);
startAutoScroll();

// FAQ accordion
$$('.qa button').forEach(btn => {
  btn.addEventListener('click', () => {
    const qa = btn.closest('.qa');
    const isOpen = qa.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });
});

// Contact form (front-end only demo)
const form = $('#contactForm');
const note = $('#formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '');
  if (!data.name || !emailOk){
    note.textContent = 'Please provide a valid name and email.';
    note.style.color = 'var(--danger)';
    return;
  }
  note.textContent = 'Sending…';
  note.style.color = 'var(--muted)';
  setTimeout(() => {
    note.textContent = 'Thanks! We received your request and will email your test credentials shortly.';
    note.style.color = 'var(--success)';
    form.reset();
  }, 800);
});

// Accessibility: focus outline for keyboard users
function handleFirstTab(e){
  if (e.key === 'Tab'){
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
  }
}
window.addEventListener('keydown', handleFirstTab);
