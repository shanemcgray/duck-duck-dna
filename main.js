// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Homepage: reveal a random "DNA" sequence
const seqBtn = document.getElementById('seqBtn');
const seqOut = document.getElementById('seqOut');
if (seqBtn && seqOut) {
  const bases = ['A', 'T', 'C', 'G'];
  seqBtn.addEventListener('click', () => {
    const seq = Array.from({ length: 16 }, () => bases[Math.floor(Math.random() * bases.length)]).join('');
    seqOut.textContent = seq;
  });
}
