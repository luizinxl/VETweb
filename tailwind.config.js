/**
 * Tokens do Preset A — "Organic Tech". Troque aqui para mudar o estilo.
 *
 * Escala de espaçamento (Tailwind, base 4px) — use só estes passos:
 *   2 (8px)  · 3 (12px) · 4 (16px) · 5 (20px) · 6 (24px) · 8 (32px) · 10 (40px) · 14 (56px)
 *   Ritmo fixo:  eyebrow → título  = mt-4
 *                título  → texto   = mt-3
 *                ícone   → título  = mt-5
 *                cabeçalho de seção → conteúdo = mt-14
 *                seção (vertical) = classe .section (py-24 / md:py-32)
 *                container        = classe .container-x (max-w-6xl, px-5 / md:px-8)
 *
 * Raios (3 níveis + pílula):  tile 1.25rem · card 2rem · panel 3rem · full
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        moss: 'rgb(var(--c-moss) / <alpha-value>)',
        clay: 'rgb(var(--c-clay) / <alpha-value>)',
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        charcoal: 'rgb(var(--c-charcoal) / <alpha-value>)',
        sage: 'rgb(var(--c-sage) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { tile: '1.25rem', card: '2rem', panel: '3rem' },
      boxShadow: {
        soft: '0 10px 30px -12px rgb(var(--c-charcoal) / 0.18)',
        lift: '0 24px 60px -20px rgb(var(--c-moss) / 0.35)',
      },
      transitionTimingFunction: {
        magnetic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        // Curvas de mola reais (amostradas com linear()), retargetáveis via transition.
        spring: 'var(--ease-spring)',
        'spring-bouncy': 'var(--ease-spring-bouncy)',
      },
      zIndex: {
        noise: '40',
        float: '45',
        nav: '50',
        scrim: '48',
        progress: '60',
        skip: '80',
      },
      spacing: {
        nav: 'var(--nav-h)',
      },
    },
  },
  plugins: [],
}
