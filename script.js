// Theme toggle (remembers choice, falls back to system preference)
const root = document.documentElement;
const savedTheme = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
root.dataset.theme = savedTheme || (prefersDark ? 'dark' : 'light');

document.getElementById('themeToggle').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
});

// Mobile menu
const navLinks = document.getElementById('navLinks');
document.getElementById('menuBtn').addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Nav border on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

// Typing effect
const roles = ['PHP/Laravel Developer', 'Backend Developer', 'Node.js Developer', 'API Developer', 'Web Application Developer'];
const typed = document.getElementById('typed');
let roleIndex = 0, charIndex = roles[0].length, deleting = true;
function type() {
  const word = roles[roleIndex];
  typed.textContent = word.slice(0, charIndex);
  if (deleting) {
    charIndex--;
    if (charIndex < 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; charIndex = 0; }
  } else {
    charIndex++;
    if (charIndex > roles[roleIndex].length) { deleting = true; setTimeout(type, 1600); return; }
  }
  setTimeout(type, deleting ? 45 : 90);
}
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(type, 2000);

// Reveal on scroll + count-up stats
const counted = new WeakSet();
function countUp(el) {
  const target = +el.dataset.count;
  let n = 0;
  const step = () => { n++; el.textContent = n; if (n < target) setTimeout(step, 900 / target); };
  step();
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    entry.target.querySelectorAll('[data-count]').forEach(el => {
      if (!counted.has(el)) { counted.add(el); countUp(el); }
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Active nav link
const sections = [...document.querySelectorAll('main section[id]')];
const linkObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => linkObserver.observe(s));

document.getElementById('year').textContent = new Date().getFullYear();
