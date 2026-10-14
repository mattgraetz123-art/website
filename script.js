// ===== Nav scroll state =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== Mobile menu =====
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

navBurger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navBurger.classList.toggle('open', isOpen);
  navBurger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navBurger.classList.remove('open');
    navBurger.setAttribute('aria-expanded', false);
  });
});

// ===== Fade-in on scroll =====
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
fadeEls.forEach((el) => observer.observe(el));


// ===== Waitlist counter =====
const waitlistCount = document.getElementById('waitlistCount');

async function getWaitlistCount() {
  try {
    const res = await fetch('https://api.countapi.xyz/get/444runner-au/waitlist');
    const data = await res.json();
    if (data.value > 0) {
      waitlistCount.textContent = `${data.value.toLocaleString()} people already signed up`;
    }
  } catch (e) {}
}
getWaitlistCount();

// ===== Run Club Map =====
let runMap = null;

function initMap() {
  if (runMap) return;
  const mapEl = document.getElementById('runMap');
  if (!mapEl) return;

  runMap = L.map('runMap', { zoomControl: true, scrollWheelZoom: false }).setView([-34.9350, 138.5760], 12);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19
  }).addTo(runMap);

  const markerIcon = L.divIcon({
    className: 'map-marker',
    html: '<div class="map-pin"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  L.marker([-34.9439, 138.5973], { icon: markerIcon })
    .addTo(runMap)
    .bindPopup('<strong>THURSDAY 5:00AM</strong><br>Pepo Eatery<br>175 King William Road, Hyde Park');

  L.marker([-34.9274, 138.5335], { icon: markerIcon })
    .addTo(runMap)
    .bindPopup('<strong>SUNDAY 7:30AM</strong><br>Pom Pom<br>58 Maple Avenue, Forestville');

  setTimeout(() => runMap.invalidateSize(), 200);
}

const mapObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { initMap(); mapObserver.disconnect(); } });
}, { threshold: 0.1 });

const mapEl = document.getElementById('runMap');
if (mapEl) mapObserver.observe(mapEl);

// ===== Signup form =====
const signupForm = document.getElementById('signupForm');
const signupSuccess = document.getElementById('signupSuccess');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value.trim();
  if (!email) return;

  try {
    await fetch('https://formsubmit.co/ajax/444.runnerau@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, subject: '444 Runner — New Notify Me signup' }),
    });
    signupSuccess.textContent = `Thanks — we'll notify ${email} when the kit drops.`;
    signupForm.reset();
    try {
      const res = await fetch('https://api.countapi.xyz/hit/444runner-au/waitlist');
      const data = await res.json();
      if (data.value > 0) waitlistCount.textContent = `${data.value.toLocaleString()} people already signed up`;
    } catch (e) {}
  } catch (err) {
    signupSuccess.textContent = 'Something went wrong — please try again.';
  }
});
