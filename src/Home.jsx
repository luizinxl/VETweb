import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  ArrowRight, ArrowUpRight, FlaskConical, HeartHandshake, MessageCircle,
  Phone, Siren, Dog, Cat, Bird, Stethoscope, CalendarCheck, Pill, PawPrint, Quote,
} from 'lucide-react'
import { BRAND, Button, Contact, Link, SectionHead, StatusPill, prefersReducedMotion } from './shared.jsx'

const SERVICES = [
  { title: 'Consulta de Rotina', text: 'Avaliação clínica completa, do focinho à cauda, com tempo para suas dúvidas.', img: '/assets/img/consulta.jpg', pos: 'center 30%' },
  { title: 'Vacinação', text: 'Protocolos vacinais seguros para cada fase da vida.', img: '/assets/img/home-vacina.jpg', pos: '45% center' },
  { title: 'Cirurgias', text: 'Bloco cirúrgico com anestesia inalatória monitorada.', img: '/assets/img/home-cirurgia.jpg', pos: '45% 40%' },
  { title: 'Exames de Imagem', text: 'Raio-X digital e ultrassonografia na própria clínica.', img: '/assets/img/imagem.jpg', pos: 'center 35%' },
  { title: 'Odontologia', text: 'Limpeza de tártaro e tratamentos dentários.', img: '/assets/img/home-odonto.jpg', pos: '50% 45%' },
  { title: 'Laboratório Próprio', text: 'Hemograma e bioquímicos com resultado rápido.', img: '/assets/img/laboratorio.jpg' },
  { title: 'Medicina Felina', text: 'Manejo gentil e ambiente pensado para gatos.', img: '/assets/img/felinos.jpg', pos: '45% center' },
  { title: 'Internação e UTI 24h', text: 'Baias climatizadas e monitoramento contínuo.', img: '/assets/img/home-uti.jpg', pos: '45% center' },
]

const SPECIALTIES = [
  'Raio-X Digital', 'Ultrassonografia', 'Hemograma Completo', 'Castração', 'Ortopedia', 'UTI 24h',
  'Odontologia', 'Oftalmologia', 'Dermatologia', 'Cardiologia', 'Comportamento Animal', 'Acupuntura',
]

const STEPS = [
  { icon: CalendarCheck, title: 'Agende', text: 'Escolha o melhor horário pelo WhatsApp ou telefone.' },
  { icon: Stethoscope, title: 'Consulte', text: 'Traga seu pet para uma avaliação clínica sem pressa.' },
  { icon: Pill, title: 'Trate', text: 'Iniciamos o cuidado especializado, com exames no mesmo lugar.' },
  { icon: PawPrint, title: 'Acompanhe', text: 'Seguimos juntos até seu amigo voltar a brincar.' },
]

// Depoimentos do site atual — confirme que são reais antes de publicar.
const REVIEWS = [
  { quote: 'Obrigado por salvarem meu cachorro! Atendimento impecável.', name: 'Sofia' },
  { quote: 'Eles tratam minha gatinha com tanto amor, melhores profissionais!', name: 'Pedro' },
  { quote: 'Clínica super limpa e a Dra. Ana é maravilhosa.', name: 'Clara' },
  { quote: 'Os serviços e vacinas são excelentes. Confio de olhos fechados.', name: 'João' },
]


/* ------------------------------------------------------------------ */
/* B. Hero                                                              */
/* ------------------------------------------------------------------ */
function Hero() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } })
          .from('.hero-media', { scale: 1.12, duration: 2, ease: 'power2.out' })
          .from('.hero-line', { yPercent: 110, duration: 1.1, stagger: 0.08 }, '-=1.6')
          .from('.hero-fade', { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, '-=0.7')
        gsap.to('.hero-media', {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="topo" ref={root} className="relative flex min-h-[100dvh] items-end overflow-hidden bg-moss text-cream" aria-label="Apresentação">
      <div className="hero-media absolute inset-0 will-change-transform" aria-hidden="true">
        <video className="h-full w-full object-cover" autoPlay loop muted playsInline preload="auto">
          <source src="/assets/hero_video.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-moss/70 to-moss/20" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 to-transparent" aria-hidden="true" />

      <div className="container-x relative pb-16 pt-32 md:pb-24">
        <StatusPill className="hero-fade mb-6" />

        <h1 className="max-w-4xl">
          <span className="block overflow-hidden">
            <span className="hero-line t-hero block">Cuidado veterinário é</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="hero-line t-hero-accent block text-clay">confiança.</span>
          </span>
        </h1>

        <p className="hero-fade mt-6 max-w-xl text-base text-cream/80 md:text-lg">
          Estrutura moderna, laboratório próprio e uma equipe que trata seu pet como família — de dia, de noite, todos os dias.
        </p>

        <div className="hero-fade mt-8 flex flex-wrap gap-3">
          <Button href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" /> Agendar consulta
          </Button>
          <Button href={BRAND.phoneHref} variant="ghost">
            <Siren className="h-4 w-4 text-clay" /> Emergência 24h
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* C. Features — micro-UIs                                              */
/* ------------------------------------------------------------------ */
function CardShell({ icon: Icon, eyebrow, title, text, children, className = '', wide = false, dark = false, visual = 'h-64' }) {
  return (
    <article
      className={`reveal-card group flex flex-col gap-5 rounded-card p-5 ring-1 transition-shadow duration-500 hover:shadow-lift md:p-6 ${
        dark ? 'bg-charcoal text-cream ring-cream/10' : 'bg-white/80 ring-moss/10 shadow-soft'
      } ${wide ? 'lg:flex-row lg:gap-8' : ''} ${className}`}
    >
      <div className={`flex flex-col px-1 pt-1 ${wide ? 'lg:w-[34%] lg:shrink-0 lg:py-2' : ''}`}>
        <div>
          <div className="flex items-center justify-between">
            <span className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${dark ? 'bg-cream/10' : 'bg-clay/10'} text-clay`}>
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="eyebrow">{eyebrow}</span>
            </span>
          </div>
          <h3 className={`t-card mt-4 ${dark ? 'text-cream' : 'text-moss'}`}>{title}</h3>
        </div>
        <p className={`mt-3 text-sm leading-relaxed ${dark ? 'text-cream/65' : 'text-charcoal/70'}`}>{text}</p>
      </div>
      <div className={`relative overflow-hidden rounded-tile ${visual} ${wide ? 'lg:flex-1' : ''}`}>{children}</div>
    </article>
  )
}

const reduceMotion = prefersReducedMotion

// Card 1 — Plantão ao vivo: ECG + Diagnostic Shuffler de triagem
const TRIAGE = [
  { pet: 'Cão', Icon: Dog, step: 'Triagem', sub: 'Classificação de risco na chegada', tone: 'bg-clay' },
  { pet: 'Gato', Icon: Cat, step: 'Estabilização', sub: 'Suporte vital e fluidoterapia', tone: 'bg-amber-400' },
  { pet: 'Ave', Icon: Bird, step: 'UTI', sub: 'Monitoramento contínuo 24h', tone: 'bg-sage' },
]
const ECG = 'M0 50 H40 L48 50 L54 38 L60 50 H78 L84 58 L92 8 L100 88 L108 50 H130 L140 42 L152 50 H200'
function EmergencyPanel() {
  const [items, setItems] = useState(TRIAGE)
  const [bpm, setBpm] = useState(104)
  const [time, setTime] = useState('')
  useEffect(() => {
    const clock = () => setTime(new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()))
    clock()
    const c = setInterval(clock, 1000)
    if (reduceMotion()) return () => clearInterval(c)
    const s = setInterval(() => setItems((arr) => { const a = [...arr]; a.unshift(a.pop()); return a }), 3000)
    const b = setInterval(() => setBpm(96 + Math.round(Math.random() * 18)), 1400)
    return () => { clearInterval(c); clearInterval(s); clearInterval(b) }
  }, [])
  return (
    <div className="absolute inset-0 bg-moss p-5 text-cream" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="pulse-dot h-2 w-2 rounded-full bg-clay text-clay" />
          <span className="eyebrow text-cream/80">Plantão · ao vivo</span>
        </span>
        <span className="font-mono text-xs tabular-nums text-cream/50">{time}</span>
      </div>

      <div className="mt-4 flex items-end gap-4">
        <div>
          <p className="eyebrow text-cream/40">FC monitorada</p>
          <p className="font-display text-5xl font-semibold tabular-nums leading-none">
            {bpm}<span className="ml-1 font-mono text-xs text-cream/50">bpm</span>
          </p>
        </div>
        <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="h-14 flex-1 overflow-hidden">
          <g className="ecg-scroll">
            {[0, 200, 400].map((x) => (
              <path key={x} d={ECG} transform={`translate(${x} 0)`} fill="none" stroke="rgb(var(--c-clay))" strokeWidth="2.5" strokeLinejoin="round" />
            ))}
          </g>
        </svg>
      </div>

      <div className="relative mt-5 h-28">
        {items.map((it, i) => (
          <div
            key={it.step}
            className="absolute inset-x-0 bottom-0 flex items-center gap-3 rounded-tile bg-cream p-3.5 text-charcoal shadow-lift"
            style={{
              transform: `translateY(${(i - 2) * 14}px) scale(${1 - (2 - i) * 0.05})`,
              opacity: i === 2 ? 1 : 0.35 + i * 0.2,
              zIndex: i,
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-tile bg-moss/10 text-moss"><it.Icon className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-display text-sm font-semibold text-moss">
                <span className={`h-2 w-2 rounded-full ${it.tone}`} /> {it.step} · {it.pet}
              </p>
              <p className="truncate text-xs text-charcoal/60">{it.sub}</p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-clay">Agora</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Card 2 — Laboratório: hemograma com faixas de referência + Telemetry Typewriter
const PARAMS = [
  { k: 'Hemácias', lo: 30, hi: 70 },
  { k: 'Leucócitos', lo: 25, hi: 65 },
  { k: 'Plaquetas', lo: 35, hi: 75 },
  { k: 'Glicose', lo: 30, hi: 60 },
]
const LAB_FEED = ['amostra recebida', 'hemograma em análise', 'raio-x digital processado', 'laudo liberado ✓']
function LabPanel() {
  const [vals, setVals] = useState(PARAMS.map(() => 0))
  const [line, setLine] = useState('')
  useEffect(() => {
    const roll = () => setVals(PARAMS.map((p) => p.lo + 6 + Math.random() * (p.hi - p.lo - 12)))
    const t0 = setTimeout(roll, 400)
    if (reduceMotion()) { setLine(LAB_FEED[3]); return () => clearTimeout(t0) }
    const r = setInterval(roll, 4200)
    let msg = 0, ch = 0, timer
    const tick = () => {
      const text = LAB_FEED[msg % LAB_FEED.length]
      if (ch <= text.length) { setLine(text.slice(0, ch++)); timer = setTimeout(tick, 45) }
      else { ch = 0; msg++; timer = setTimeout(tick, 1300) }
    }
    tick()
    return () => { clearTimeout(t0); clearInterval(r); clearTimeout(timer) }
  }, [])
  return (
    <div className="absolute inset-0 flex flex-col bg-cream p-5 ring-1 ring-inset ring-moss/10" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-clay text-clay" />
          <span className="eyebrow text-charcoal/55">Live Feed</span>
        </span>
        <span className="rounded-full bg-sage/25 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-moss">In-house</span>
      </div>
      <div className="mt-5 space-y-3.5">
        {PARAMS.map((p, i) => (
          <div key={p.k}>
            <div className="flex justify-between font-mono text-[11px] text-charcoal/60">
              <span>{p.k}</span><span className="text-moss">normal</span>
            </div>
            <div className="relative mt-1.5 h-2 rounded-full bg-moss/10">
              <div className="absolute inset-y-0 rounded-full bg-sage/40" style={{ left: `${p.lo}%`, width: `${p.hi - p.lo}%` }} />
              <div className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cream bg-clay shadow"
                style={{ left: `${vals[i]}%`, transition: `left 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-auto rounded-tile bg-moss px-3 py-2 font-mono text-[12px] text-cream/90">
        <span className="text-clay">›</span> {line}<span className="caret ml-0.5 bg-clay" />
      </p>
    </div>
  )
}

// Card 3 — Cursor Scheduler: dia → horário → confirmar → toast
function Scheduler() {
  const root = useRef(null)
  const days = [['D', 5], ['S', 6], ['T', 7], ['Q', 8], ['Q', 9], ['S', 10], ['S', 11]]
  const slots = ['09:00', '11:30', '15:00']
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const box = root.current
        const pos = (sel) => () => {
          const el = box.querySelector(sel), b = box.getBoundingClientRect(), r = el.getBoundingClientRect()
          return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 }
        }
        const day = pos('[data-day="4"]'), slot = pos('[data-slot="2"]'), save = pos('[data-save]')
        const press = (sel) => gsap.timeline().to(sel, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 })
        gsap.timeline({ repeat: -1, repeatDelay: 1, defaults: { ease: 'power2.inOut' } })
          .set('.cur', { x: () => box.clientWidth + 20, y: () => box.clientHeight + 20, opacity: 1 })
          .set('[data-day="4"]', { className: 'day' })
          .set('[data-slot="2"]', { className: 'slot' })
          .set('.toast', { yPercent: 120, opacity: 0 })
          .to('.cur', { x: () => day().x, y: () => day().y, duration: 1.1 })
          .add(press('.cur'))
          .set('[data-day="4"]', { className: 'day day-on' })
          .to('.cur', { x: () => slot().x, y: () => slot().y, duration: 0.8 }, '+=0.25')
          .add(press('.cur'))
          .set('[data-slot="2"]', { className: 'slot slot-on' })
          .to('.cur', { x: () => save().x, y: () => save().y, duration: 0.8 }, '+=0.25')
          .add(press('[data-save]'))
          .to('.cur', { opacity: 0, duration: 0.3 })
          .to('.toast', { yPercent: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.6)' }, '<')
          .to({}, { duration: 1.6 })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <div ref={root} className="absolute inset-0 bg-cream p-5 ring-1 ring-inset ring-moss/10" aria-hidden="true">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-clay/15 text-clay"><Cat className="h-4 w-4" /></span>
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold text-moss">Seu pet</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/45">Consulta sem pressa</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {days.map(([d, n], i) => (
          <div key={i} data-day={i} className="day"><span className="text-[9px] opacity-60">{d}</span>{n}</div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {slots.map((s, i) => <div key={s} data-slot={i} className="slot">{s}</div>)}
      </div>
      <div data-save className="mt-3 inline-flex rounded-full bg-moss px-4 py-2 text-xs font-semibold text-cream">Confirmar</div>
      <div className="toast absolute inset-x-4 bottom-4 flex items-center gap-2.5 rounded-tile bg-moss px-4 py-3 text-cream opacity-0 shadow-lift">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-clay"><PawPrint className="h-3.5 w-3.5" /></span>
        <span className="text-xs font-semibold">Consulta confirmada · Qui, 15:00</span>
      </div>
      <svg className="cur pointer-events-none absolute left-0 top-0 z-10 h-5 w-5 opacity-0" viewBox="0 0 24 24" style={{ marginLeft: -3, marginTop: -2 }}>
        <path d="M3 2l7.5 19 2.5-8 8-2.5z" fill="rgb(var(--c-charcoal))" stroke="rgb(var(--c-cream))" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <style>{`.day,.slot{display:grid;place-items:center;border-radius:.75rem;font-family:'IBM Plex Mono',monospace;font-size:12px;background:#fff;color:rgb(var(--c-charcoal)/.65);box-shadow:inset 0 0 0 1px rgb(var(--c-moss)/.1);transition:background .3s,color .3s}.day{padding:.35rem 0;line-height:1.15}.slot{padding:.45rem 0}.day-on,.slot-on{background:rgb(var(--c-clay));color:rgb(var(--c-cream));box-shadow:none}`}</style>
    </div>
  )
}

// Card 4 — Guia de triagem: 3 níveis (emergência, hoje, rotina)
const LEVELS = {
  3: {
    tag: 'Emergência', title: 'Venha agora ou ligue no caminho.',
    text: 'Esses sinais precisam de atendimento imediato. Nosso plantão 24h já pode se preparar para receber seu pet.',
    box: 'bg-clay text-cream', dot: 'bg-clay', cta: 'call',
  },
  2: {
    tag: 'Atendimento hoje', title: 'Procure a clínica ainda hoje.',
    text: 'Não é para correr, mas também não é para esperar. Fale com a gente e marcamos o quanto antes.',
    box: 'bg-amber-100 text-charcoal', dot: 'bg-amber-500', cta: 'whats',
  },
  1: {
    tag: 'Consulta de rotina', title: 'Pode agendar com tranquilidade.',
    text: 'Vale uma avaliação, sem urgência. Escolha o melhor horário para você.',
    box: 'bg-sage/25 text-moss', dot: 'bg-sage', cta: 'whats',
  },
}
const SIGNS = [
  { k: 'Dificuldade para respirar', lvl: 3 },
  { k: 'Vômito ou diarreia há mais de 1 dia', lvl: 2 },
  { k: 'Vacina atrasada', lvl: 1 },
  { k: 'Convulsão', lvl: 3 },
  { k: 'Não come há mais de 24h', lvl: 2 },
  { k: 'Mau hálito ou tártaro', lvl: 1 },
  { k: 'Ingeriu algo tóxico', lvl: 3 },
  { k: 'Mancando', lvl: 2 },
  { k: 'Coceira ou queda de pelo', lvl: 1 },
  { k: 'Atropelamento ou queda', lvl: 3 },
  { k: 'Olho vermelho ou lacrimejando', lvl: 2 },
  { k: 'Check-up anual', lvl: 1 },
]
function EmergencyCheck() {
  const [picked, setPicked] = useState(null)
  const toggle = (k) => setPicked((p) => (p === k ? null : k))
  const level = SIGNS.find((s) => s.k === picked)?.lvl ?? 0
  const r = LEVELS[level]
  return (
    <div className="flex h-full flex-col gap-4 rounded-tile bg-cream p-4 ring-1 ring-inset ring-moss/10 md:p-5 lg:flex-row">
      <div className="lg:flex-[1.3]">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-charcoal/55">Qual o sinal principal?</p>
          {picked && (
            <button type="button" onClick={() => setPicked(null)} className="lift -my-2 min-h-[44px] px-2 font-mono text-[11px] uppercase tracking-widest text-clay">Limpar</button>
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Sinal principal observado">
          {SIGNS.map(({ k }) => {
            const on = picked === k
            return (
              <button key={k} type="button" role="radio" aria-checked={on} onClick={() => toggle(k)}
                className={`lift min-h-[44px] rounded-tile px-3.5 py-2 text-left text-xs font-semibold leading-snug ring-1 transition-colors duration-300 ${
                  on ? 'bg-moss text-cream ring-moss' : 'bg-white text-moss ring-moss/15 hover:ring-moss/40'
                }`}>
                {on ? '✓ ' : ''}{k}
              </button>
            )
          })}
        </div>
      </div>

      <div aria-live="polite" className={`flex min-h-[13rem] flex-col rounded-tile p-5 transition-colors duration-500 lg:flex-1 ${r ? r.box : 'bg-moss/[0.05] text-moss'}`}>
        {/* Medidor de 3 níveis */}
        <div className="flex gap-1.5" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${level < n ? 'bg-current opacity-15' : level === 3 ? 'bg-cream' : r.dot}`} />
          ))}
        </div>
        {r ? (
          <>
            <p className="eyebrow mt-4 opacity-80">{r.tag}</p>
            <p className="t-item mt-1">{r.title}</p>
            <p className="mt-2 text-sm opacity-80">{r.text}</p>
            <div className="mt-auto pt-4">
              {r.cta === 'call' ? (
                <Button href={BRAND.phoneHref} variant="cream" className="w-full sm:w-auto"><Phone className="h-4 w-4" /> Ligar {BRAND.phoneLabel}</Button>
              ) : (
                <Button href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" variant="moss" className="w-full sm:w-auto"><MessageCircle className="h-4 w-4" /> Falar no WhatsApp</Button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="t-item mt-4">Escolha o sinal principal.</p>
            <p className="mt-2 text-sm opacity-70">A gente mostra se é emergência, se precisa de atendimento hoje ou se dá para agendar.</p>
          </>
        )}
        <p className="mt-4 text-[11px] opacity-60">Orientação inicial. Não substitui a avaliação de um veterinário.</p>
      </div>
    </div>
  )
}

function Features() {
  const root = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.reveal-card', {
          y: 48, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.15, overwrite: 'auto',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section id="diferenciais" ref={root} className="section container-x">
      <SectionHead eyebrow={`Por que a ${BRAND.name}`} title="Três promessas que a gente" accent="cumpre todo dia."
        aside={<p className="max-w-xs text-sm text-charcoal/65">Estrutura, diagnóstico e acolhimento — tudo sob o mesmo teto, a qualquer hora.</p>} />
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
        <CardShell wide dark className="md:col-span-2 lg:col-span-6" visual="h-[21rem]" icon={Siren} eyebrow="Emergência 24h"
          title="Nunca fechamos para urgências."
          text="Plantão todos os dias do ano, com UTI, internação e suporte vital para quando cada minuto importa. Seu pet é recebido, classificado e estabilizado sem espera.">
          <EmergencyPanel />
        </CardShell>
        <CardShell className="lg:col-span-3" visual="h-72" icon={FlaskConical} eyebrow="Laboratório próprio"
          title="Exames aqui, respostas rápidas."
          text="Hemograma, raio-X digital e ultrassom feitos dentro da clínica — diagnóstico sem idas e vindas.">
          <LabPanel />
        </CardShell>
        <CardShell className="lg:col-span-3" visual="h-72" icon={HeartHandshake} eyebrow="Atendimento humanizado"
          title="Tempo para ouvir você e seu pet."
          text="Consultas sem pressa, com explicações claras e uma equipe que trata cada animal como família.">
          <Scheduler />
        </CardShell>
        <CardShell wide className="md:col-span-2 lg:col-span-6" visual="" icon={Stethoscope} eyebrow="Na dúvida, pergunte"
          title="É urgente ou pode esperar?"
          text="Marque o que você está notando e veja como agir. Na dúvida, ligue: nossa equipe orienta você por telefone antes de sair de casa.">
          <EmergencyCheck />
        </CardShell>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Serviços                                                             */
/* ------------------------------------------------------------------ */
/*
 * Tablet: 2 colunas (cards 0 e 3 largos). Desktop: bento 4 colunas × 3 linhas, sem buracos:
 *   [ 0 0 1 2 ]
 *   [ 0 0 3 3 ]   ← card 3 é largo
 *   [ 4 5 6 7 ]
 */
function Services() {
  return (
    <section id="servicos" className="section bg-moss text-cream">
      <div className="container-x">
        <SectionHead dark eyebrow="Serviços" title="Do check-up à" accent="cirurgia, no mesmo endereço."
          aside={<Button to="/servicos" variant="cream">Ver todos os serviços <ArrowUpRight className="h-4 w-4" /></Button>} />

        {/* Mobile: carrossel com snap · Desktop: bento */}
        <div className="-mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:auto-rows-[16rem] md:gap-5 lg:grid-cols-4 md:overflow-visible md:px-0 md:pb-0">
          {SERVICES.map((s, i) => {
            const big = i === 0
            return (
              <Link key={s.title} to="/servicos"
                className={`reveal-item group relative block aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden rounded-card ring-1 ring-cream/10 sm:w-[46%] md:aspect-auto md:w-auto ${
                  big ? 'md:col-span-2 lg:row-span-2' : i === 3 ? 'md:col-span-2' : ''
                }`}>
                <img src={s.img} alt={s.title} loading="lazy" decoding="async" width="800" height="1000" style={{ objectPosition: s.pos }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                  <div className="min-w-0">
                    <h3 className={big ? 't-card md:text-4xl' : 't-item'}>{s.title}</h3>
                    <p className={`mt-2 text-sm text-cream/75 ${big ? 'md:max-w-sm md:text-base' : 'md:hidden'}`}>{s.text}</p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream/15 backdrop-blur transition-[transform,background-color] duration-300 ease-spring group-hover:rotate-45 group-hover:bg-clay">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
        <p className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cream/45 md:hidden" aria-hidden="true">
          Deslize <ArrowRight className="h-3 w-3" />
        </p>
      </div>

      <div className="mt-20 overflow-hidden border-y border-cream/10 py-6" aria-label="Especialidades">
        <div className="marquee flex w-max gap-10">
          {[...SPECIALTIES, ...SPECIALTIES].map((s, i) => (
            <span key={i} data-dup={i >= SPECIALTIES.length ? '' : undefined} aria-hidden={i >= SPECIALTIES.length || undefined}
              className="flex items-center gap-10 font-serif text-3xl italic text-cream/80 md:text-4xl">
              {s} <PawPrint className="h-5 w-5 text-clay" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* D. Prova social                                                      */
/* ------------------------------------------------------------------ */
function Reviews() {
  return (
    <section className="section container-x" aria-labelledby="depoimentos">
      <SectionHead id="depoimentos" eyebrow="Tutores" title="O que dizem" accent="por aí." />
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {REVIEWS.map((r, i) => {
          const dark = i === 0 || i === 3
          return (
            <figure key={r.name} className={`reveal-item flex flex-col rounded-card p-8 ring-1 ring-moss/10 md:p-10 ${dark ? 'bg-moss text-cream' : 'bg-white/70'}`}>
              <Quote className="h-7 w-7 text-clay" aria-hidden="true" />
              <blockquote className={`mt-5 flex-1 font-serif text-2xl italic leading-snug md:text-3xl ${dark ? '' : 'text-moss'}`}>“{r.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-clay font-display font-semibold text-cream">{r.name[0]}</span>
                <span className={`text-sm font-semibold ${dark ? 'text-cream/80' : 'text-charcoal/70'}`}>{r.name} · Tutor(a)</span>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Para toda a família — espécies + dicas, em loop automático          */
/* ------------------------------------------------------------------ */
const SPECIES = [
  {
    key: 'caes', label: 'Cães', Icon: Dog, img: '/assets/img/family-dog.jpg', pos: '35% 40%',
    lead: 'De filhotes agitados a seniores tranquilos, de todos os portes e raças.',
    tips: ['Vacinas e reforços anuais em dia', 'Antipulgas e vermífugo no calendário', 'Escovar os dentes ajuda a evitar tártaro'],
  },
  {
    key: 'gatos', label: 'Gatos', Icon: Cat, img: '/assets/img/family-cat.jpg', pos: '40% 50%',
    lead: 'Manejo gentil e sem pressa, porque gato estressado esconde sintomas.',
    tips: ['Check-up anual, mesmo para gatos de apartamento', 'Estimule a água: fonte ou várias tigelas', 'Mudança no xixi ou na caixa de areia é sinal de alerta'],
  },
  {
    key: 'exoticos', label: 'Aves e pequenos', Icon: Bird, img: '/assets/img/aves.jpg', pos: '40% 40%',
    lead: 'Atendemos também coelhos, hamsters, porquinhos-da-índia e aves de estimação.',
    tips: ['Cada espécie tem uma dieta própria, além de ração ou sementes', 'Temperatura e ambiente fazem parte da saúde', 'Eles disfarçam doenças: consultas preventivas fazem diferença'],
  },
]
const FAMILY_INTERVAL = 6000

function Family() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const [cycle, setCycle] = useState(0) // reinicia a barra de progresso
  const root = useRef(null)
  const sp = SPECIES[active]
  const auto = !prefersReducedMotion()
  const running = auto && inView && !paused

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!running) return
    const id = setTimeout(() => {
      setActive((a) => (a + 1) % SPECIES.length)
      setCycle((c) => c + 1)
    }, FAMILY_INTERVAL)
    return () => clearTimeout(id)
  }, [running, active, cycle])

  const select = (i) => { setActive(i); setCycle((c) => c + 1) }

  return (
    <section ref={root} className="section container-x" aria-labelledby="familia"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}>
      <SectionHead id="familia" eyebrow="Para toda a família" title="Latidos, miados e" accent="piados."
        aside={
          <div role="tablist" aria-label="Espécies" className="flex gap-1 rounded-full bg-white/70 p-1 ring-1 ring-moss/10">
            {SPECIES.map((s, i) => {
              const on = active === i
              return (
                <button key={s.key} role="tab" type="button" aria-selected={on} aria-controls="painel-familia" onClick={() => select(i)}
                  className={`relative flex min-h-[44px] items-center gap-2 overflow-hidden rounded-full px-4 text-sm font-semibold transition-colors duration-300 ${on ? 'bg-moss text-cream' : 'text-moss hover:bg-moss/5'}`}>
                  <s.Icon className="h-4 w-4" aria-hidden="true" /> <span className={on ? '' : 'sr-only sm:not-sr-only'}>{s.label}</span>
                  {on && auto && (
                    <span key={`${cycle}-${running}`} aria-hidden="true" style={{ '--dur': `${FAMILY_INTERVAL}ms` }}
                      className={`tab-progress absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-clay ${running ? '' : 'paused'}`} />
                  )}
                </button>
              )
            })}
          </div>
        } />

      <div id="painel-familia" role="tabpanel" aria-live="polite" className="mt-14 grid overflow-hidden rounded-panel bg-white/70 ring-1 ring-moss/10 md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-[5/6]">
          {SPECIES.map((s, i) => (
            <img key={s.key} src={s.img} alt={active === i ? s.label : ''} loading="lazy" decoding="async" width="900" height="1080" style={{ objectPosition: s.pos }}
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-spring ${active === i ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'}`} />
          ))}
        </div>
        <div key={sp.key} className="fade-swap flex flex-col justify-center p-8 md:p-12">
          <sp.Icon className="h-8 w-8 text-clay" aria-hidden="true" />
          <p className="t-card mt-5 text-moss md:text-3xl">{sp.lead}</p>
          <p className="eyebrow mt-8 text-charcoal/55">Dicas de cuidado</p>
          <ul className="mt-4 space-y-3">
            {sp.tips.map((t) => (
              <li key={t} className="flex gap-3 text-sm text-charcoal/80">
                <PawPrint className="mt-0.5 h-4 w-4 shrink-0 text-clay" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
          <Button to="/servicos" variant="moss" className="mt-8 self-start">Ver serviços <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* F. Como funciona                                                     */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const root = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.steps-line', { scaleX: 0 }, {
          scaleX: 1, ease: 'none', transformOrigin: 'left center',
          scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section id="como-funciona" ref={root} className="section bg-white/60">
      <div className="container-x">
        <SectionHead eyebrow="Como funciona" title="Simples para você." accent="Completo para ele." />
        <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-moss/15 lg:block" aria-hidden="true">
            <div className="steps-line h-full origin-left bg-clay" />
          </div>
          {STEPS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="reveal-item relative">
              <div className="relative grid h-12 w-12 place-items-center rounded-full bg-moss text-cream ring-8 ring-cream">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="t-card mt-5 text-moss">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* E. Manifesto                                                         */
/* ------------------------------------------------------------------ */
function Manifesto() {
  const root = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.manifesto-img', { yPercent: -6 }, {
          yPercent: 6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        gsap.from('.word', {
          opacity: 0.12, stagger: 0.08, ease: 'none',
          scrollTrigger: { trigger: '.manifesto-text', start: 'top 80%', end: 'bottom 55%', scrub: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  const phrase = 'Aliamos compaixão e medicina veterinária avançada, porque o seu pet não é só um paciente.'
  return (
    <section ref={root} className="section container-x grid items-center gap-12 md:grid-cols-2 md:gap-16">
      <div className="relative aspect-[4/5] overflow-hidden rounded-panel">
        <img src="/assets/img/manifesto.jpg" alt="Tutor abraçando seu pet" loading="lazy" decoding="async" width="900" height="1125"
          style={{ objectPosition: '50% 40%' }} className="manifesto-img absolute inset-0 h-[112%] w-full -translate-y-[6%] object-cover will-change-transform" />
      </div>
      <div className="max-w-lg">
        <span className="eyebrow inline-flex items-center gap-2 text-clay"><PawPrint className="h-3.5 w-3.5" aria-hidden="true" /> Nossa filosofia</span>
        <p className="manifesto-text mt-4 font-display text-3xl font-medium leading-snug tracking-[-0.02em] text-moss md:text-4xl">
          {phrase.split(' ').map((w, i) => (
            <span key={i} className="word">{w} </span>
          ))}
          <span className="t-page-accent mt-4 block text-clay">Ele é família.</span>
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Ordem: serviços → avaliações (pedido do cliente) → família →         */
/* diferenciais → como funciona → filosofia → contato                   */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Reviews />
      <Family />
      <Features />
      <HowItWorks />
      <Manifesto />
      <Contact />
    </>
  )
}
