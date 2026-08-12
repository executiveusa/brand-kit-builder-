import { FormEvent, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Cloud,
  FileOutput,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Usb,
} from 'lucide-react'
import { CloudWorkspace } from './components/CloudWorkspace'

type RouteStep = {
  title: string
  detail: string
}

const quickPrompts = [
  'Build a complete brand kit from my current website and logo.',
  'Create an Instagram campaign system from the approved brand.',
  'Create print-on-demand artwork and product mockups from this brand.',
  'Package this company voice, design rules and decisions into a portable intelligence pack.',
]

const proofRows = [
  {
    label: 'Brand systems',
    title: 'Strategy becomes a governed visual system.',
    copy: 'Positioning, voice, typography, color, applications and delivery resolve from one approved brand truth instead of drifting across files.',
  },
  {
    label: 'Campaigns',
    title: 'One identity can generate many useful forms.',
    copy: 'Social, campaign imagery, apparel, packaging, decks and digital surfaces inherit the same decisions and protected items.',
  },
  {
    label: 'Ownership',
    title: 'The intelligence leaves with the client.',
    copy: 'Approved project files are designed to remain inspectable and portable instead of being trapped inside a single provider dashboard.',
  },
]

function buildRoute(value: string): RouteStep[] {
  const text = value.toLowerCase()
  const route: RouteStep[] = [
    {
      title: 'Load source truth',
      detail: 'Confirm the project, source assets, protected items, rights and intended outcome.',
    },
    {
      title: 'Resolve strategy',
      detail: 'Load or propose positioning, audience, proof, voice and the governed brand manifest.',
    },
  ]

  if (/social|instagram|campaign/.test(text)) {
    route.push({
      title: 'Build campaign system',
      detail: 'Create reusable campaign directions and social-ready structures from approved brand truth.',
    })
  }

  if (/print|pod|shirt|mockup|merch|packaging/.test(text)) {
    route.push({
      title: 'Create production variants',
      detail: 'Prepare application directions, mockups and provenance-ready production outputs.',
    })
  }

  if (/portable|usb|intelligence|folder|files/.test(text)) {
    route.push({
      title: 'Compile portable intelligence',
      detail: 'Package the approved ICM project context and receipts for local or USB handoff.',
    })
  }

  route.push(
    {
      title: 'Run independent review',
      detail: 'Brand, usability, accessibility, taste and rights checks judge the work independently.',
    },
    {
      title: 'Return proof + decisions',
      detail: 'Show the artifacts and only the consequential choices that require human approval.',
    },
  )

  return route
}

export function App() {
  const [outcome, setOutcome] = useState('')
  const [submitted, setSubmitted] = useState('')
  const route = useMemo(() => (submitted ? buildRoute(submitted) : []), [submitted])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = outcome.trim()
    if (!value) return
    setSubmitted(value)
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="POLISH home">
          POLISH <span>by The Pauli Effect</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#system">System</a>
        </nav>
        <a className="header-cta" href="#studio">Open studio</a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Boutique brand intelligence · governed design office</p>
            <h1>
              Make the brand
              <span>impossible to confuse.</span>
            </h1>
            <div className="hero-meta">
              <p className="hero-lead">
                A design office for brand systems, campaigns, product visuals, social,
                print and software. Ask for the outcome. The machinery stays underneath.
              </p>
              <p className="hero-note">
                Cloud identity and work-order persistence are being added behind the same outcome-first surface.
                Factory execution remains explicitly separate until its runtime phase is wired and verified.
              </p>
            </div>
            <blockquote className="hero-quote">
              <p>“Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.”</p>
              <cite>Antoine de Saint-Exupéry</cite>
            </blockquote>
          </div>

          <div className="hero-proof" aria-label="Brand system proof specimen">
            <div className="proof-visual" aria-hidden="true">
              <div className="proof-arch" />
              <div className="proof-palette">
                <span className="arena">ARENA</span>
                <span className="arcilla">ARCILLA</span>
                <span className="ladrillo">LADRILLO</span>
                <span className="natural">NATURAL</span>
              </div>
            </div>
            <div className="proof-caption">
              <span className="micro">Proof 01 / Brand system</span>
              <div>
                <h2>Racional<br />Creativo</h2>
                <p>A working brand-book specimen already in this repository.</p>
                <a href="/demo-brand-book.html">Open brand book <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="work section-shell" id="work">
          <div className="section-heading">
            <span>01 — The work</span>
            <h2>Proof first.<br /><em>Process second.</em></h2>
          </div>
          <div className="proof-list">
            {proofRows.map((row) => (
              <article className="proof-row" key={row.label}>
                <span>{row.label}</span>
                <h3>{row.title}</h3>
                <p>{row.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="studio" id="studio">
          <div className="studio-intro">
            <p className="eyebrow">02 — The front door</p>
            <h2>Ask for the outcome.</h2>
            <p>
              The primary interface is a conversation. The system loads what it already knows,
              asks only for missing context and returns proof plus the decisions only a human should make.
            </p>
          </div>

          <form className="composer" onSubmit={submit}>
            <div className="composer-topline">
              <span>POLISH / Outcome composer</span>
              <span className="truth-badge">Route preview</span>
            </div>
            <div className="composer-body">
              <label htmlFor="outcome">What should the studio make?</label>
              <textarea
                id="outcome"
                value={outcome}
                onChange={(event) => setOutcome(event.target.value)}
                placeholder="Build the launch brand for my new product. I need the voice, visual system, social templates and a portable brand pack."
              />
              <div className="quick-prompts" aria-label="Example outcomes">
                {quickPrompts.map((prompt) => (
                  <button key={prompt} type="button" onClick={() => setOutcome(prompt)}>
                    {prompt.includes('Instagram') ? 'Social campaign' : prompt.includes('print-on-demand') ? 'POD + mockups' : prompt.includes('portable') ? 'Portable intelligence' : 'Brand kit'}
                  </button>
                ))}
              </div>
              <div className="composer-submit">
                <button className="primary-button" type="submit">
                  Show the route <ArrowRight size={16} aria-hidden="true" />
                </button>
                <p>Preview the route first. Cloud persistence appears below only when this build is configured for it.</p>
              </div>
            </div>

            {submitted && (
              <div className="route-preview" aria-live="polite">
                <div className="route-heading">
                  <div>
                    <span className="micro">Route preview</span>
                    <h3>{submitted}</h3>
                  </div>
                  <span className="truth-badge">No factory execution yet</span>
                </div>
                <ol>
                  {route.map((step, index) => (
                    <li key={step.title}>
                      <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                      <div><strong>{step.title}</strong><p>{step.detail}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </form>
        </section>

        <section className="cloud-shell" aria-labelledby="cloud-title">
          <div className="cloud-shell-copy">
            <p className="eyebrow">03 — Persistence, when you want it</p>
            <h2 id="cloud-title">Keep the work.<br /><em>Not the lock-in.</em></h2>
            <p>Cloud state remembers identity, projects and operational receipts. The actual brand intelligence still points back to portable ICM files.</p>
          </div>
          <CloudWorkspace intent={submitted} />
        </section>

        <section className="system section-shell" id="system">
          <div className="section-heading">
            <span>04 — One office, many doors</span>
            <h2>The intelligence<br />travels <em>with you.</em></h2>
          </div>
          <div className="system-grid">
            <article><MessageCircle aria-hidden="true" /><h3>Human first</h3><p>The product starts with the outcome, not an agent roster or configuration maze.</p><span className="status live"><Check size={13} /> App shell</span></article>
            <article><ShieldCheck aria-hidden="true" /><h3>Governed</h3><p>Factory contracts, protected items and independent Guardians define what may ship.</p><span className="status contract"><FileOutput size={13} /> Contracts live</span></article>
            <article><Usb aria-hidden="true" /><h3>Portable</h3><p>ICM projects are structured so a compatible local agent can cold-start from files.</p><span className="status contract"><Sparkles size={13} /> Architecture live</span></article>
            <article><Cloud aria-hidden="true" /><h3>Cloud optionality</h3><p>Supabase indexes operational state; it does not become the sole owner of company intelligence.</p><span className="status planned"><Cloud size={13} /> Phase 3</span></article>
          </div>
        </section>

        <section className="closing">
          <div>
            <p className="eyebrow">05 — Ownership</p>
            <h2>Your brand.<br />Your intelligence.<br />Your files.</h2>
          </div>
          <div className="closing-copy">
            <p>High-level design built like a studio, operated like governed intelligence and designed to leave the customer with something they can actually own.</p>
            <a href="#studio">Open the studio <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>
      </main>

      <footer>
        <span>POLISH — working name</span>
        <span>The Pauli Effect · Human Design Office · 2026</span>
      </footer>
    </>
  )
}
