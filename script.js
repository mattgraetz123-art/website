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
