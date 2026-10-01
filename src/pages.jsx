import { useState } from 'react'
import {
  ArrowRight, Bone, Brain, Clock, Eye, FlaskConical, HeartPulse, Hospital, MapPin, MessageCircle,
  PawPrint, Phone, Plus, Scan, Scissors, ShieldCheck, Siren, Smile, Sparkles, Stethoscope, Syringe, Baby, Droplets, Bug, Cpu, FileCheck,
} from 'lucide-react'
import { BRAND, Button, CtaBand, HOURS_ROWS, MapFrame, PageHero, SectionHead, StatusPill } from './shared.jsx'

function Tags({ items, dark }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${dark ? 'bg-cream/10 text-cream/80' : 'bg-moss/[0.06] text-moss'}`}>{t}</span>
      ))}
    </div>
  )
}

/* ================================================================== */
/* SERVIÇOS                                                            */
/* ================================================================== */
const SERVICE_GROUPS = [
  {
    id: 'clinica', label: 'Clínica geral', img: '/assets/img/grupo-clinica.jpg', pos: '55% 40%',
    intro: 'A base de uma vida saudável começa com acompanhamento contínuo e preventivo.',
    items: [
      { Icon: Stethoscope, t: 'Consulta de Rotina', d: 'Exame físico detalhado, orientações nutricionais e plano de saúde para cada fase da vida.', tags: ['Cães', 'Gatos', 'Coelhos'] },
      { Icon: Syringe, t: 'Vacinação e Imunização', d: 'Vacinas nacionais e importadas contra raiva, cinomose, parvovirose, FeLV e muito mais.', tags: ['V10', 'Antirrábica', 'FeLV'] },
      { Icon: Bug, t: 'Controle de Parasitas', d: 'Vermifugação e prevenção de pulgas, carrapatos e sarnas, com calendário personalizado.', tags: ['Antipulgas', 'Vermífugos'] },
      { Icon: Cpu, t: 'Microchipagem', d: 'Identificação permanente, rápida e indolor. Essencial para viagens internacionais.', tags: ['ISO 11784', 'SINID'] },
      { Icon: FileCheck, t: 'Atestado de Saúde', d: 'Atestado zoossanitário para transporte aéreo, terrestre ou internacional.', tags: ['Viagem', 'MAPA'] },
    ],
  },
  {
    id: 'diagnostico', label: 'Diagnóstico', img: '/assets/img/grupo-diagnostico.jpg', pos: '60% 50%',
    intro: 'Equipamentos modernos para que cada diagnóstico seja rápido, preciso e seguro.',
    items: [
      { Icon: Scan, t: 'Raio-X Digital', d: 'Alta resolução com menos radiação e resultado imediato, com opção de telerradiologia.', tags: ['Digital', 'Alta resolução'] },
      { Icon: HeartPulse, t: 'Ultrassonografia', d: 'Doppler para avaliação abdominal, cardíaca e obstétrica em tempo real.', tags: ['Doppler', 'Ecocardiograma'] },
      { Icon: FlaskConical, t: 'Laboratório Próprio', d: 'Sangue, urina, fezes e citologias analisados na clínica, com resultado no mesmo dia.', tags: ['In-house'] },
    ],
  },
  {
    id: 'cirurgia', label: 'Cirurgia e internação', img: '/assets/img/cirurgia.jpg', pos: 'center 35%',
    intro: 'Bloco cirúrgico equipado e equipe treinada para os procedimentos mais delicados.',
    items: [
      { Icon: Scissors, t: 'Castração', d: 'Anestesia inalatória monitorada, controle de temperatura e analgesia multimodal.', tags: ['OSH', 'Orquiectomia'] },
      { Icon: Plus, t: 'Cirurgias de Tecido Mole', d: 'Remoção de tumores, hérnias e cirurgias abdominais e torácicas com monitoramento.', tags: ['Monitoramento'] },
      { Icon: Hospital, t: 'UTI e Internação 24h', d: 'Baias climatizadas, separadas por espécie e porte, com monitoramento contínuo.', tags: ['24h', 'SpO2'] },
      { Icon: Droplets, t: 'Fluidoterapia e Transfusão', d: 'Bombas de infusão de precisão e banco de sangue veterinário para emergências.', tags: ['Emergência'] },
      { Icon: Baby, t: 'Obstetrícia e Neonatologia', d: 'Acompanhamento da gestação, parto assistido e cuidados intensivos para neonatos.', tags: ['Gestação', 'Neonatos'] },
    ],
  },
]

export function ServicosPage() {
  const [tab, setTab] = useState(0)
  const g = SERVICE_GROUPS[tab]
  return (
    <>
      <PageHero eyebrow="Serviços" title="Cuidado completo," accent="do focinho à cauda."
        text="Da vacina à UTI, tudo no mesmo endereço — com equipamentos modernos e uma equipe apaixonada pelo que faz." img="/assets/img/servicos-hero.jpg" imgPosition="50% 45%">
        <Button href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> Agendar consulta</Button>
      </PageHero>

      <section className="section container-x">
        <SectionHead eyebrow="O que fazemos" title="Escolha uma" accent="área de cuidado." />

        {/* Abas fixas logo abaixo da navbar (altura em --nav-h) */}
        <div className="sticky top-nav z-30 -mx-5 mt-14 overflow-x-auto px-5 py-3 [scrollbar-width:none] md:mx-0 md:px-0">
          <div role="tablist" aria-label="Categorias de serviço" className="glass inline-flex gap-1 rounded-full p-1 shadow-soft ring-1 ring-moss/10">
            {SERVICE_GROUPS.map((x, i) => (
              <button key={x.id} id={`tab-${x.id}`} role="tab" type="button" aria-selected={tab === i} aria-controls="painel-servicos" onClick={() => setTab(i)}
                className={`min-h-[44px] whitespace-nowrap rounded-full px-5 text-sm font-semibold transition-colors duration-300 ${tab === i ? 'bg-moss text-cream' : 'text-moss hover:bg-moss/5'}`}>
                {x.label}
              </button>
            ))}
          </div>
        </div>

        <div id="painel-servicos" key={g.id} role="tabpanel" aria-labelledby={`tab-${g.id}`} className="fade-swap mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-panel lg:sticky lg:top-[calc(var(--nav-h)+5rem)] lg:aspect-[4/5]">
            <img src={g.img} alt="" width="900" height="1125" decoding="async" style={{ objectPosition: g.pos }} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-cream md:p-10">
              <h2 className="t-card md:text-4xl">{g.label}</h2>
              <p className="mt-3 max-w-sm text-cream/80">{g.intro}</p>
            </div>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {g.items.map(({ Icon, t, d, tags }, i) => (
              <li key={t} className={`group flex flex-col ${g.items.length % 2 && i === g.items.length - 1 ? 'sm:col-span-2 lg:col-span-1 xl:col-span-2' : ''} rounded-card bg-white/80 p-6 ring-1 ring-moss/10 transition-[transform,box-shadow] duration-500 ease-spring hover:-translate-y-1 hover:shadow-lift md:p-8`}>
                <span className="grid h-12 w-12 place-items-center rounded-tile bg-clay/10 text-clay transition-colors duration-300 group-hover:bg-clay group-hover:text-cream">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="t-item mt-5 text-moss">{t}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/70">{d}</p>
                <Tags items={tags} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-moss text-cream">
        <div className="container-x">
          <SectionHead dark eyebrow="Especialistas" title="Precisa de um olhar" accent="especializado?"
            text="Oftalmologia, odontologia, dermatologia, cardiologia e mais — com profissionais dedicados a cada área."
            aside={<Button to="/especialidades" variant="cream">Conhecer especialidades <ArrowRight className="h-4 w-4" /></Button>} />
        </div>
      </section>

      <CtaBand spaced />
    </>
  )
}

/* ================================================================== */
/* ESPECIALIDADES                                                      */
/* ================================================================== */
const SPECIALTIES = [
  { id: 'odontologia', Icon: Smile, t: 'Odontologia', img: '/assets/img/esp-odonto.jpg', pos: 'center 55%', d: 'Limpeza de tártaro, extrações, tratamento de reabsorção dentária felina e polimento com ultrassom.', tags: ['Profilaxia', 'Extração', 'TORL'] },
  { id: 'oftalmologia', Icon: Eye, t: 'Oftalmologia', img: '/assets/img/oftalmo.jpg', d: 'Catarata, glaucoma, olho seco, úlceras de córnea e alterações de pálpebra, com lâmpada de fenda.', tags: ['Catarata', 'Glaucoma'] },
  { id: 'dermatologia', Icon: Sparkles, t: 'Dermatologia', img: '/assets/img/esp-derma.jpg', pos: '55% 45%', d: 'Alergias, dermatite atópica, seborreia e otites crônicas, com testes e imunoterapia.', tags: ['Alergias', 'Otites'] },
  { id: 'cardiologia', Icon: HeartPulse, t: 'Cardiologia', img: '/assets/img/esp-cardio.jpg', pos: 'center 82%', d: 'Ecocardiograma com Doppler, eletrocardiograma e radiografia torácica para cardiopatias.', tags: ['Ecocardiograma', 'ECG'] },
  { id: 'ortopedia', Icon: Bone, t: 'Ortopedia', img: '/assets/img/esp-ortopedia.jpg', pos: 'center 72%', d: 'Fraturas, luxação de patela, ligamento cruzado e displasia de quadril em todos os portes.', tags: ['Patela', 'Cruzado'] },
  { id: 'comportamento', Icon: Brain, t: 'Comportamento Animal', img: '/assets/img/esp-comportamento.jpg', pos: '45% 50%', d: 'Ansiedade de separação, agressividade, medos e fobias, com plano de enriquecimento ambiental.', tags: ['Ansiedade', 'Fobias'] },
  { id: 'acupuntura', Icon: ShieldCheck, t: 'Acupuntura e Reabilitação', img: '/assets/img/esp-acupuntura.jpg', pos: '40% 50%', d: 'Terapia integrativa para dor crônica, recuperação pós-cirúrgica, artrite e distúrbios neurológicos.', tags: ['Dor crônica', 'Integrativa'] },
]

export function EspecialidadesPage() {
  return (
    <>
      <PageHero eyebrow="Especialidades" title="Um especialista para" accent="cada necessidade."
        text="Além da clínica geral, contamos com profissionais dedicados a áreas específicas da medicina veterinária." img="/assets/img/esp-hero.jpg" imgPosition="60% 40%" />

      <section className="section container-x">
        <SectionHead eyebrow="Áreas de atuação" title="Sete especialidades," accent="um só cuidado." />

        {/* Índice rápido — atalhos para cada especialidade */}
        <nav aria-label="Especialidades" className="sticky top-nav z-30 -mx-5 mt-14 overflow-x-auto px-5 py-3 [scrollbar-width:none] md:mx-0 md:px-0">
          <ul className="glass inline-flex gap-1 rounded-full p-1 shadow-soft ring-1 ring-moss/10">
            {SPECIALTIES.map(({ id, t, Icon }) => (
              <li key={id}>
                <a href={`#${id}`} className="flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold text-moss transition-colors duration-300 hover:bg-moss/5">
                  <Icon className="h-4 w-4 text-clay" aria-hidden="true" /> {t.split(' ')[0]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 space-y-6 md:space-y-8">
          {SPECIALTIES.map(({ id, Icon, t, img, pos, d, tags }, i) => {
            const dark = i % 3 === 1
            return (
              <article id={id} key={id}
                className={`reveal-item group grid scroll-mt-[calc(var(--nav-h)+5rem)] overflow-hidden rounded-panel ring-1 md:grid-cols-2 ${
                  dark ? 'bg-moss text-cream ring-cream/10' : 'bg-white/80 ring-moss/10'
                }`}>
                <div className={`relative aspect-[4/3] overflow-hidden ${i % 2 ? 'md:order-2' : ''}`}>
                  <img src={img} alt={t} loading="lazy" decoding="async" width="900" height="675" style={{ objectPosition: pos }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <span className={`grid h-12 w-12 place-items-center rounded-tile ${dark ? 'bg-clay text-cream' : 'bg-clay/10 text-clay'}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <h2 className={`t-card mt-5 md:text-3xl ${dark ? 'text-cream' : 'text-moss'}`}>{t}</h2>
                  <p className={`mt-3 leading-relaxed ${dark ? 'text-cream/75' : 'text-charcoal/70'}`}>{d}</p>
                  <Tags items={tags} dark={dark} />
                  <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer"
                    className="lift mt-6 inline-flex min-h-[44px] items-center gap-2 self-start text-sm font-semibold text-clay">
                    Agendar avaliação <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </section>
      <CtaBand title="Não sabe qual especialidade procurar?" text="Comece por uma consulta de rotina. Nossa equipe avalia e encaminha para o especialista certo." />
    </>
  )
}

/* ================================================================== */
/* SOBRE NÓS                                                           */
/* ================================================================== */
const TIMELINE = [
  { y: '2012', t: 'Fundação', d: 'A clínica abre as portas com 2 veterinários, 1 consultório e uma recepção aconchegante.' },
  { y: '2015', t: 'Laboratório próprio', d: 'Exames feitos na clínica: o tempo de espera por resultados cai drasticamente.' },
  { y: '2018', t: 'Bloco cirúrgico', d: 'Novo bloco com anestesia inalatória e monitoramento multiparamétrico.' },
  { y: '2021', t: 'UTI 24h', d: 'UTI veterinária com equipe plantonista e internação ampliada para 20 baias.' },
  { y: '2024', t: '5.000 pacientes', d: 'Mais de 5.000 pets atendidos e referência em medicina veterinária na região.' },
]
const TEAM = [
  { n: 'Dra. Camila Ferreira', r: 'Clínica Geral e Cardiologia', c: 'CRMV-SP 12.456', Icon: HeartPulse },
  { n: 'Dr. Rodrigo Alves', r: 'Cirurgia e Ortopedia', c: 'CRMV-SP 18.203', Icon: Bone },
  { n: 'Dra. Beatriz Nunes', r: 'Dermatologia e Comportamento', c: 'CRMV-SP 23.891', Icon: Sparkles },
  { n: 'Dr. Felipe Monteiro', r: 'Plantonista de Emergência', c: 'CRMV-SP 31.067', Icon: Siren },
]
const VALUES = [
  { t: 'Missão', d: 'Promover saúde, qualidade de vida e bem-estar animal com medicina baseada em evidências, tecnologia e empatia.' },
  { t: 'Visão', d: 'Ser referência em medicina veterinária integrada, onde tutores confiam plenamente e pets recebem o melhor cuidado.' },
  { t: 'Valores', d: 'Empatia, transparência, excelência técnica e compromisso com o bem-estar animal em cada decisão clínica.' },
]
const STATS = [['12+', 'anos de história'], ['5.000+', 'pets atendidos'], ['4.9★', 'avaliação no Google'], ['24h', 'plantão todos os dias']]

export function SobrePage() {
  return (
    <>
      <PageHero eyebrow="Sobre nós" title="Nascemos do" accent="amor aos animais."
        text="Desde 2012, a Cimu oferece medicina veterinária de alto nível com um atendimento que cuida tanto do pet quanto do tutor." img="/assets/img/sobre-hero.jpg" imgPosition="50% 30%" />

      <section className="section container-x">
        <SectionHead eyebrow="Em números" title="Uma história feita de" accent="cuidado diário." />
        <dl className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {STATS.map(([n, l]) => (
            <div key={l} className="reveal-item flex flex-col rounded-card bg-white/80 p-6 ring-1 ring-moss/10 md:p-8">
              <dt className="order-2 mt-3 text-sm text-charcoal/70">{l}</dt>
              <dd className="order-1 font-serif text-5xl italic leading-none text-clay md:text-6xl">{n}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {VALUES.map(({ t, d }, i) => (
            <div key={t} className={`reveal-item rounded-card p-8 ${i === 1 ? 'bg-moss text-cream' : 'bg-white/80 ring-1 ring-moss/10'}`}>
              <PawPrint className="h-6 w-6 text-clay" aria-hidden="true" />
              <h3 className={`t-card mt-5 ${i === 1 ? '' : 'text-moss'}`}>{t}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${i === 1 ? 'text-cream/75' : 'text-charcoal/70'}`}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-moss text-cream">
        <div className="container-x">
          <SectionHead dark eyebrow="Nossa jornada" title="Crescendo junto com" accent="cada família." />
          {/* Vertical até lg; linha horizontal de 5 colunas só quando há largura para isso */}
          <ol className="relative mt-14 border-l border-cream/15 pl-8 lg:grid lg:grid-cols-5 lg:gap-6 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-10">
            {TIMELINE.map(({ y, t, d }) => (
              <li key={y} className="reveal-item relative pb-10 last:pb-0 lg:pb-0">
                <span className="absolute -left-[2.45rem] top-2 h-5 w-5 rounded-full bg-clay ring-4 ring-moss lg:-top-[3.15rem] lg:left-0" aria-hidden="true" />
                <p className="font-serif text-4xl italic leading-none text-clay">{y}</p>
                <h3 className="t-item mt-3">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section container-x">
        <SectionHead eyebrow="Equipe" title="Quem cuida do" accent="seu pet." text="Profissionais certificados e apaixonados pela medicina veterinária." />
        {/* 2 → 4 colunas: com 4 pessoas, 3 colunas deixaria um card sozinho */}
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map(({ n, r, c, Icon }) => (
            <li key={n} className="reveal-item group rounded-card bg-white/80 p-6 ring-1 ring-moss/10 transition-[transform,box-shadow] duration-500 ease-spring hover:-translate-y-1 hover:shadow-lift">
              <div className="relative grid aspect-square place-items-center overflow-hidden rounded-tile bg-cream">
                <span className="font-serif text-7xl italic text-moss/80">{n.split(' ')[1][0]}{n.split(' ')[2][0]}</span>
                <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-clay text-cream"><Icon className="h-4 w-4" aria-hidden="true" /></span>
              </div>
              <h3 className="t-item mt-5 text-moss">{n}</h3>
              <p className="mt-1 text-sm text-charcoal/70">{r}</p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-charcoal/45">{c}</p>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand title="Venha conhecer a clínica." text="Agende uma visita ou uma consulta. Vai ser um prazer receber você e seu pet." />
    </>
  )
}

/* ================================================================== */
/* CONTATO                                                             */
/* ================================================================== */
const FAQ = [
  ['Vocês atendem por plano de saúde pet?', 'Sim. Aceitamos os principais planos. Consulte nossa recepção para verificar a cobertura do seu plano.'],
  ['Preciso agendar para emergências?', `Não. Emergências são atendidas sem agendamento, 24 horas por dia, 7 dias por semana. Ligue para ${BRAND.phoneLabel} antes de vir para receber orientações.`],
  ['Quais formas de pagamento aceitam?', 'Pix, cartões de crédito e débito, dinheiro e parcelamento no cartão para procedimentos cirúrgicos.'],
  ['Posso visitar meu pet internado?', 'Sim, mediante agendamento. Em casos de UTI, avaliamos a possibilidade com a equipe de plantão.'],
  ['Quanto tempo antes devo chegar?', 'Recomendamos chegar 10 minutos antes, para o cadastro e para o pet se acalmar no ambiente.'],
  ['Atendem coelhos, aves e outros pets?', 'Sim. Além de cães e gatos, atendemos coelhos, hamsters, porquinhos-da-índia e aves. Para répteis e silvestres, consulte a disponibilidade.'],
]

function BookingForm() {
  const [f, setF] = useState({ nome: '', pet: '', especie: 'Cão', servico: 'Consulta de rotina', data: '', msg: '' })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    const text = [
      `Olá! Sou ${f.nome} e gostaria de agendar um atendimento.`,
      `Pet: ${f.pet} (${f.especie})`,
      `Serviço: ${f.servico}`,
      f.data && `Data preferida: ${new Date(f.data + 'T12:00').toLocaleDateString('pt-BR')}`,
      f.msg && `Obs.: ${f.msg}`,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }
  const field = 'mt-2 block w-full min-h-[48px] rounded-tile border-0 bg-cream px-4 py-3 text-base text-charcoal ring-1 ring-moss/15 placeholder:text-charcoal/40 focus:ring-2 focus:ring-clay'
  const label = 'block text-sm font-semibold text-moss'
  return (
    <form onSubmit={submit} className="reveal rounded-panel bg-white/80 p-6 ring-1 ring-moss/10 md:p-10">
      <h2 className="t-card text-moss md:text-3xl">Agende pelo WhatsApp</h2>
      <p className="mt-3 text-sm text-charcoal/70">Preencha e enviamos sua mensagem pronta no WhatsApp — é só tocar em enviar.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className={label}>Seu nome<input required value={f.nome} onChange={set('nome')} autoComplete="name" className={field} placeholder="Como podemos te chamar?" /></label>
        <label className={label}>Nome do pet<input required value={f.pet} onChange={set('pet')} className={field} placeholder="Ex.: Luna" /></label>
        <label className={label}>Espécie
          <select value={f.especie} onChange={set('especie')} className={`${field} select-x`}>
            {['Cão', 'Gato', 'Coelho', 'Ave', 'Roedor', 'Outro'].map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <label className={label}>Serviço
          <select value={f.servico} onChange={set('servico')} className={`${field} select-x`}>
            {['Consulta de rotina', 'Vacinação', 'Exames', 'Cirurgia', 'Odontologia', 'Especialista', 'Não sei'].map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <label className={`${label} sm:col-span-2`}>Data preferida <span className="font-normal text-charcoal/55">(opcional)</span>
          <input type="date" value={f.data} onChange={set('data')} className={field} />
        </label>
        <label className={`${label} sm:col-span-2`}>Mensagem <span className="font-normal text-charcoal/55">(opcional)</span>
          <textarea rows={3} value={f.msg} onChange={set('msg')} className={field} placeholder="Conte um pouco sobre o que seu pet precisa" />
        </label>
      </div>
      <button type="submit" className="btn mt-6 w-full bg-clay text-cream sm:w-auto">
        <span className="btn-bg bg-moss" aria-hidden="true" />
        <span className="btn-label"><MessageCircle className="h-4 w-4" aria-hidden="true" /> Enviar pelo WhatsApp</span>
      </button>
    </form>
  )
}

export function ContatoPage() {
  return (
    <>
      <PageHero eyebrow="Contato" title="Estamos aqui para" accent="você e seu pet."
        text="Agende uma consulta, tire dúvidas ou venha nos visitar." img="/assets/img/contato-hero.jpg" imgPosition="70% 40%">
        <StatusPill />
      </PageHero>

      <section className="section container-x grid gap-5 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <BookingForm />
        <div className="grid gap-5">
          <a href={BRAND.phoneHref} className="reveal-item group flex items-center gap-4 rounded-card bg-clay p-6 text-cream transition-transform duration-500 ease-spring hover:-translate-y-1 md:p-8">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-tile bg-cream/15"><Siren className="h-5 w-5" aria-hidden="true" /></span>
            <span><span className="eyebrow block text-cream/80">Emergência 24h</span><span className="t-item mt-1 block">{BRAND.phoneLabel}</span></span>
            <Phone className="ml-auto h-5 w-5 transition-transform duration-300 ease-spring group-hover:rotate-12" aria-hidden="true" />
          </a>
          <div className="reveal-item rounded-card bg-white/80 p-6 ring-1 ring-moss/10 md:p-8">
            <p className="t-item flex items-center gap-2 text-moss"><Clock className="h-5 w-5 text-clay" aria-hidden="true" /> Horários</p>
            <dl className="mt-5 space-y-3 text-sm">
              {HOURS_ROWS.map(([d, h]) => (
                <div key={d} className="flex justify-between border-b border-moss/10 pb-3 last:border-0 last:pb-0"><dt className="text-charcoal/70">{d}</dt><dd className="font-mono text-moss">{h}</dd></div>
              ))}
            </dl>
          </div>
          <div className="reveal-item rounded-card bg-white/80 p-6 ring-1 ring-moss/10 md:p-8">
            <p className="t-item flex items-center gap-2 text-moss"><MapPin className="h-5 w-5 text-clay" aria-hidden="true" /> Endereço</p>
            <p className="mt-3 text-sm text-charcoal/70">{BRAND.address}</p>
            <a className="lift mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-clay" target="_blank" rel="noopener noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.address)}`}>
              Abrir no Google Maps <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="container-x pb-24 md:pb-32">
        <SectionHead eyebrow="Dúvidas frequentes" title="Perguntas" accent="frequentes." />
        <div className="mt-14 space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="faq reveal-item group rounded-card bg-white/80 ring-1 ring-moss/10 transition-shadow duration-300 open:shadow-soft">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 md:px-8 [&::-webkit-details-marker]:hidden">
                <span className="t-item text-moss">{q}</span>
                <Plus className="h-5 w-5 shrink-0 text-clay transition-transform duration-500 ease-spring group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="faq-body px-6 pb-6 text-sm leading-relaxed text-charcoal/70 md:px-8">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Mapa em tela larga — sem repetir o bloco de contato da Home */}
      <section className="container-x pb-24 md:pb-32" aria-label="Mapa">
        <div className="reveal relative aspect-[4/3] overflow-hidden rounded-panel ring-1 ring-moss/10 md:aspect-[21/9]">
          <MapFrame className="absolute inset-0" />
        </div>
      </section>
    </>
  )
}

export function NotFound() {
  return (
    <PageHero eyebrow="404" title="Esse caminho" accent="sumiu no quintal."
      text="A página que você procurou não existe. Que tal voltar para o início?">
      <Button to="/" variant="cream">Voltar para a home <ArrowRight className="h-4 w-4" /></Button>
    </PageHero>
  )
}
