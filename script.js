// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

// ========== HAMBURGER ==========
const hamburger = document.getElementById('hamburger');
const navMobile  = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});

// ========== SCROLL REVEAL ==========
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

function observeReveal(el) {
  el.classList.add('reveal');
  revealObserver.observe(el);
}

// Reveal all direct children of containers
document.querySelectorAll('section > .container > *').forEach(observeReveal);
// Also reveal grid children individually
document.querySelectorAll('.skills-grid > *, .contact-grid > *, .about-stats > *').forEach(observeReveal);

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 72,
        behavior: 'smooth'
      });
    }
  });
});

// ========== GITHUB PROJECTS ==========
const GITHUB_USER = 'rishab4352';

const LANG_COLORS = {
  'JavaScript':  '#f1e05a',
  'TypeScript':  '#3178c6',
  'Python':      '#3572A5',
  'Java':        '#b07219',
  'C#':          '#178600',
  'C++':         '#f34b7d',
  'C':           '#555555',
  'HTML':        '#e34c26',
  'CSS':         '#563d7c',
  'Go':          '#00ADD8',
  'Rust':        '#dea584',
  'Ruby':        '#701516',
  'Shell':       '#89e051',
  'Kotlin':      '#A97BFF',
  'Swift':       '#F05138',
  'PHP':         '#4F5D95',
  'Vue':         '#41b883',
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || '#7a8fa8';
}

async function fetchProjects() {
  const grid = document.getElementById('projects-grid');

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=50`
    );

    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);

    const repos = await res.json();

    const filtered = repos
      .filter(r => !r.fork)
      .sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count)
          return b.stargazers_count - a.stargazers_count;
        return new Date(b.updated_at) - new Date(a.updated_at);
      })
      .slice(0, 12);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="project-error">
          <p>No public repositories found yet.<br>
          <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">View profile on GitHub →</a></p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(repo => `
      <a class="project-card" href="${repo.html_url}" target="_blank" rel="noopener" aria-label="${repo.name}">
        <div class="project-card-header">
          <span class="project-name">${repo.name}</span>
          <span class="project-link-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </span>
        </div>
        <p class="project-desc">${repo.description || 'No description provided.'}</p>
        <div class="project-footer">
          ${repo.language ? `
            <span class="project-lang">
              <span class="lang-dot" style="background:${getLangColor(repo.language)}"></span>
              ${repo.language}
            </span>` : '<span></span>'}
          ${repo.stargazers_count > 0 ? `
            <span class="project-stars">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              ${repo.stargazers_count}
            </span>` : ''}
        </div>
      </a>
    `).join('');

    // Observe newly injected project cards
    grid.querySelectorAll('.project-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.05}s`;
      observeReveal(el);
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = `
      <div class="project-error">
        <p>Could not load repositories right now.<br>
        <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">View directly on GitHub →</a></p>
      </div>`;
  }
}

fetchProjects();
