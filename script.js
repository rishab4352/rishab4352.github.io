// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

// Close mobile menu on link click
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.background = 'rgba(13,17,23,0.97)';
  } else {
    navbar.style.background = 'rgba(13,17,23,0.85)';
  }
});

// ========== SCROLL REVEAL ==========
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section > .container > *').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ========== GITHUB PROJECTS ==========
const GITHUB_USER = 'rishab4352';

// Language color map (common languages)
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
  return LANG_COLORS[lang] || '#8b949e';
}

async function fetchProjects() {
  const grid = document.getElementById('projects-grid');

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=50`
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const repos = await res.json();

    // Filter out forks, sort by stars then updated
    const filtered = repos
      .filter(r => !r.fork)
      .sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at) - new Date(a.updated_at);
      })
      .slice(0, 12);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="project-error">
          <p>No public repositories found yet. <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">View GitHub profile</a></p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(repo => `
      <a class="project-card reveal" href="${repo.html_url}" target="_blank" rel="noopener" aria-label="${repo.name}">
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              ${repo.stargazers_count}
            </span>` : ''}
        </div>
      </a>
    `).join('');

    // Trigger reveal animation on newly added cards
    grid.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = `
      <div class="project-error">
        <p>Could not load repositories right now.
          <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">View directly on GitHub →</a>
        </p>
      </div>`;
  }
}

fetchProjects();

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
