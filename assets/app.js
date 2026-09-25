/**
 * Cimu — Motion System v14
 *
 * Princípios:
 *  - Progressive enhancement: sem GSAP o site continua 100% visível e navegável.
 *  - Nada é escondido por CSS; o estado inicial é definido pelo GSAP no mesmo frame.
 *  - Efeitos de mouse (tilt, cursor, magnético) só existem em dispositivos com mouse.
 *  - Só animamos transform/opacity (compositor), sem blur em elementos grandes.
 *  - prefers-reduced-motion desliga toda a coreografia.
 */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const saveData     = !!(navigator.connection && navigator.connection.saveData);
  const hasGSAP      = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ────────────────────────────────────────────────────────────────────────
   * A. Recursos independentes de GSAP (sempre ativos)
   * ──────────────────────────────────────────────────────────────────────── */

  // A1. Nav: sombra ao rolar, esconde ao descer e volta ao subir; progresso de leitura
  const nav = $('.nav');
  const progress = $('#scroll-progress');
  let lastY = window.scrollY, ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle('is-scrolled', y > 24);
      const goingDown = y > lastY + 4;
      const goingUp   = y < lastY - 4;
      if (goingDown && y > 320) nav.classList.add('nav--hidden');
      else if (goingUp || y < 320) nav.classList.remove('nav--hidden');
    }
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // A2. Foco no teclado nunca deixa a nav escondida
  if (nav) nav.addEventListener('focusin', () => nav.classList.remove('nav--hidden'));

  // A3. Linha do tempo (Sobre): acessível por teclado
  $$('.timeline-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
    item.addEventListener('click', () => {
      $$('.timeline-item').forEach(el => el.setAttribute('aria-expanded', el === item ? 'true' : 'false'));
      if (matchMedia('(max-width: 992px)').matches) {
        item.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  });

  // A4. Filtros do blog: estado ativo (aria-pressed)
  const filters = $$('.filter-btn');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => {
      const on = b === btn;
      b.classList.toggle('filter-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }));

  // A5. Formulários de demonstração: validação leve + confirmação visível
  $$('form[data-demo-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const status = form.nextElementSibling && form.nextElementSibling.classList.contains('form-status')
        ? form.nextElementSibling : null;
      const invalid = $$('input[required], select[required], textarea[required]', form).find(el => !el.checkValidity());
      if (invalid) { invalid.focus(); invalid.reportValidity && invalid.reportValidity(); return; }
      if (status) {
        status.innerHTML = '<i class="ph-fill ph-check-circle" aria-hidden="true"></i> Recebido! Entraremos em contato em breve.';
        status.classList.add('is-visible');
      }
      form.reset();
    });
  });

  // A6. Contadores numéricos (respeita formato pt-BR: "5.000+", "4.9 ★")
  function parseStat(text) {
    const m = text.trim().match(/^(\D*?)(\d[\d.,]*)(.*)$/);
    if (!m) return null;
    const [, prefix, num, suffix] = m;
    const thousands = /^\d{1,3}(\.\d{3})+$/.test(num);
    const value = thousands ? parseInt(num.replace(/\./g, ''), 10) : parseFloat(num.replace(',', '.'));
    if (Number.isNaN(value)) return null;
    const decimals = thousands || Number.isInteger(value) ? 0 : (num.split(/[.,]/)[1] || '').length;
    return { prefix, suffix, value, decimals, thousands };
  }
  const fmt = (n, s) => (s.thousands ? Math.round(n).toLocaleString('pt-BR') : n.toFixed(s.decimals));

  /* ────────────────────────────────────────────────────────────────────────
   * B. Motion (GSAP) — só se disponível e sem "reduzir movimento"
   * ──────────────────────────────────────────────────────────────────────── */
  if (!hasGSAP || reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  // B1. Canvas ambiente: patas flutuando (leve, com DPR e pausa fora de foco)
  if (!saveData) {
    const canvas = document.createElement('canvas');
    canvas.id = 'ambient-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, paws = [], raf = 0;

    const spawn = (initial = false) => ({
      x: Math.random() * W,
      y: initial ? Math.random() * H : H + 60,
      size: 12 + Math.random() * 20,
      vy: -(0.16 + Math.random() * 0.26),
      vx: (Math.random() - 0.5) * 0.12,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.006,
      a: initial ? Math.random() * 0.7 : 0,
      aMax: 0.5 + Math.random() * 0.5,
    });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(7, Math.min(18, Math.round(W / 80)));
      while (paws.length < count) paws.push(spawn(true));
      paws.length = count;
    }
    resize();
    let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(resize, 150); });

    function drawPaw(size) {
      ctx.beginPath(); ctx.ellipse(0, 0, size * 0.55, size * 0.45, 0, 0, 6.2832); ctx.fill();
      [[-0.6, -0.8, 0.28, 0.22, -0.3], [0.6, -0.8, 0.28, 0.22, 0.3], [-1, -0.3, 0.22, 0.18, -0.5], [1, -0.3, 0.22, 0.18, 0.5]]
        .forEach(([dx, dy, rx, ry, ang]) => {
          ctx.beginPath(); ctx.ellipse(dx * size, dy * size, rx * size, ry * size, ang, 0, 6.2832); ctx.fill();
        });
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#14b8a6';
      for (const p of paws) {
        p.y += p.vy; p.x += p.vx; p.rot += p.vr;
        if (p.a < p.aMax) p.a = Math.min(p.aMax, p.a + 0.005);
        if (p.y < -60) Object.assign(p, spawn());
        ctx.save(); ctx.globalAlpha = p.a; ctx.translate(p.x, p.y); ctx.rotate(p.rot); drawPaw(p.size); ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const stop  = () => { cancelAnimationFrame(raf); raf = 0; };
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    start();
  }

  // B2. Cursor de pata (somente mouse) — quickTo, sem loop de rAF próprio
  if (finePointer) {
    const cursor = document.createElement('div');
    cursor.id = 'vet-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32" fill="#14b8a6" opacity="0.85">
      <ellipse cx="12" cy="15" rx="5.5" ry="4.5"/><ellipse cx="7" cy="9.5" rx="2.5" ry="2"/>
      <ellipse cx="17" cy="9.5" rx="2.5" ry="2"/><ellipse cx="4.5" cy="13" rx="2" ry="1.6"/>
      <ellipse cx="19.5" cy="13" rx="2" ry="1.6"/></svg>`;
    document.body.appendChild(cursor);
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    const cx = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
    const cy = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      cx(e.clientX); cy(e.clientY);
      cursor.classList.add('is-visible');
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));

    const interactive = 'a, button, [role="button"], .card, .feature-card, .service-item, .blog-card';
    document.addEventListener('pointerover', e => {
      if (e.target.closest && e.target.closest(interactive)) gsap.to(cursor, { scale: 1.6, rotate: -12, duration: 0.3, overwrite: 'auto' });
    });
    document.addEventListener('pointerout', e => {
      if (e.target.closest && e.target.closest(interactive)) gsap.to(cursor, { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
    });
  }

  // B3. Entrada da nav
  if (nav) gsap.from(nav, { yPercent: -100, opacity: 0, duration: 0.8, delay: 0.05, clearProps: 'transform,opacity' });

  // B4. Hero da Home — coreografia em timeline única
  const hero = $('.hero-cards');
  if (hero) {
    const tl = gsap.timeline({ delay: 0.15, defaults: { clearProps: 'transform,opacity' } });
    tl.from($('.hero-copy', hero), { opacity: 0, y: 30, scale: 0.97, duration: 0.9 })
      .from($('.hero-tag', hero), { opacity: 0, y: 16, duration: 0.6 }, '-=0.55')
      .from($$('.line-inner', hero), { yPercent: 115, duration: 1, stagger: 0.14, ease: 'power4.out' }, '-=0.45')
      .from($('.hero-lead', hero), { opacity: 0, y: 18, duration: 0.7 }, '-=0.6')
      .from($$('.hero-actions .btn', hero), { opacity: 0, y: 18, scale: 0.94, stagger: 0.1, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.5')
      .from($('.hero-float', hero), { opacity: 0, x: 40, duration: 0.9 }, '-=0.8')
      .from($$('.hero-stat', hero), { opacity: 0, y: 24, stagger: 0.08, duration: 0.6 }, '-=0.5');
    const stats = $('.hero-stats-wrap', hero);
    if (stats) tl.from(stats, { opacity: 0, y: 30, duration: 0.8 }, 0.9);

    // Parallax do vídeo (apenas telas grandes; no celular economiza GPU)
    const media = $('.hero-media', hero);
    if (media) {
      gsap.matchMedia().add('(min-width: 769px)', () => {
        gsap.to(media, {
          yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    }
  }

  // B5. Títulos: revelação palavra a palavra com máscara (só texto puro)
  $$('.section-header .h2, .intro-left .h2, .details-content .h2, .banner-content .h2, .page-hero .h1, .section-title, .faq-header .h2')
    .forEach(el => {
      if (el.childElementCount || el.closest('.hero-cards')) return;
      const text = el.textContent.trim();
      el.setAttribute('aria-label', text);
      el.innerHTML = text.split(/\s+/)
        .map(w => `<span class="word-mask" aria-hidden="true"><span class="word-inner">${w}</span></span>`)
        .join(' ');
      gsap.from($$('.word-inner', el), {
        yPercent: 115, rotate: 4, duration: 0.85, stagger: 0.05, ease: 'power4.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
    });

  // B6. Reveal genérico: .gs-reveal e .gs-stagger (todos os tipos de cards/itens),
  //     agrupados por ScrollTrigger.batch para cascata natural.
  const revealTargets = $$('.gs-reveal, .gs-stagger').filter(el => !el.closest('.hero-cards'));
  const revealSet = new Set(revealTargets);
  const revealList = Array.from(revealSet);
  if (revealList.length) {
    gsap.set(revealList, { opacity: 0, y: 40 });
    ScrollTrigger.batch(revealList, {
      start: 'top 92%',
      once: true,
      onEnter: batch => gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.85, stagger: 0.09, overwrite: 'auto',
        clearProps: 'transform,opacity',
      }),
    });
  }

  // B7. Imagens de destaque: zoom suave ao entrar
  $$('.details-img-element, .banner-img-element, .why-us-card img').forEach(img => {
    gsap.from(img, {
      scale: 1.12, duration: 1.4, ease: 'power3.out', clearProps: 'transform',
      scrollTrigger: { trigger: img, start: 'top 90%', once: true },
    });
  });

  // B8. Contadores
  $$('.stat-number').forEach(el => {
    const s = parseStat(el.textContent);
    if (!s) return;
    const original = el.textContent;
    el.textContent = s.prefix + fmt(0, s) + s.suffix;
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => gsap.to(obj, {
        v: s.value, duration: 2, ease: 'power2.out',
        onUpdate: () => { el.textContent = s.prefix + fmt(obj.v, s) + s.suffix; },
        onComplete: () => { el.textContent = original; },
      }),
    });
  });

  // B9. Tilt 3D + spotlight nos cards e botões magnéticos (somente mouse)
  if (finePointer) {
    const tiltSel = '.card, .feature-card, .mvv-card, .team-card, .blog-card, .service-item, .contact-info-card, .review-card';
    $$(tiltSel)
      .filter(c => !c.matches('.liquid-glass, .liquid-glass-dark, .why-us-card, .map-wrapper, .faq-item, .newsletter-card, .hero-stats'))
      .forEach(card => {
        card.classList.add('is-tilt');
        let rx, ry, ty; // criados no 1º hover, depois do reveal de entrada
        card.addEventListener('pointerenter', e => {
          if (e.pointerType !== 'mouse') return;
          gsap.set(card, { transformPerspective: 900 });
          if (!rx) {
            rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2.out' });
            ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2.out' });
            ty = gsap.quickTo(card, 'y',         { duration: 0.5, ease: 'power2.out' });
          }
        });
        card.addEventListener('pointermove', e => {
          if (e.pointerType !== 'mouse' || !rx) return;
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          ry((px - 0.5) * 8); rx(-(py - 0.5) * 6); ty(-6);
          card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
        });
        card.addEventListener('pointerleave', () => { if (rx) { rx(0); ry(0); ty(0); } });
      });

    $$('.btn-magnetic').forEach(btn => {
      let bx, by;
      btn.addEventListener('pointerenter', e => {
        if (e.pointerType !== 'mouse' || bx) return;
        bx = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
        by = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      });
      btn.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse' || !bx) return;
        const r = btn.getBoundingClientRect();
        bx((e.clientX - (r.left + r.width / 2)) * 0.28);
        by((e.clientY - (r.top + r.height / 2)) * 0.32);
      });
      btn.addEventListener('pointerleave', () => { if (bx) { bx(0); by(0); } });
    });
  }

  // B10. Selo do hero/badges: microinteração de entrada nos "tags"
  $$('.page-tag:not(.gs-reveal)').forEach(tag => {
    gsap.from(tag, { opacity: 0, x: -20, duration: 0.7, clearProps: 'transform,opacity', delay: 0.2 });
  });

  // B11. Recalcula posições quando fontes/imagens terminam de carregar
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
