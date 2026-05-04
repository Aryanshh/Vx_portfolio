/* ============================================================
   vX Portfolio — Main JavaScript
   Cinematic Maximalist Experience
   ============================================================ */

(function () {
  'use strict';

  // ─── State ───
  const state = {
    currentSection: 0,
    totalSections: 5,
    isTransitioning: false,
    isMenuOpen: false,
    isLoaded: false,
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
  };

  // ─── DOM Refs ───
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const cursor = $('#cursor');
  const cursorFollower = $('#cursor-follower');
  const loader = $('#loader');
  const loaderCounter = $('#loader-counter');
  const loaderStatus = $('#loader-status');
  const menuBtn = $('#menu-btn');
  const navOverlay = $('#nav-overlay');
  const navPreview = $('#nav-preview');
  const navPreviewImg = $('#nav-preview-img');
  const progressCurrent = $('#progress-current');
  const progressLine = $('#progress-line');
  const sections = $$('.section');
  const blobs = [
    $('#blob-1'),
    $('#blob-2'),
    $('#blob-3'),
  ];

  // ─── Easing ───
  const ease = 'power4.out';

  // ─── Project Data ───
  // Edit this object to update project details, descriptions, and links.
  // Set a link to null or remove it to hide that button.
  const projectData = {
    nebula: {
      title: 'Nebula',
      category: 'BRAND IDENTITY',
      image: 'assets/project-1.png',
      description: 'A complete brand identity system for a next-gen creative studio. Includes logo design, typography scale, color palette, and comprehensive brand guidelines across digital and print touchpoints.',
      github: 'https://github.com',
      vercel: 'https://vercel.app',
    },
    monolith: {
      title: 'Monolith',
      category: 'ARCHITECTURE',
      image: 'assets/project-2.png',
      description: 'A visual exploration of brutalist architecture through the lens of modern web design. High-contrast photography paired with bold typographic layouts and immersive scroll-driven storytelling.',
      github: 'https://github.com',
      vercel: null,
    },
    aether: {
      title: 'Aether',
      category: 'PRODUCT DESIGN',
      image: 'assets/project-3.png',
      description: 'End-to-end product design for a luxury fragrance brand. From concept to shelf — packaging, website, and campaign visuals crafted for a premium sensory experience.',
      github: null,
      vercel: 'https://vercel.app',
    },
    synapse: {
      title: 'Synapse',
      category: 'DASHBOARD UI',
      image: 'assets/project-4.png',
      description: 'A futuristic data dashboard interface for an AI analytics platform. Real-time visualizations, dark-mode-first design, and a component system built for scalability.',
      github: 'https://github.com',
      vercel: 'https://vercel.app',
    },
  };

  // ─── Modal DOM Refs ───
  const projectModal = $('#project-modal');
  const projectModalBackdrop = $('#project-modal-backdrop');
  const projectModalCard = $('#project-modal-card');
  const projectModalClose = $('#project-modal-close');
  const projectModalImg = $('#project-modal-img');
  const projectModalTitle = $('#project-modal-title');
  const projectModalCategory = $('#project-modal-category');
  const projectModalDesc = $('#project-modal-desc');
  const projectModalLinks = $('#project-modal-links');

  // ─── SVG Icons ───
  const githubIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>';
  const vercelIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L24 22H0L12 1z"/></svg>';

  // ════════════════════════════════════════════════════════════
  // 1. PAGE LOADER
  // ════════════════════════════════════════════════════════════

  function runLoader() {
    const statusMessages = [
      'INITIALIZING EXPERIENCE',
      'LOADING ASSETS',
      'COMPILING VISUALS',
      'PREPARING INTERFACE',
      'ALMOST THERE',
      'WELCOME',
    ];

    let counter = { value: 0 };

    gsap.to(counter, {
      value: 100,
      duration: 2.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        const val = Math.round(counter.value);
        loaderCounter.textContent = val < 10 ? `0${val}` : val;

        // Update status message at thresholds
        const idx = Math.min(Math.floor(val / 20), statusMessages.length - 1);
        loaderStatus.textContent = statusMessages[idx];
      },
      onComplete: () => {
        gsap.to(loader, {
          opacity: 0,
          scale: 1.1,
          duration: 0.8,
          ease: ease,
          onComplete: () => {
            loader.style.display = 'none';
            state.isLoaded = true;
            animateHeroEntry();
          },
        });
      },
    });
  }

  // ════════════════════════════════════════════════════════════
  // 2. HERO ENTRY ANIMATION
  // ════════════════════════════════════════════════════════════

  function animateHeroEntry() {
    const tl = gsap.timeline({ defaults: { ease: ease } });

    // Reveal title lines
    tl.to('.hero-title-line span', {
      y: 0,
      duration: 1.2,
      stagger: 0.15,
    });

    // Fade in tag
    tl.from('.hero-tag', {
      opacity: 0,
      y: 20,
      duration: 0.8,
    }, '-=0.8');

    // Fade in description
    tl.to('.hero-description', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, '-=0.5');

    // Fade in resume button
    tl.to('.hero-resume-btn', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, '-=0.6');

    // Fade in header
    tl.from('.header', {
      opacity: 0,
      y: -30,
      duration: 0.8,
    }, '-=0.6');

    // Fade in progress indicator
    tl.from('.progress-indicator', {
      opacity: 0,
      duration: 0.6,
    }, '-=0.4');
  }

  // ════════════════════════════════════════════════════════════
  // 3. CUSTOM CURSOR
  // ════════════════════════════════════════════════════════════

  function initCursor() {
    // Skip on touch devices
    if ('ontouchstart' in window) return;

    document.addEventListener('mousemove', (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;

      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      });

      gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    // Hover detection
    const hoverElements = $$('a, button, [data-hover]');
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
  }

  // ════════════════════════════════════════════════════════════
  // 4. MAGNETIC MESH BLOBS
  // ════════════════════════════════════════════════════════════

  function initBlobs() {
    const multipliers = [0.5, 1, 1.5];

    document.addEventListener('mousemove', (e) => {
      const xOffset = (e.clientX / window.innerWidth - 0.5) * 40;
      const yOffset = (e.clientY / window.innerHeight - 0.5) * 40;

      blobs.forEach((blob, i) => {
        if (!blob) return;
        gsap.to(blob, {
          x: xOffset * multipliers[i],
          y: yOffset * multipliers[i],
          duration: 1.2,
          ease: 'power2.out',
        });
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // 5. SECTION NAVIGATION
  // ════════════════════════════════════════════════════════════

  function goToSection(index) {
    if (state.isTransitioning || index === state.currentSection) return;
    if (index < 0 || index >= state.totalSections) return;

    state.isTransitioning = true;
    const currentEl = sections[state.currentSection];
    const nextEl = sections[index];

    const direction = index > state.currentSection ? 1 : -1;

    // Animate current section out
    gsap.to(currentEl, {
      opacity: 0,
      scale: direction > 0 ? 0.92 : 1.08,
      duration: 0.6,
      ease: ease,
      onComplete: () => {
        currentEl.classList.remove('section-active');
        currentEl.style.transform = '';
        currentEl.style.opacity = '';
      },
    });

    // Prepare next section
    gsap.set(nextEl, {
      scale: direction > 0 ? 1.08 : 0.92,
      opacity: 0,
    });
    nextEl.classList.add('section-active');
    nextEl.style.visibility = 'visible';

    // Animate next section in
    gsap.to(nextEl, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: ease,
      delay: 0.15,
      onComplete: () => {
        state.currentSection = index;
        state.isTransitioning = false;
        updateProgressIndicator();
        animateSectionContent(index);
      },
    });
  }

  function animateSectionContent(index) {
    const section = sections[index];

    if (index === 1) {
      // About section animations
      gsap.from(section.querySelectorAll('.about-content > *'), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: ease,
      });
      gsap.from(section.querySelector('.about-image-container'), {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: ease,
        delay: 0.3,
      });
      // Animate stat counters
      animateStats();
    } else if (index === 2) {
      // Work section animations
      gsap.from(section.querySelector('.work-title'), {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: ease,
      });
      gsap.from(section.querySelectorAll('.work-card'), {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.1,
        ease: ease,
        delay: 0.2,
      });
    } else if (index === 3) {
      // Design gallery animations
      gsap.from(section.querySelector('.design-title'), {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: ease,
      });
      gsap.from(section.querySelectorAll('.design-frame'), {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.08,
        ease: ease,
        delay: 0.2,
      });
    } else if (index === 4) {
      // Contact section animations
      gsap.from(section.querySelector('.contact-heading'), {
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 1,
        ease: ease,
      });
      gsap.from(section.querySelectorAll('.contact-social-link'), {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.3,
      });
      gsap.from(section.querySelector('.contact-footer'), {
        opacity: 0,
        duration: 0.6,
        delay: 0.6,
        ease: ease,
      });
    }
  }

  function animateStats() {
    const statNumbers = $$('.about-stat-number');
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-count').includes('+') ? '+' : '+';
      let obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.val) + '+';
        },
      });
    });
  }

  function updateProgressIndicator() {
    const num = state.currentSection + 1;
    progressCurrent.textContent = num < 10 ? `0${num}` : num;

    // Update progress line fill
    const pct = ((state.currentSection + 1) / state.totalSections) * 100;
    if (progressLine) {
      const afterStyle = progressLine.querySelector('style') || document.createElement('style');
      // Use a dynamic pseudo-element approach via CSS variable
      progressLine.style.setProperty('--fill', `${pct}%`);
    }
  }

  // Wheel navigation
  let wheelTimeout = null;
  function handleWheel(e) {
    if (!state.isLoaded || state.isMenuOpen) return;

    e.preventDefault();

    if (wheelTimeout) return;

    wheelTimeout = setTimeout(() => {
      wheelTimeout = null;
    }, 1000);

    if (e.deltaY > 0) {
      goToSection(state.currentSection + 1);
    } else {
      goToSection(state.currentSection - 1);
    }
  }

  // Keyboard navigation
  function handleKeydown(e) {
    if (!state.isLoaded || state.isMenuOpen) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      goToSection(state.currentSection + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSection(state.currentSection - 1);
    } else if (e.key === 'Escape' && state.isMenuOpen) {
      toggleMenu();
    }
  }

  // Touch navigation
  let touchStartY = 0;
  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (!state.isLoaded || state.isMenuOpen) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSection(state.currentSection + 1);
      } else {
        goToSection(state.currentSection - 1);
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  // 6. CIRCULAR NAV MENU
  // ════════════════════════════════════════════════════════════

  function toggleMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    const links = $$('.nav-link');

    if (state.isMenuOpen) {
      // Show overlay
      navOverlay.classList.add('nav-open');
      navOverlay.setAttribute('aria-hidden', 'false');

      // Animate overlay in via GSAP clip-path
      gsap.fromTo(navOverlay,
        { clipPath: 'circle(0% at calc(100% - 4rem) 3.25rem)' },
        { clipPath: 'circle(150% at calc(100% - 4rem) 3.25rem)', duration: 1, ease: ease }
      );
      gsap.to(navOverlay, { opacity: 1, visibility: 'visible', duration: 0.1 });

      // Animate links in with stagger
      gsap.fromTo(links,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: ease, delay: 0.3 }
      );

      // Change label
      menuBtn.querySelector('.header-menu-label').textContent = 'CLOSE';
    } else {
      // Animate overlay out
      gsap.to(navOverlay, {
        clipPath: 'circle(0% at calc(100% - 4rem) 3.25rem)',
        duration: 0.8,
        ease: ease,
        onComplete: () => {
          navOverlay.classList.remove('nav-open');
          navOverlay.setAttribute('aria-hidden', 'true');
          gsap.set(navOverlay, { opacity: 0, visibility: 'hidden', clearProps: 'clipPath' });
          gsap.set(links, { clearProps: 'opacity,y,x' });
        },
      });

      navPreview.classList.remove('nav-preview-visible');
      menuBtn.querySelector('.header-menu-label').textContent = 'MENU';
    }
  }

  function initNavLinks() {
    const navLinks = $$('.nav-link');

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionIndex = parseInt(link.getAttribute('data-section'), 10);
        toggleMenu();

        // Small delay so menu closes first
        setTimeout(() => {
          goToSection(sectionIndex);
        }, 600);
      });

      // Preview on hover
      link.addEventListener('mouseenter', () => {
        const previewSrc = link.getAttribute('data-preview');
        if (previewSrc && navPreviewImg) {
          navPreviewImg.src = previewSrc;
          navPreview.classList.add('nav-preview-visible');
        }
      });

      link.addEventListener('mouseleave', () => {
        navPreview.classList.remove('nav-preview-visible');
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // 8. PROJECT MODAL
  // ════════════════════════════════════════════════════════════

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    // Populate content
    projectModalImg.src = data.image;
    projectModalImg.alt = data.title;
    projectModalTitle.textContent = data.title;
    projectModalCategory.textContent = data.category;
    projectModalDesc.textContent = data.description;

    // Build links
    let linksHTML = '';
    if (data.github) {
      linksHTML += `<a href="${data.github}" target="_blank" rel="noopener" class="project-modal-link" data-hover>${githubIcon} GitHub</a>`;
    }
    if (data.vercel) {
      linksHTML += `<a href="${data.vercel}" target="_blank" rel="noopener" class="project-modal-link" data-hover>${vercelIcon} Live Demo</a>`;
    }
    projectModalLinks.innerHTML = linksHTML;

    // Show modal
    projectModal.classList.add('modal-open');
    gsap.fromTo(projectModalBackdrop, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: ease });
    gsap.fromTo(projectModalCard,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: ease, delay: 0.1 }
    );

    // Re-bind cursor hover on new link elements
    projectModalLinks.querySelectorAll('.project-modal-link').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
  }

  function closeProjectModal() {
    gsap.to(projectModalCard, {
      opacity: 0, y: 30, scale: 0.95, duration: 0.4, ease: ease,
    });
    gsap.to(projectModalBackdrop, {
      opacity: 0, duration: 0.3, ease: ease, delay: 0.1,
      onComplete: () => {
        projectModal.classList.remove('modal-open');
        gsap.set([projectModalCard, projectModalBackdrop], { clearProps: 'all' });
      },
    });
  }

  function initProjectCards() {
    $$('.work-card[data-project]').forEach((card) => {
      card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        openProjectModal(projectId);
      });
    });

    projectModalClose.addEventListener('click', closeProjectModal);
    projectModalBackdrop.addEventListener('click', closeProjectModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('modal-open')) {
        closeProjectModal();
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // 9. INIT
  // ════════════════════════════════════════════════════════════

  function init() {
    // Set initial progress line fill
    if (progressLine) {
      progressLine.style.setProperty('--fill', '20%');
    }

    // Start loader animation
    runLoader();

    // Initialize cursor
    initCursor();

    // Initialize mesh blob parallax
    initBlobs();

    // Initialize nav menu
    menuBtn.addEventListener('click', toggleMenu);
    initNavLinks();

    // Initialize project detail modal
    initProjectCards();

    // Section navigation events
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Logo click goes to hero
    $('#header-logo').addEventListener('click', (e) => {
      e.preventDefault();
      if (state.isMenuOpen) toggleMenu();
      goToSection(0);
    });
  }

  // Wait for DOM and fonts
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
