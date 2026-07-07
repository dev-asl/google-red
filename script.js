const form = document.getElementById('searchForm');
const bar = document.getElementById('searchBar');
const input = document.getElementById('searchInput');
const suggestionsEl = document.getElementById('suggestions');
const luckyBtn = document.getElementById('luckyBtn');
const themeToggle = document.getElementById('themeToggle');

// --- Mock suggestion data (purely illustrative, offline demo) ---
const POOL = [
  'ember red color palette',
  'red velvet cake recipe',
  'red panda facts',
  'redesign portfolio ideas',
  'red dead redemption 2',
  'red wine pairing guide',
  'redshift vs blueshift',
  'red flags in job interviews',
  'best red sneakers 2026',
  'red sea travel guide'
];

const icon = () => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

function renderSuggestions(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    suggestionsEl.hidden = true;
    suggestionsEl.innerHTML = '';
    return;
  }
  const matches = POOL.filter(item => item.includes(q)).slice(0, 6);
  if (matches.length === 0) {
    suggestionsEl.hidden = true;
    suggestionsEl.innerHTML = '';
    return;
  }
  suggestionsEl.innerHTML = matches
    .map(m => `<li role="option">${icon()}<span>${m}</span></li>`)
    .join('');
  suggestionsEl.hidden = false;
}

input.addEventListener('input', (e) => renderSuggestions(e.target.value));

input.addEventListener('focus', () => bar.classList.add('is-focused'));
input.addEventListener('blur', () => {
  bar.classList.remove('is-focused');
  // slight delay so click on a suggestion still registers
  setTimeout(() => { suggestionsEl.hidden = true; }, 120);
});

suggestionsEl.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  input.value = li.textContent.trim();
  suggestionsEl.hidden = true;
  input.focus();
});

// Keyboard navigation through suggestions
let activeIndex = -1;
input.addEventListener('keydown', (e) => {
  const items = [...suggestionsEl.querySelectorAll('li')];
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex = (activeIndex + 1) % items.length;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex = (activeIndex - 1 + items.length) % items.length;
  } else if (e.key === 'Enter' && activeIndex >= 0) {
    e.preventDefault();
    input.value = items[activeIndex].textContent.trim();
    suggestionsEl.hidden = true;
    return;
  } else {
    return;
  }

  items.forEach((li, i) => li.classList.toggle('active', i === activeIndex));
  items[activeIndex].scrollIntoView({ block: 'nearest' });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;
  // Demo behaviour: route to a real search engine results page
  window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
});

luckyBtn.addEventListener('click', () => {
  const q = input.value.trim() || POOL[Math.floor(Math.random() * POOL.length)];
  window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}&btnI=1`;
});

// --- Theme toggle (light / dark ember) ---
themeToggle.addEventListener('click', (e) => {
  e.preventDefault();
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
});
