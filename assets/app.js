/**
 * Cimu — Motion System
 * Skill: /animate | Princípios: Intenção > Efeito, Física Intencional, Stagger calculado
 * Stack: GSAP 3 + ScrollTrigger + Canvas (patas ambient) + Web Animations API
 */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Safety-net: só oculta elementos via CSS se o GSAP carregou com sucesso
  document.body.classList.add('gsap-ready');

  // ─── Reduced Motion: fallback estático imediato ──────────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.gs-reveal, .gs-stagger').forEach(el => {
      el.style.opacity = '1';
    });
    return; // para toda a engine de animação
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 1. CANVAS AMBIENT — Patas flutuando no fundo (paw prints orgânicos)
  // ══════════════════════════════════════════════════════════════════════════
  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-canvas';
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
    opacity: 0.045;
  `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, paws = [];

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawPaw(cx, cy, size, color) {
    ctx.fillStyle = color;
    // Almofada central
    ctx.beginPath();
    ctx.ellipse(cx, cy, size * 0.55, size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    // 4 dedos
    const fingers = [
      { dx: -0.6, dy: -0.8, rx: 0.28, ry: 0.22, angle: -0.3 },
      { dx:  0.6, dy: -0.8, rx: 0.28, ry: 0.22, angle:  0.3 },
      { dx: -1.0, dy: -0.3, rx: 0.22, ry: 0.18, angle: -0.5 },
      { dx:  1.0, dy: -0.3, rx: 0.22, ry: 0.18, angle:  0.5 },
    ];
    fingers.forEach(f => {
      ctx.beginPath();
      ctx.ellipse(
        cx + f.dx * size,
        cy + f.dy * size,
        f.rx * size, f.ry * size,
        f.angle, 0, Math.PI * 2
      );
      ctx.fill();
    });
  }

  // Spawn patas
  function spawnPaw() {
    return {
      x: Math.random() * W,
      y: H + 80,
      size: 12 + Math.random() * 22,
      speedY: -(0.18 + Math.random() * 0.28),
      speedX: (Math.random() - 0.5) * 0.12,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.006,
      alpha: 0,
      fadeTarget: 0.6 + Math.random() * 0.4,
      color: '#14b8a6',
    };
  }

  for (let i = 0; i < 22; i++) {
    const p = spawnPaw();
    p.y = Math.random() * H; // distribuição inicial
    p.alpha = Math.random() * 0.6;
    paws.push(p);
  }

  let canvasRunning = true;
  function animatePaws() {
    if (!canvasRunning || document.hidden) {
      requestAnimationFrame(animatePaws);
      return;
    }
    ctx.clearRect(0, 0, W, H);
    paws.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;
      // Fade in
      if (p.alpha < p.fadeTarget) p.alpha = Math.min(p.fadeTarget, p.alpha + 0.005);
      // Reset quando sair do topo
      if (p.y < -80) {
        Object.assign(p, spawnPaw());
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      drawPaw(0, 0, p.size, p.color);
      ctx.restore();
    });
    requestAnimationFrame(animatePaws);
  }
  animatePaws();

  // Pausa quando invisível (otimização de CPU)
  document.addEventListener('visibilitychange', () => {
    canvasRunning = !document.hidden;
  });


  // ══════════════════════════════════════════════════════════════════════════
  // 2. CURSOR PERSONALIZADO — Pata seguidora suave (sem esconder cursor nativo)
  // ══════════════════════════════════════════════════════════════════════════
  const cursor = document.createElement('div');
  cursor.id = 'vet-cursor';
  cursor.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <ellipse cx="12" cy="15" rx="5.5" ry="4.5" fill="#14b8a6" opacity="0.85"/>
    <ellipse cx="7" cy="9.5" rx="2.5" ry="2" fill="#14b8a6" opacity="0.85"/>
    <ellipse cx="17" cy="9.5" rx="2.5" ry="2" fill="#14b8a6" opacity="0.85"/>
    <ellipse cx="4.5" cy="13" rx="2" ry="1.6" fill="#14b8a6" opacity="0.85"/>
    <ellipse cx="19.5" cy="13" rx="2" ry="1.6" fill="#14b8a6" opacity="0.85"/>
  </svg>`;
  cursor.style.cssText = `
    position: fixed; top: 0; left: 0;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    opacity: 0; transition: opacity 0.3s;
    mix-blend-mode: multiply;
    filter: drop-shadow(0 2px 6px rgba(20,184,166,0.4));
  `;
  document.body.appendChild(cursor);

  let mx = 0, my = 0, cx2 = 0, cy2 = 0;
  let cursorVisible = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!cursorVisible) {
      cursorVisible = true;
      cursor.style.opacity = '1';
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorVisible = false;
  });
  document.addEventListener('mouseenter', () => {
    if (cursorVisible) cursor.style.opacity = '1';
  });

  function tickCursor() {
    cx2 += (mx - cx2) * 0.14;
    cy2 += (my - cy2) * 0.14;
    cursor.style.left = cx2 + 'px';
    cursor.style.top  = cy2 + 'px';
    requestAnimationFrame(tickCursor);
  }
  tickCursor();

  // Efeito de escala ao passar em elementos interativos
  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 1.6, duration: 0.25, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' });
    });
  });


  // ══════════════════════════════════════════════════════════════════════════
  // 3. COREOGRAFIA DE ENTRADA & LETRA A LETRA KINÉTICO (HERO H1)
  // ══════════════════════════════════════════════════════════════════════════
  // Topbar e Navbar entram ao carregar
  gsap.fromTo('.topbar', 
    { y: '-100%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 0.65, ease: 'power3.out' }
  );
  gsap.fromTo('.nav',
    { y: -35, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
  );

  const h1 = document.querySelector('.hero-content .h1');
  if (h1) {
    const originalText = h1.textContent.trim();
    const words = originalText.split(/\s+/);
    
    // Split em letras individuais agrupadas em palavras (evita quebra errada de linha)
    h1.innerHTML = words.map(word => {
      const chars = word.split('').map(char => 
        `<span class="char-span">${char}</span>`
      ).join('');
      return `<span class="word-mask">${chars}</span>`;
    }).join(' ');

    // Letras entram em cascata cinética com rotação 3D e foco
    gsap.fromTo(
      h1.querySelectorAll('.char-span'),
      { y: '130%', rotateX: -70, opacity: 0, filter: 'blur(4px)' },
      {
        y: '0%',
        rotateX: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.022,
        delay: 0.25,
      }
    );

    // Subheadline (t1) entra depois com tracking suave
    const sub = document.querySelector('.hero-content .t1');
    if (sub) {
      gsap.fromTo(sub,
        { opacity: 0, y: 25, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out', delay: 0.85 }
      );
    }

    // Hero actions (botões com mola)
    const actions = document.querySelector('.hero-actions');
    if (actions) {
      gsap.fromTo(actions,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.6)', delay: 1.1 }
      );
    }

    // Badge flutuante (queda elástica)
    const badge = document.querySelector('.hero-badge');
    if (badge) {
      gsap.fromTo(badge,
        { opacity: 0, y: 30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(2)', delay: 1.35 }
      );
      // Loop flutuante suave
      gsap.to(badge, {
        y: -7,
        duration: 2.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.2
      });
    }
  }


  // ══════════════════════════════════════════════════════════════════════════
  // 4. PARALLAX HERO — imagem com profundidade
  // ══════════════════════════════════════════════════════════════════════════
  const heroBg = document.querySelector('.hero-background-wrapper');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  }


  // ══════════════════════════════════════════════════════════════════════════
  // 5. SCROLL-REVEAL CINEMATOGRÁFICO — Seções, containers e mídias
  // ══════════════════════════════════════════════════════════════════════════
  document.querySelectorAll('.gs-reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50, scale: 0.97, filter: 'blur(10px) brightness(1.2)' },
      {
        opacity: 1, y: 0, scale: 1, filter: 'blur(0px) brightness(1)',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        }
      }
    );
  });

  // Revelação de Mídias e Fotos com Expansão de Escala e Desfoque
  document.querySelectorAll('.details-img-element, .banner-img-element, .gallery-img-element').forEach(img => {
    gsap.fromTo(img,
      { opacity: 0, scale: 0.9, y: 45, filter: 'blur(8px)' },
      {
        opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: { trigger: img, start: 'top 86%', once: true }
      }
    );
  });


  // ══════════════════════════════════════════════════════════════════════════
  // 6. CARDS — Entrada 3D em cascata sincronizada com física de mola
  // ══════════════════════════════════════════════════════════════════════════
  document.querySelectorAll(
    '.features-grid, .features-grid-2x2, .gallery-carousel, .service-list-grid, .mvv-grid, .team-grid, .blog-grid, .faq-grid, .contact-grid'
  ).forEach(container => {
    const items = container.querySelectorAll('.card, .feature-card, .service-item, .mvv-card, .team-card, .blog-card, .faq-item, .contact-info-card');
    if (!items.length) return;

    gsap.fromTo(items,
      { opacity: 0, y: 75, scale: 0.9, rotateX: 14, filter: 'blur(12px) brightness(1.3)' },
      {
        opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px) brightness(1)',
        duration: 0.85,
        ease: 'power3.out',
        stagger: { amount: 0.45, from: 'start' },
        scrollTrigger: { trigger: container, start: 'top 84%', once: true }
      }
    );
  });

  // 3D Parallax Tilt e Elevação em profundidade Z nos cards
  document.querySelectorAll('.card, .feature-card, .mvv-card, .team-card, .blog-card, .service-item, .contact-info-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.perspective = '1000px';

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const xPct = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const yPct = ((e.clientY - r.top) / r.height - 0.5) * 2;
      
      gsap.to(card, {
        rotateY: xPct * 9,
        rotateX: -yPct * 7,
        scale: 1.03,
        duration: 0.35,
        ease: 'power2.out',
        transformPerspective: 1000,
      });

      const ico = card.querySelector('.card-ico');
      const h3 = card.querySelector('.h3');
      const img = card.querySelector('.card-img');
      if (ico) gsap.to(ico, { z: 30, duration: 0.35, ease: 'power2.out' });
      if (h3) gsap.to(h3, { z: 20, duration: 0.35, ease: 'power2.out' });
      if (img) gsap.to(img, { scale: 1.06, duration: 0.45, ease: 'power2.out' });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0, rotateX: 0, scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
        transformPerspective: 1000,
      });
      const ico = card.querySelector('.card-ico');
      const h3 = card.querySelector('.h3');
      const img = card.querySelector('.card-img');
      if (ico) gsap.to(ico, { z: 0, duration: 0.5, ease: 'power2.out' });
      if (h3) gsap.to(h3, { z: 0, duration: 0.5, ease: 'power2.out' });
      if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
    });
  });


  // ══════════════════════════════════════════════════════════════════════════
  // 7. PROOF BAR — Counter numérico animado ao entrar na tela
  // ══════════════════════════════════════════════════════════════════════════
  const proofSection = document.querySelector('.proof');
  if (proofSection) {
    const proofItems = proofSection.querySelectorAll('.proof-item');

    ScrollTrigger.create({
      trigger: proofSection,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        proofItems.forEach((item, i) => {
          gsap.fromTo(item,
            { opacity: 0, y: 20, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: i * 0.1 }
          );
        });
      }
    });

    // Stat numbers — counters
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
      const suffix = el.textContent.replace(/[0-9.]/g, '');
      const prefix = el.textContent.match(/^\D*/) ? el.textContent.match(/^\D*/)[0].replace(/[0-9.]/g, '') : '';

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.fromTo({ val: 0 },
            { val: 0 },
            {
              val: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: function () {
                el.textContent = prefix + (Number.isInteger(target)
                  ? Math.round(this.targets()[0].val)
                  : this.targets()[0].val.toFixed(1)) + suffix;
              }
            }
          );
        }
      });
    });
  }


  // ══════════════════════════════════════════════════════════════════════════
  // 8. BOTÕES MAGNÉTICOS — Física de campo gravitacional
  // ══════════════════════════════════════════════════════════════════════════
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.style.willChange = 'transform';

    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        scale: 1.05,
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0, y: 0, scale: 1,
        duration: 0.9,
        ease: 'elastic.out(1, 0.3)',
      });
    });

    btn.addEventListener('mousedown', () => {
      gsap.to(btn, { scale: 0.96, duration: 0.1 });
    });
    btn.addEventListener('mouseup', () => {
      gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'back.out(2)' });
    });
  });


  // ══════════════════════════════════════════════════════════════════════════
  // 9. BORDER SHEEN — reflexo de luz que varre as cards ao entrar no scroll
  // ══════════════════════════════════════════════════════════════════════════
  function addSheen(card) {
    if (card.querySelector('.sheen-overlay')) return;
    const sheen = document.createElement('div');
    sheen.className = 'sheen-overlay';
    sheen.style.cssText = `
      position: absolute; top: 0; left: -100%;
      width: 60%; height: 100%;
      background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 60%, transparent 80%);
      pointer-events: none; z-index: 5;
    `;
    // card precisa de position relative
    const prev = window.getComputedStyle(card).position;
    if (prev === 'static') card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(sheen);

    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(sheen, {
          left: '150%',
          duration: 0.9,
          delay: 0.3,
          ease: 'power2.inOut',
        });
      }
    });
  }

  document.querySelectorAll('.feature-card, .contact-info-card, .mvv-card, .review-card').forEach(addSheen);


  // ══════════════════════════════════════════════════════════════════════════
  // 10. NAV — Sticky transform: scale + shadow ao scrollar
  // ══════════════════════════════════════════════════════════════════════════
  const nav = document.querySelector('.nav');
  if (nav) {
    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: self => {
        if (self.progress > 0) {
          nav.style.boxShadow = '0 8px 32px rgba(20,184,166,0.10)';
          nav.style.backdropFilter = 'blur(24px)';
        } else {
          nav.style.boxShadow = 'none';
        }
      }
    });
  }


  // ══════════════════════════════════════════════════════════════════════════
  // 11. HEADINGS & LETRAS — Revelação por palavra com máscara de clip e 3D
  // ══════════════════════════════════════════════════════════════════════════
  document.querySelectorAll(
    '.section-header .h2, .intro-left .h2, .details-content .h2, .banner-content .h2, .page-hero .h1, .section-title, .faq-header .h2, .service-hero h1, .contact-hero h1, .blog-hero h1'
  ).forEach(el => {
    if (el.closest('.hero-content')) return; // H1 do hero já tem animação letra por letra
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map(w => `<span class="word-mask"><span class="word-inner">${w}</span></span> `)
      .join('');

    gsap.fromTo(
      el.querySelectorAll('.word-inner'),
      { y: '125%', rotateX: -55, opacity: 0, filter: 'blur(4px)' },
      {
        y: '0%', rotateX: 0, opacity: 1, filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.045,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });


  // ══════════════════════════════════════════════════════════════════════════
  // 12. TIMELINE ITEMS (Página Sobre) — entrada lateral com trilho
  // ══════════════════════════════════════════════════════════════════════════
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    const year = item.querySelector('.timeline-year');
    const card = item.querySelector('.timeline-card');

    if (year) gsap.fromTo(year,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: item, start: 'top 85%' } }
    );

    if (card) gsap.fromTo(card,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: item, start: 'top 85%' } }
    );
  });


  // ══════════════════════════════════════════════════════════════════════════
  // 13. GALLERY CAROUSEL — scroll horizontal com parallax interno
  // ══════════════════════════════════════════════════════════════════════════
  const galleryImgs = document.querySelectorAll('.gallery-img-element');
  galleryImgs.forEach((img, i) => {
    gsap.fromTo(img,
      { opacity: 0, x: 60, scale: 0.92 },
      {
        opacity: 1, x: 0, scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.12,
        scrollTrigger: { trigger: img, start: 'top 88%' }
      }
    );
    // Parallax interno na imagem
    gsap.to(img, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });
  });


  // ══════════════════════════════════════════════════════════════════════════
  // 14. BLOG CARDS — entrada em onda (wave stagger)
  // ══════════════════════════════════════════════════════════════════════════
  const blogGrid = document.querySelector('.blog-grid');
  if (blogGrid) {
    const blogCards = blogGrid.querySelectorAll('.blog-card');
    gsap.fromTo(blogCards,
      { opacity: 0, y: 60, rotateY: -12 },
      {
        opacity: 1, y: 0, rotateY: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: { amount: 0.45, from: 'start' },
        scrollTrigger: { trigger: blogGrid, start: 'top 82%' }
      }
    );
  }


  // ══════════════════════════════════════════════════════════════════════════
  // 15. PROOF ITEMS — entrada com bounce em sequência
  // ══════════════════════════════════════════════════════════════════════════
  const proofItems2 = document.querySelectorAll('.proof-item');
  if (proofItems2.length) {
    gsap.fromTo(proofItems2,
      { opacity: 0, y: 24, scale: 0.85 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.55,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        scrollTrigger: { trigger: proofItems2[0], start: 'top 90%' }
      }
    );
  }


  // ══════════════════════════════════════════════════════════════════════════
  // 16. BARRA DE PROGRESSO DE SCROLL ULTRA-SUAVE
  // ══════════════════════════════════════════════════════════════════════════
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
  }


  // ══════════════════════════════════════════════════════════════════════════
  // 17. SPOTLIGHT DINÂMICO NOS CARDS (Tracking do cursor em coordenadas locais)
  // ══════════════════════════════════════════════════════════════════════════
  document.querySelectorAll('.card, .feature-card, .service-item, .blog-card, .mvv-card, .review-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  // ══════════════════════════════════════════════════════════════════════════
  // 18. FLOATING WHATSAPP BUTTON — Física Magnética e Hover Reativo
  // ══════════════════════════════════════════════════════════════════════════
  const waFab = document.querySelector('.floating-wa-btn');
  if (waFab) {
    waFab.addEventListener('mousemove', e => {
      const r = waFab.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(waFab, {
        x: x * 0.3,
        y: y * 0.3,
        scale: 1.08,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    waFab.addEventListener('mouseleave', () => {
      gsap.to(waFab, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  }
});
