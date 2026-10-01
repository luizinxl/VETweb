import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight, MapPin, Menu, MessageCircle, Phone, Siren, Mail, Instagram, X, PawPrint,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ */
/* Conteúdo da marca                                                    */
/* ------------------------------------------------------------------ */
export const BRAND = {
  name: 'Cimu',
  phoneLabel: '(11) 99999-9999',
  phoneHref: 'tel:+5511999999999',
  whatsappNumber: '5511999999999',
  whatsapp: 'https://wa.me/5511999999999?text=' + encodeURIComponent('Olá! Gostaria de agendar uma consulta para o meu pet.'),
  email: 'contato@cimu.com.br',
  address: 'Av. dos Animais, 123 — Centro, São Paulo - SP',
  instagram: 'https://instagram.com',
}

// Dias: 0 = domingo. null = só emergência.
export const HOURS = { 0: null, 1: [8, 20], 2: [8, 20], 3: [8, 20], 4: [8, 20], 5: [8, 20], 6: [8, 18] }
export const HOURS_ROWS = [['Segunda a sexta', '08h às 20h'], ['Sábado', '08h às 18h'], ['Domingo', 'Emergência 24h']]

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Serviços', to: '/servicos' },
  { label: 'Especialidades', to: '/especialidades' },
  { label: 'Sobre nós', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
]

/* ------------------------------------------------------------------ */
/* Roteamento simples (History API)                                     */
/* ------------------------------------------------------------------ */
const subscribe = (cb) => {
  window.addEventListener('popstate', cb)
  return () => window.removeEventListener('popstate', cb)
}
export const usePath = () => useSyncExternalStore(subscribe, () => window.location.pathname)

export function navigate(to) {
  const [path, hash] = to.split('#')
  const samePage = (path || '/') === window.location.pathname
  if (!samePage) {
    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  requestAnimationFrame(() => {
    const el = hash && document.getElementById(hash)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Troca de página: salto instantâneo ao topo (sem scroll suave atrasando o conteúdo novo).
    if (el) el.scrollIntoView({ behavior: samePage && !reduce ? 'smooth' : 'auto' })
    else if (!samePage) window.scrollTo({ top: 0, behavior: 'instant' })
  })
}

export function Link({ to, onClick, ...rest }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onClick?.(e)
        navigate(to)
      }}
      {...rest}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Hooks                                                                */
/* ------------------------------------------------------------------ */
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Revelação no scroll — usada por todas as páginas. overwrite: 'auto' torna cada tween interrompível. */
export function useReveal(deps = []) {
  const root = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.reveal').forEach((el) => {
          gsap.from(el, { y: 32, opacity: 0, duration: 0.9, ease: 'power3.out', overwrite: 'auto', scrollTrigger: { trigger: el, start: 'top 88%' } })
        })
        gsap.set('.reveal-item', { y: 32, opacity: 0 })
        ScrollTrigger.batch('.reveal-item', {
          start: 'top 92%',
          onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12, overwrite: 'auto' }),
        })
      })
      ScrollTrigger.refresh()
    }, root)
    return () => ctx.revert()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return root
}

export function useOpenStatus() {
  const compute = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false,
    }).formatToParts(new Date())
    const get = (t) => parts.find((p) => p.type === t)?.value
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
    const h = (Number(get('hour')) % 24) + Number(get('minute')) / 60
    const range = HOURS[day]
    if (range && h >= range[0] && h < range[1]) return { open: true, label: `Aberto agora · até ${range[1]}h` }
    return { open: false, label: 'Clínica fechada · emergência 24h ativa' }
  }
  const [status, setStatus] = useState(compute)
  useEffect(() => {
    const id = setInterval(() => setStatus(compute()), 60_000)
    return () => clearInterval(id)
  }, [])
  return status
}

/* ------------------------------------------------------------------ */
/* Peças de UI                                                          */
/* ------------------------------------------------------------------ */
export function Button({ href, to, children, variant = 'clay', className = '', ...rest }) {
  const styles = {
    clay: ['bg-clay text-cream', 'bg-moss'],
    cream: ['bg-cream text-moss', 'bg-clay'],
    ghost: ['border border-cream/40 text-cream', 'bg-cream/15'],
    moss: ['bg-moss text-cream', 'bg-charcoal'],
  }[variant]
  const Tag = to ? Link : 'a'
  return (
    <Tag href={href} to={to} className={`btn ${styles[0]} ${variant === 'cream' ? '[@media(hover:hover)]:hover:text-cream' : ''} ${className}`} {...rest}>
      <span className={`btn-bg ${styles[1]}`} aria-hidden="true" />
      <span className="btn-label">{children}</span>
    </Tag>
  )
}

export function StatusPill({ className = '' }) {
  const status = useOpenStatus()
  return (
    <span className={`inline-flex items-center gap-2.5 rounded-full bg-cream/10 px-4 py-2 ring-1 ring-cream/20 backdrop-blur-md ${className}`}>
      <span className={`pulse-dot h-2 w-2 rounded-full ${status.open ? 'bg-sage text-sage' : 'bg-clay text-clay'}`} />
      <span className="eyebrow text-cream/90">{status.label}</span>
    </span>
  )
}

/* Cabeçalho de seção — o mesmo ritmo em todo o site (eyebrow → mt-4 → título → mt-3 → texto). */
export function SectionHead({ eyebrow, title, accent, text, id, dark = false, aside }) {
  return (
    <div className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <span className="eyebrow inline-flex items-center gap-2 text-clay"><PawPrint className="h-3.5 w-3.5" aria-hidden="true" /> {eyebrow}</span>
        <h2 id={id} className={`t-section mt-4 ${dark ? 'text-cream' : 'text-moss'}`}>
          {title}{accent && <> <em className="font-serif font-medium text-clay">{accent}</em></>}
        </h2>
        {text && <p className={`mt-3 max-w-xl ${dark ? 'text-cream/75' : 'text-charcoal/70'}`}>{text}</p>}
      </div>
      {aside && <div className="shrink-0 md:pb-1">{aside}</div>}
    </div>
  )
}

export function Logo({ light }) {
  return (
    <Link to="/" aria-label="Cimu — página inicial" className={`lift flex min-h-[44px] items-center gap-2 font-display text-xl font-bold tracking-tight transition-colors duration-300 ${light ? 'text-cream' : 'text-moss'}`}>
      <PawPrint className="h-6 w-6 text-clay" strokeWidth={2.4} aria-hidden="true" />
      {BRAND.name}
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* A. Navbar — materializa ao rolar; menu mobile com material + scrim  */
/* ------------------------------------------------------------------ */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const path = usePath()
  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  const light = !scrolled && !open

  return (
    <>
      {/* Scrim: escurece o fundo para dar foco ao menu */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-scrim bg-charcoal/30 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <header className="fixed inset-x-0 top-0 z-nav flex justify-center px-4 pt-4">
        <nav
          aria-label="Principal"
          className={`flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-magnetic md:px-5 ${
            light ? 'bg-transparent' : 'glass shadow-soft ring-1 ring-moss/10'
          }`}
        >
          <Logo light={light} />
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((l) => {
              const active = path === l.to
              return (
                <li key={l.to}>
                  <Link to={l.to} aria-current={active ? 'page' : undefined}
                    className={`lift flex min-h-[44px] items-center rounded-full px-4 text-sm font-medium transition-colors duration-300 ${
                      light
                        ? active ? 'bg-cream/15 text-cream' : 'text-cream/80 hover:text-cream'
                        : active ? 'bg-moss text-cream' : 'text-charcoal/70 hover:text-moss'
                    }`}>
                    {l.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="flex items-center gap-2">
            <Button href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="hidden !px-5 !py-2.5 sm:inline-flex">
              Agendar consulta
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              className={`lift grid h-11 w-11 place-items-center rounded-full transition-colors duration-300 lg:hidden ${light ? 'text-cream' : 'text-moss'}`}
            >
              <span className="relative h-6 w-6">
                <Menu className={`absolute inset-0 transition-all duration-300 ease-spring ${open ? 'rotate-90 scale-50 opacity-0' : ''}`} aria-hidden="true" />
                <X className={`absolute inset-0 transition-all duration-300 ease-spring ${open ? '' : '-rotate-90 scale-50 opacity-0'}`} aria-hidden="true" />
              </span>
            </button>
          </div>
        </nav>

        <div
          id="menu-mobile"
          inert={!open}
          className={`glass absolute inset-x-4 top-[4.75rem] origin-top rounded-card p-5 shadow-lift ring-1 ring-moss/10 transition-[opacity,transform] duration-500 ease-spring lg:hidden ${
            open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-2 scale-[0.97] opacity-0'
          }`}
        >
          <ul className="flex flex-col gap-1">
            {NAV.map((l, i) => (
              <li key={l.to} style={{ transitionDelay: open ? `${60 + i * 35}ms` : '0ms' }}
                className={`transition-[opacity,transform] duration-500 ease-spring ${open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}>
                <Link to={l.to} onClick={() => setOpen(false)} aria-current={path === l.to ? 'page' : undefined}
                  className={`flex min-h-[48px] items-center justify-between rounded-tile px-4 font-display text-lg ${path === l.to ? 'bg-moss text-cream' : 'text-moss hover:bg-moss/5'}`}>
                  {l.label} <PawPrint className={`h-4 w-4 ${path === l.to ? 'text-clay' : 'opacity-20'}`} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <Button href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-4 w-full">
            Agendar consulta <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Cabeçalho das páginas internas                                       */
/* ------------------------------------------------------------------ */
export function PageHero({ eyebrow, title, accent, text, img, imgPosition, children }) {
  const root = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } })
          .from('.ph-img', { scale: 1.08, duration: 1.6, ease: 'power2.out' })
          .from('.ph-line', { yPercent: 110, duration: 0.9, stagger: 0.08 }, '-=1.3')
          .from('.ph-fade', { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.5')
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={root} className="relative flex min-h-[72dvh] items-end overflow-hidden bg-moss text-cream">
      {img && (
        <img src={img} alt="" aria-hidden="true" fetchPriority="high" decoding="async" width="1400" height="933"
          style={{ objectPosition: imgPosition }} className="ph-img absolute inset-0 h-full w-full object-cover will-change-transform" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-moss/75 to-moss/30" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 to-transparent" aria-hidden="true" />
      <div className="container-x relative pb-14 pt-36 md:pb-20">
        <span className="ph-fade eyebrow inline-flex items-center gap-2 text-clay"><PawPrint className="h-3.5 w-3.5" aria-hidden="true" /> {eyebrow}</span>
        <h1 className="mt-4 max-w-4xl">
          <span className="block overflow-hidden">
            <span className="ph-line t-page block">{title}</span>
          </span>
          {accent && (
            <span className="block overflow-hidden pb-2">
              <span className="ph-line t-page-accent block text-clay">{accent}</span>
            </span>
          )}
        </h1>
        {text && <p className="ph-fade mt-6 max-w-xl text-base text-cream/80 md:text-lg">{text}</p>}
        {children && <div className="ph-fade mt-8 flex flex-wrap items-center gap-3">{children}</div>}
      </div>
    </section>
  )
}

/* Faixa de chamada final, reaproveitada nas páginas. `spaced` adiciona respiro acima quando a seção anterior é colorida. */
export function CtaBand({ title = 'Pronto para cuidar de quem você ama?', text = 'Agende pelo WhatsApp ou ligue. Para emergências, atendemos 24 horas.', spaced = false }) {
  return (
    <section className={`container-x pb-24 md:pb-32 ${spaced ? 'pt-24 md:pt-32' : ''}`}>
      <div className="reveal relative overflow-hidden rounded-panel bg-clay px-6 py-14 text-cream md:px-14 md:py-16">
        <PawPrint className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 rotate-12 text-cream/10" aria-hidden="true" />
        <PawPrint className="pointer-events-none absolute bottom-4 right-40 hidden h-16 w-16 -rotate-12 text-cream/10 sm:block" aria-hidden="true" />
        <h2 className="t-section relative max-w-2xl">{title}</h2>
        <p className="relative mt-3 max-w-xl text-cream/85">{text}</p>
        <div className="relative mt-8 flex flex-wrap gap-3">
          <Button href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" variant="cream"><MessageCircle className="h-4 w-4" /> Agendar consulta</Button>
          <Button href={BRAND.phoneHref} variant="ghost"><Siren className="h-4 w-4" /> Emergência 24h</Button>
        </div>
      </div>
    </section>
  )
}

export function MapFrame({ className = '' }) {
  return (
    <iframe
      title={`Mapa: ${BRAND.address}`}
      src={`https://maps.google.com/maps?q=${encodeURIComponent(BRAND.address)}&z=15&output=embed`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={`h-full w-full grayscale-[60%] contrast-[1.05] ${className}`}
    />
  )
}

/* ------------------------------------------------------------------ */
/* H. Contato e localização (Home)                                      */
/* ------------------------------------------------------------------ */
export function Contact() {
  const status = useOpenStatus()
  return (
    <section id="contato" className="container-x pb-24 md:pb-32">
      <div className="grid overflow-hidden rounded-panel bg-moss text-cream md:grid-cols-2">
        <div className="p-8 md:p-14">
          <span className="eyebrow inline-flex items-center gap-2 text-clay"><PawPrint className="h-3.5 w-3.5" aria-hidden="true" /> Contato</span>
          <h2 className="t-section mt-4">
            Vamos cuidar <em className="font-serif font-medium text-clay">juntos?</em>
          </h2>
          <div className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-cream/10 px-4 py-2">
            <span className={`pulse-dot h-2 w-2 rounded-full ${status.open ? 'bg-sage text-sage' : 'bg-clay text-clay'}`} />
            <span className="eyebrow text-cream/85">{status.label}</span>
          </div>

          <dl className="mt-8 divide-y divide-cream/10 border-y border-cream/10">
            {HOURS_ROWS.map(([d, h]) => (
              <div key={d} className="flex justify-between py-3 text-sm">
                <dt className="text-cream/70">{d}</dt>
                <dd className="font-mono">{h}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-clay" aria-hidden="true" /> {BRAND.address}</li>
            <li><a className="lift flex min-h-[44px] items-center gap-3" href={BRAND.phoneHref}><Phone className="h-5 w-5 text-clay" aria-hidden="true" /> {BRAND.phoneLabel}</a></li>
            <li><a className="lift flex min-h-[44px] items-center gap-3" href={`mailto:${BRAND.email}`}><Mail className="h-5 w-5 text-clay" aria-hidden="true" /> {BRAND.email}</a></li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> Agendar pelo WhatsApp
            </Button>
            <Button to="/contato" variant="ghost">
              Mais formas de contato <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] md:aspect-auto">
          <MapFrame className="absolute inset-0" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* I. Footer                                                            */
/* ------------------------------------------------------------------ */
export function Footer() {
  return (
    <footer className="bg-charcoal pb-28 pt-20 text-cream/70 md:pb-14">
      <div className="container-x">
        <p className="t-hero-accent text-cream">Cuidado que se sente.</p>
        <div className="mt-14 grid gap-10 border-t border-cream/10 pt-10 sm:grid-cols-3">
          <div>
            <Logo light />
            <p className="mt-3 max-w-xs text-sm">Cuidado profissional e acolhedor para cães, gatos e pets não convencionais.</p>
          </div>
          <nav aria-label="Rodapé">
            <p className="eyebrow text-cream/45">Páginas</p>
            <ul className="mt-3 text-sm">
              {NAV.map((l) => (
                <li key={l.to}><Link className="lift inline-flex min-h-[40px] items-center hover:text-cream" to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow text-cream/45">Fale com a gente</p>
            <ul className="mt-3 text-sm">
              <li><a className="lift inline-flex min-h-[40px] items-center hover:text-cream" href={BRAND.phoneHref}>{BRAND.phoneLabel}</a></li>
              <li><a className="lift inline-flex min-h-[40px] items-center hover:text-cream" href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
              <li><a className="lift inline-flex min-h-[40px] items-center gap-2 hover:text-cream" href={BRAND.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="h-4 w-4" aria-hidden="true" /> Instagram</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-12 text-xs text-cream/45">© {new Date().getFullYear()} {BRAND.name} Pet Healthcare. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* Extras: barra de progresso + WhatsApp flutuante                      */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const bar = useRef(null)
  const path = usePath()
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(bar.current, { scaleX: 0 }, {
        scaleX: 1, ease: 'none', transformOrigin: 'left center',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      })
    })
    return () => ctx.revert()
  }, [path])
  return <div ref={bar} className="fixed inset-x-0 top-0 z-progress h-[3px] origin-left bg-clay will-change-transform" aria-hidden="true" />
}

export function FloatingWhatsApp() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      className={`fixed bottom-5 right-5 z-float transition-[opacity,transform] duration-500 ease-spring ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <a
        href={BRAND.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar consulta pelo WhatsApp"
        tabIndex={show ? 0 : -1}
        className="btn bg-clay text-cream shadow-lift"
      >
        <span className="btn-bg bg-moss" aria-hidden="true" />
        <span className="btn-label"><MessageCircle className="h-5 w-5" aria-hidden="true" /> <span className="hidden sm:inline">Agendar consulta</span></span>
      </a>
    </div>
  )
}
