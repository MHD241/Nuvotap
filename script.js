const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuButton.textContent = open ? '✕' : '☰';
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) { menuButton.textContent = '☰'; menuButton.setAttribute('aria-label', 'Open navigation'); }
}));
document.getElementById('year').textContent = new Date().getFullYear();

const toast = document.querySelector('.toast');
let toastTimer;
document.querySelectorAll('.add-cart').forEach(button => button.addEventListener('click', () => {
  toast.textContent = 'Thanks for your interest in Nuvotap! Add your contact or checkout link to this button before launch.';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}));

document.querySelectorAll('.faq-list details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    const symbol = detail.querySelector('summary span');
    if (symbol) symbol.textContent = detail.open ? '×' : '+';
  });
});
