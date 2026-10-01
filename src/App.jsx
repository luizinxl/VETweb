import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Footer, FloatingWhatsApp, Navbar, ScrollProgress, usePath, useReveal } from './shared.jsx'
import Home from './Home.jsx'
import { ContatoPage, EspecialidadesPage, NotFound, ServicosPage, SobrePage } from './pages.jsx'

const ROUTES = {
  '/': { Page: Home, title: 'Cimu | Clínica Veterinária' },
  '/servicos': { Page: ServicosPage, title: 'Serviços | Cimu Clínica Veterinária' },
  '/especialidades': { Page: EspecialidadesPage, title: 'Especialidades | Cimu Clínica Veterinária' },
  '/sobre': { Page: SobrePage, title: 'Sobre nós | Cimu Clínica Veterinária' },
  '/contato': { Page: ContatoPage, title: 'Contato | Cimu Clínica Veterinária' },
}

export default function App() {
  const path = usePath().replace(/\/+$/, '') || '/'
  const route = ROUTES[path] ?? { Page: NotFound, title: 'Página não encontrada | Cimu' }
  const root = useReveal([path])

  useEffect(() => {
    document.title = route.title
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => clearTimeout(id)
  }, [route])

  return (
    <div ref={root}>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-skip focus:rounded-full focus:bg-cream focus:px-4 focus:py-2">
        Pular para o conteúdo
      </a>
      <div className="noise" aria-hidden="true" />
      <ScrollProgress />
      <Navbar />
      <main id="conteudo" key={path} className="fade-swap">
        <route.Page />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
