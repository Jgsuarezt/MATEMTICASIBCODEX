document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-question').forEach((button, index) => {
    const answer = button.closest('.faq-item').querySelector('.faq-answer');
    if (answer) { answer.id = `faq-answer-${index}`; button.setAttribute('aria-controls', answer.id); }
    const sync = () => document.querySelectorAll('.faq-question').forEach(b => b.setAttribute('aria-expanded', String(b.closest('.faq-item').classList.contains('active'))));
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', sync);
  });
  const menu = document.querySelector('.nav-menu');
  const toggle = document.querySelector('.menu-toggle');
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('active'); toggle?.setAttribute('aria-expanded', 'false'); if (toggle) toggle.textContent = '☰';
  }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.classList.contains('active')) { menu.classList.remove('active'); toggle?.setAttribute('aria-expanded','false'); if(toggle) { toggle.textContent='☰'; toggle.focus(); } } });
});
