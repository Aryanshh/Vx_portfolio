/* ============================================================
   vX Portfolio — Main JavaScript (Multi-Page System)
   Cinematic Maximalist Experience
   ============================================================ */

(function () {
  'use strict';

  // ─── State ───
  const state = {
    isMenuOpen: false,
    isLoaded: false,
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
  };

  // ─── DOM Refs (Assigned in init) ───
  let cursor, cursorFollower, loader, loaderCounter, loaderStatus;
  let menuBtn, navOverlay, navPreview, navPreviewImg;
  let blobs = [];

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ─── Easing ───
  const ease = 'power4.out';

  // ─── Project Data ───
  const projectData = {
    nebula: {
      title: 'Nebula',
      category: 'BRAND IDENTITY',
      image: 'assets/project-1.png',
      description: 'A complete brand identity system for a next-gen creative studio.',
      github: 'https://github.com',
      vercel: 'https://vercel.app',
    },
    monolith: {
      title: 'Monolith',
      category: 'ARCHITECTURE',
      image: 'assets/project-2.png',
      description: 'A visual exploration of brutalist architecture through the lens of modern web design.',
      github: 'https://github.com',
      vercel: null,
    },
    aether: {
      title: 'Aether',
      category: 'PRODUCT DESIGN',
      image: 'assets/project-3.png',
      description: 'End-to-end product design for a luxury fragrance brand.',
      github: null,
      vercel: 'https://vercel.app',
    },
    synapse: {
      title: 'Synapse',
      category: 'DASHBOARD UI',
      image: 'assets/project-4.png',
      description: 'A futuristic data dashboard interface for an AI analytics platform.',
      github: 'https://github.com',
      vercel: 'https://vercel.app',
    },
    horizon: {
      title: 'Horizon',
      category: 'LANDING PAGE',
      image: 'assets/project-1.png',
      description: 'A high-conversion landing page for a SaaS product.',
      github: 'https://github.com',
      vercel: 'https://vercel.app',
    },
    zenith: {
      title: 'Zenith',
      category: 'MOBILE APP',
      image: 'assets/project-2.png',
      description: 'UX/UI design for a wellness and fitness mobile application.',
      github: 'https://github.com',
      vercel: null,
    },
  };

  const githubIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>';
  const vercelIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L24 22H0L12 1z"/></svg>';

  // ════════════════════════════════════════════════════════════
  // 1. PAGE LOADER
  // ════════════════════════════════════════════════════════════

  function runLoader() {
    if (!loaderCounter || !loaderStatus) return;
    const statusMessages = ['INITIALIZING', 'LOADING ASSETS', 'COMPILING', 'WELCOME'];
    let counter = { value: 0 };

    gsap.to(counter, {
      value: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const val = Math.round(counter.value);
        loaderCounter.textContent = val < 10 ? `0${val}` : val;
        const idx = Math.min(Math.floor(val / 30), statusMessages.length - 1);
        loaderStatus.textContent = statusMessages[idx];
      },
      onComplete: () => {
        gsap.to(loader, {
          opacity: 0,
          scale: 1.1,
          duration: 0.8,
          ease: ease,
          onComplete: () => {
            if (loader) loader.style.display = 'none';
            state.isLoaded = true;
            animatePageEntry();
          },
        });
      },
    });
  }

  // ════════════════════════════════════════════════════════════
  // 2. PAGE TRANSITIONS
  // ════════════════════════════════════════════════════════════

  function animatePageEntry() {
    const tl = gsap.timeline({ defaults: { ease: ease } });

    gsap.from('.page-wrapper', { opacity: 0, y: 30, duration: 1.2 });

    if ($('.hero-title')) {
      tl.to('.hero-title-line span', { y: 0, duration: 1.2, stagger: 0.15 });
      tl.from('.hero-tag', { opacity: 0, y: 20, duration: 0.8 }, '-=0.8');
      tl.to('.hero-description', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
      tl.to('.hero-resume-btn', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
    }

    if ($('.about-title')) {
      tl.from('.about-title', { opacity: 0, x: -50, duration: 1 });
      tl.from('.about-body', { opacity: 0, y: 30, duration: 1 }, '-=0.5');
      tl.from('.about-image-container', { opacity: 0, scale: 0.9, duration: 1.2 }, '-=0.8');
    }

    if ($('.work-title')) {
      tl.from('.work-title', { opacity: 0, skewY: 5, y: 50, duration: 1 });
      tl.from('.work-gate', { opacity: 0, y: 30, duration: 0.8 }, '-=0.5');
    }
  }

  function handlePageExit(e, url) {
    e.preventDefault();
    gsap.to('.page-wrapper', {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power4.in',
      onComplete: () => { window.location.href = url; }
    });
  }

  // ════════════════════════════════════════════════════════════
  // 3. CURSOR & HOVERS
  // ════════════════════════════════════════════════════════════

  function initCursor() {
    if (!cursor || !cursorFollower) return;
    window.addEventListener('mousemove', (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      gsap.to(cursor, { x: state.mouseX, y: state.mouseY, duration: 0.1 });
      gsap.to(cursorFollower, { x: state.mouseX, y: state.mouseY, duration: 0.3 });
    });

    document.addEventListener('mousedown', () => cursor.classList.add('cursor-active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor-active'));

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('[data-hover]')) {
        cursor.classList.add('cursor-hover');
        cursorFollower.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('[data-hover]')) {
        cursor.classList.remove('cursor-hover');
        cursorFollower.classList.remove('cursor-hover');
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // 4. NAVIGATION MENU
  // ════════════════════════════════════════════════════════════

  function toggleMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    if (menuBtn) menuBtn.classList.toggle('active');
    if (navOverlay) navOverlay.classList.toggle('nav-open');
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';

    if (state.isMenuOpen) {
      gsap.fromTo('.nav-link',
        { y: 100, opacity: 0, skewY: 10 },
        { y: 0, opacity: 1, skewY: 0, duration: 0.8, stagger: 0.1, ease: ease, delay: 0.3 }
      );
    }
  }

  function initNavLinks() {
    const navLinks = $$('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        const preview = link.getAttribute('data-preview');
        if (preview && navPreviewImg) {
          navPreviewImg.src = preview;
          navPreview.classList.add('nav-preview-visible');
        }
      });

      link.addEventListener('mouseleave', () => {
        if (navPreview) navPreview.classList.remove('nav-preview-visible');
      });

      link.addEventListener('click', (e) => {
        const url = link.getAttribute('href');
        if (url !== '#' && !url.startsWith('http')) {
          handlePageExit(e, url);
        }
      });
    });

    const internalLinks = $$('a[href$=".html"]');
    internalLinks.forEach(link => {
      if (!link.classList.contains('nav-link')) {
        link.addEventListener('click', (e) => handlePageExit(e, link.getAttribute('href')));
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // 5. PROJECT ARCHIVE & MODAL
  // ════════════════════════════════════════════════════════════

  function initGallery() {
    const projectsGallery = $('#projects-gallery');
    const viewProjectsBtn = $('#view-projects-btn');
    const galleryClose = $('#gallery-close');

    if (viewProjectsBtn && projectsGallery) {
      viewProjectsBtn.addEventListener('click', () => {
        projectsGallery.classList.add('active');
        gsap.fromTo('.gallery-container', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' });
      });

      if (galleryClose) {
        galleryClose.addEventListener('click', () => {
          gsap.to(projectsGallery, {
            opacity: 0, duration: 0.4, onComplete: () => {
              projectsGallery.classList.remove('active');
              gsap.set(projectsGallery, { opacity: 1 });
            }
          });
        });
      }

      projectsGallery.querySelectorAll('.work-card').forEach(card => {
        card.addEventListener('click', () => openProjectModal(card.getAttribute('data-project')));
      });
    }
  }

  function openProjectModal(id) {
    const data = projectData[id];
    const projectModal = $('#project-modal');
    if (!data || !projectModal) return;

    $('#project-modal-img').src = data.image;
    $('#project-modal-title').textContent = data.title;
    $('#project-modal-category').textContent = data.category;
    $('#project-modal-desc').textContent = data.description;

    const links = $('#project-modal-links');
    links.innerHTML = '';
    if (data.github) {
      const btn = document.createElement('a');
      btn.href = data.github; btn.className = 'project-modal-link'; btn.target = '_blank';
      btn.innerHTML = `${githubIcon}<span>VIEW CODE</span>`;
      links.appendChild(btn);
    }
    if (data.vercel) {
      const btn = document.createElement('a');
      btn.href = data.vercel; btn.className = 'project-modal-link'; btn.target = '_blank';
      btn.innerHTML = `${vercelIcon}<span>LIVE DEMO</span>`;
      links.appendChild(btn);
    }

    projectModal.classList.add('modal-open');
    gsap.fromTo('#project-modal-card', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: ease });
  }

  function closeProjectModal() {
    const card = $('#project-modal-card');
    const modal = $('#project-modal');
    gsap.to(card, {
      y: 50, opacity: 0, duration: 0.4, onComplete: () => {
        modal.classList.remove('modal-open');
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // 6. BLOBS & PARALLAX
  // ════════════════════════════════════════════════════════════

  function initBlobs() {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX - window.innerWidth / 2) * 0.05;
      const y = (e.clientY - window.innerHeight / 2) * 0.05;
      blobs.forEach((blob, i) => {
        if (blob) gsap.to(blob, { x: x * (i + 1), y: y * (i + 1), rotation: x * 0.5, duration: 1, ease: 'power2.out' });
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // 7. INIT
  // ════════════════════════════════════════════════════════════

  function init() {
    // Re-assign refs inside init to ensure DOM is ready
    cursor = $('#cursor');
    cursorFollower = $('#cursor-follower');
    loader = $('#loader');
    loaderCounter = $('#loader-counter');
    loaderStatus = $('#loader-status');
    menuBtn = $('#menu-btn');
    navOverlay = $('#nav-overlay');
    navPreview = $('#nav-preview');
    navPreviewImg = $('#nav-preview-img');
    blobs = [$('#blob-1'), $('#blob-2'), $('#blob-3')];

    runLoader();
    initCursor();
    initBlobs();
    initNavLinks();
    initGallery();
    initGlobalBackground();

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);

    const projectModalClose = $('#project-modal-close');
    const projectModalBackdrop = $('#project-modal-backdrop');
    if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
    if (projectModalBackdrop) projectModalBackdrop.addEventListener('click', closeProjectModal);
  }

  function initGlobalBackground() {
    const container = document.getElementById('global-3d-bg');
    if (!container || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Determine geometry based on page
    let geometry;
    const path = window.location.pathname;

    if (path.includes('design.html')) {
      // Complex, artistic TorusKnot for Designs
      geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
    } else if (path.includes('projects.html')) {
      // Technical Dodecahedron for Projects
      geometry = new THREE.DodecahedronGeometry(2, 0);
    } else if (path.includes('connect.html')) {
      // Sharp, focused Tetrahedron for Connect
      geometry = new THREE.TetrahedronGeometry(2, 0);
    } else {
      // Minimal Icosahedron for Home/About
      geometry = new THREE.IcosahedronGeometry(2.5, 3);
    }

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.2,
      transparent: true,
      opacity: 0.15,
      transmission: 0.99,
      thickness: 0.5,
      wireframe: true
    });
    let artifact;
    if (!path.includes('about.html')) {
      artifact = new THREE.Mesh(geometry, material);
      group.add(artifact);
    }

    // Huge particle cloud covering full screen
    const pCount = 2000;
    const pGeometry = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.4
    });
    const points = new THREE.Points(pGeometry, pMaterial);
    group.add(points);

    camera.position.z = (path.includes('index.html') || path.endsWith('/')) ? 2 : 5;
    group.position.x = 3;
    group.position.y = path.includes('connect.html') ? 0 : -0.3;

    // Handle Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mouse tracking
    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.y = (e.clientY / window.innerHeight) - 0.5;
    });

    function animate() {
      requestAnimationFrame(animate);
      targetRotation.x += (mouse.y * 0.8 - targetRotation.x) * 0.04;
      targetRotation.y += (mouse.x * 0.8 - targetRotation.y) * 0.04;
      group.rotation.x = targetRotation.x;
      group.rotation.y = targetRotation.y;
      if (artifact) artifact.rotation.y -= 0.0005;
      points.rotation.y += 0.001;
      renderer.render(scene, camera);
    }
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
