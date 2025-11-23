document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Check for saved user preference, if any, on load of the website
  const savedTheme = localStorage.getItem('theme');

  // If there is a saved theme, apply it. Otherwise default to dark (which is the default in CSS)
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    // Optional: Check system preference
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (prefersLight) {
      htmlElement.setAttribute('data-theme', 'light');
    }
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Create Background Stars/Particles
  createStars();
});

function createStars() {
  const container = document.querySelector('.background-animation');
  // Clear existing if any (though usually empty on load)
  container.innerHTML = '';

  const starCount = 50; // Number of particles

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // Random properties for more natural look
    const size = Math.random() * 4 + 2; // 2px to 6px (larger)
    const left = Math.random() * 100; // 0% to 100% horizontal position
    const duration = Math.random() * 10 + 20; // 10s to 20s float duration (faster)
    const delay = Math.random() * 20; // 0s to 20s delay

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${left}%`;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `-${delay}s`; // Negative delay to start mid-animation

    container.appendChild(star);
  }
}
