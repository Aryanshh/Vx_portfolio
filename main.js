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
    dronaksh: {
      title: 'Dronaksh',
      category: 'Autonomous Drone',
      image: 'assets/dronaksh_profile.png',
      description: 'A high-performance autonomous drone system integrated with computer vision for precision navigation and surveillance.',
      github: 'https://github.com/Aryanshh',
      vercel: 'https://dronaksh.vercel.app'
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
    initGlobalBackground();
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

      // Showcase Hover Interaction
      const showcaseItems = $$('.showcase-item');
      const previewContainer = $('#showcase-preview');
      const previewImg = $('#showcase-preview-img');

      if (previewContainer && showcaseItems.length > 0) {
        showcaseItems.forEach(item => {
          item.addEventListener('mouseenter', () => {
            const imgPath = item.getAttribute('data-img');

            // Detect orientation and exact aspect ratio
            const tempImg = new Image();
            tempImg.src = imgPath;
            tempImg.onload = () => {
              const ratio = tempImg.width / tempImg.height;
              const baseSize = 450; // Max dimension

              if (ratio > 1) {
                // Horizontal
                gsap.to(previewContainer, { width: baseSize, height: baseSize / ratio, duration: 0.6, ease: 'expo.out' });
              } else {
                // Vertical
                gsap.to(previewContainer, { width: baseSize * ratio, height: baseSize, duration: 0.6, ease: 'expo.out' });
              }
            };

            if (previewImg.src !== window.location.origin + '/' + imgPath && !previewImg.src.endsWith(imgPath)) {
              previewImg.src = imgPath;
            }
            gsap.to(previewContainer, {
              opacity: 1,
              scale: 1,
              yPercent: -50,
              duration: 0.5,
              ease: 'power3.out'
            });
            gsap.fromTo(previewImg, { scale: 1.2 }, { scale: 1, duration: 1, ease: 'expo.out' });
          });

          item.addEventListener('mouseleave', () => {
            gsap.to(previewContainer, {
              opacity: 0,
              scale: 0.8,
              yPercent: -50,
              duration: 0.3,
              ease: 'power3.in'
            });
          });
        });
      }

      // Project Card Click Interaction
      const projectCards = $$('.projects-archive-grid .work-card');
      if (projectCards.length > 0) {
        projectCards.forEach(card => {
          card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            openProjectModal(projectId);
          });
        });
      }
    }
  }

  const githubIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`;
  const vercelIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;

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

    // Close logic
    const closeBtn = $('#project-modal-close');
    const backdrop = $('#project-modal-backdrop');
    const close = () => projectModal.classList.remove('modal-open');

    if (closeBtn) closeBtn.onclick = close;
    if (backdrop) backdrop.onclick = close;
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
    initCard3D();

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);

    const projectModalClose = $('#project-modal-close');
    const projectModalBackdrop = $('#project-modal-backdrop');
    if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
    if (projectModalBackdrop) projectModalBackdrop.addEventListener('click', closeProjectModal);
  }

  function initCard3D() {
    const cards = $$('.work-card');
    if (cards.length === 0 || !window.THREE) return;

    cards.forEach((card) => {
      const container = card.querySelector('.work-card-3d-container');
      if (!container) return;

      const projectId = card.getAttribute('data-project');
      const scene = new THREE.Scene();
      
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
      camera.position.z = 3.5;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
      resize();
      
      let mesh;
      const group = new THREE.Group();
      scene.add(group);

      const colorAccent = 0x8B5CF6;
      const mat = new THREE.MeshPhysicalMaterial({
        color: colorAccent,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.85,
        transmission: 0.3,
        thickness: 0.5,
        wireframe: false
      });

      const wireMat = new THREE.MeshBasicMaterial({
        color: colorAccent,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });

      if (projectId === 'dronaksh') {
        const geom1 = new THREE.TorusGeometry(0.8, 0.08, 16, 100);
        const geom2 = new THREE.TorusGeometry(0.6, 0.08, 16, 100);
        const mesh1 = new THREE.Mesh(geom1, mat);
        const mesh2 = new THREE.Mesh(geom2, mat);
        mesh2.rotation.x = Math.PI / 2;
        group.add(mesh1);
        group.add(mesh2);
        mesh = group;
      } else if (projectId === 'monolith') {
        const geom = new THREE.BoxGeometry(0.7, 1.4, 0.7);
        const mainMesh = new THREE.Mesh(geom, mat);
        const wire = new THREE.Mesh(geom, wireMat);
        wire.scale.setScalar(1.02);
        group.add(mainMesh);
        group.add(wire);
        mesh = group;
      } else if (projectId === 'aether') {
        const geom = new THREE.OctahedronGeometry(0.9, 0);
        const mainMesh = new THREE.Mesh(geom, mat);
        const wire = new THREE.Mesh(geom, wireMat);
        wire.scale.setScalar(1.05);
        group.add(mainMesh);
        group.add(wire);
        mesh = group;
      } else if (projectId === 'synapse') {
        const geom = new THREE.IcosahedronGeometry(0.9, 2);
        const pointsMat = new THREE.PointsMaterial({
          color: colorAccent,
          size: 0.04,
          transparent: true,
          opacity: 0.9
        });
        const particles = new THREE.Points(geom, pointsMat);
        const wire = new THREE.Mesh(geom, wireMat);
        group.add(particles);
        group.add(wire);
        mesh = group;
      } else if (projectId === 'horizon') {
        const geom = new THREE.TorusKnotGeometry(0.7, 0.2, 100, 16);
        mesh = new THREE.Mesh(geom, mat);
        group.add(mesh);
      } else if (projectId === 'zenith') {
        const geom = new THREE.DodecahedronGeometry(0.8, 0);
        const mainMesh = new THREE.Mesh(geom, mat);
        const wire = new THREE.Mesh(geom, wireMat);
        wire.scale.setScalar(1.05);
        group.add(mainMesh);
        group.add(wire);
        mesh = group;
      } else {
        const geom = new THREE.SphereGeometry(0.8, 32, 32);
        mesh = new THREE.Mesh(geom, mat);
        group.add(mesh);
      }

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 10);
      pointLight1.position.set(3, 3, 3);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x8B5CF6, 3, 10);
      pointLight2.position.set(-3, -3, 3);
      scene.add(pointLight2);

      const mouse = { x: 0, y: 0 };
      const targetRotation = { x: 0, y: 0 };
      let isHovered = false;

      card.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        mouse.x = 0;
        mouse.y = 0;
      });

      let inView = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          inView = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      observer.observe(card);

      let autoRotY = 0;
      let autoRotX = 0;

      function animate() {
        requestAnimationFrame(animate);
        if (!inView) return;

        autoRotY += 0.01;
        autoRotX += 0.005;

        if (isHovered) {
          targetRotation.y += (mouse.x * 0.8 - targetRotation.y) * 0.1;
          targetRotation.x += (mouse.y * 0.8 - targetRotation.x) * 0.1;
        } else {
          targetRotation.y += (0 - targetRotation.y) * 0.05;
          targetRotation.x += (0 - targetRotation.x) * 0.05;
        }

        group.rotation.x = targetRotation.x + autoRotX;
        group.rotation.y = targetRotation.y + autoRotY;

        if (projectId === 'dronaksh') {
          group.children[0].rotation.z += 0.02;
          group.children[1].rotation.x += 0.02;
        }

        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener('resize', resize);
    });
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

    if (path.includes('design')) {
      // Complex, artistic TorusKnot for Designs
      geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
    } else if (path.includes('projects')) {
      // Technical Dodecahedron for Projects
      geometry = new THREE.DodecahedronGeometry(2, 0);
    } else if (path.includes('connect')) {
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
    if (!path.includes('about')) {
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
