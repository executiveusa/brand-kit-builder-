import { FormEvent, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Cloud,
  FileOutput,
  MessageCircle,
  Search,
  Server,
  ShieldCheck,
  Share2,
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
  'Build the brand, website SEO and search-ready content architecture.',
  'Install this brand system on our own server and package the intelligence for handoff.',
]

const proofRows = [
  {
    label: 'Identity engineering',
    title: 'A brand becomes governed source material.',
    copy: 'Positioning, voice, typography, color, SVG masters and applications resolve from one approved manifest instead of drifting across files and prompts.',
  },
  {
    label: 'Search + social',
    title: 'Discoverability inherits the same brand truth.',
    copy: 'SEO, metadata, social profiles, campaign adaptation and publishing plans begin inside the brand architecture instead of being bolted on after launch.',
  },
  {
    label: 'Sovereignty',
    title: 'We install it. You own it.',
    copy: 'The software, portable ICM intelligence and approved assets can live on infrastructure you control. Maintenance is optional, not a lock-in mechanism.',
  },
]

function buildRoute(value: string): RouteStep[] {
  const text = value.toLowerCase()
  const route: RouteStep[] = [
    {
      title: 'Understand',
      detail: 'Confirm source truth, audience, existing assets, protected items, rights and the business outcome.',
    },
    {
      title: 'Distill',
      detail: 'Resolve positioning, proof, voice and the governing creative idea before styling anything.',
    },
    {
      title: 'Build search architecture',
      detail: 'Define entity consistency, audience intent, page topics, metadata and measurement hypotheses without inventing SEO data.',
    },
    {
      title: 'Design the system',
      detail: 'Create identity, production SVG, DARYA typography, color, imagery and the applications this company actually needs.',
    },
  ]

  if (/social|instagram|campaign|linkedin|tiktok|facebook|youtube/.test(text)) {
    route.push({
      title: 'Adapt the social system',
      detail: 'Create platform-ready content from approved brand truth. Scheduling and publishing remain approval-gated.',
    })
  }

  if (/print|pod|shirt|mockup|merch|packaging/.test(text)) {
    route.push({
      title: 'Create production variants',
      detail: 'Prepare application directions, mockups and provenance-ready production outputs without changing canonical identity.',
    })
  }

  if (/install|server|self-host|self host|sovereign|vps|portable|usb|handoff/.test(text)) {
    route.push({
      title: 'Prepare the sovereign install',
      detail: 'Package the software, portable ICM files, runtime contract, backup path and rollback instructions for owner-controlled infrastructure.',
    })
  }

  route.push(
    {
      title: 'Challenge',
      detail: 'A separate Design Guardian, Gauntlet critic and proof pass judge the work. The builder cannot approve itself.',
    },
    {
      title: 'Deliver',
      detail: 'Return an approval-ready brand book, SVG family, voice, tokens, SEO/social handoff, receipts and only the decisions a human must make.',
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
        <a className="wordmark" href="#top" aria-label="PARÉ home">
          PARÉ <span>by Pauli Brand Studio</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">System</a>
          <a href="#studio">Studio</a>
          <a href="#ownership">Ownership</a>
        </nav>
        <a className="header-cta" href="#studio">Create a brand</a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Sovereign brand software · installed for your company</p>
            <h1>
              Brand systems,
              <span>reduced to what matters.</span>
            </h1>
            <div className="hero-meta">
              <p className="hero-lead">
                PARÉ turns scattered company context into one governed brand system: strategy, identity,
                production SVG, voice, SEO, social and delivery. One Hands runs the process underneath.
              </p>
              <p className="hero-note">
                Not subscription lock-in. We install and adapt PARÉ to the business, then hand over the software,
                portable brand intelligence and operating path. Ongoing support is optional.
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
                <p>A real brand-book specimen already inside the studio source. PARÉ preserves the method, not somebody else&apos;s look.</p>
                <a href="/demo-brand-book.html">Open brand book <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="work section-shell" id="work">
          <div className="section-heading">
            <span>01 — The system</span>
            <h2>A house method.<br /><em>Never a house look.</em></h2>
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
            <p className="eyebrow">02 — One Hands</p>
            <h2>Ask for the outcome.</h2>
            <p>
              One Hands compiles the smallest useful ICM context, routes specialist workers, rejects weak work
              and returns proof. It asks for a human only when the decision is consequential.
            </p>
          </div>

          <form className="composer" onSubmit={submit}>
            <div className="composer-topline">
              <span>PARÉ / Outcome planner</span>
              <span className="truth-badge">Local plan preview</span>
            </div>
            <div className="composer-body">
              <label htmlFor="outcome">What should the studio make?</label>
              <textarea
                id="outcome"
                value={outcome}
                onChange={(event) => setOutcome(event.target.value)}
                placeholder="Build the launch brand for our company. We need the identity, production SVG, voice, SEO, social system and a self-hosted handoff."
              />
              <div className="quick-prompts" aria-label="Example outcomes">
                {quickPrompts.map((prompt) => (
                  <button key={prompt} type="button" onClick={() => setOutcome(prompt)}>
                    {prompt.includes('Instagram') ? 'Social campaign' : prompt.includes('SEO') ? 'Brand + SEO' : prompt.includes('server') ? 'Sovereign install' : 'Brand kit'}
                  </button>
                ))}
              </div>
              <div className="composer-submit">
                <button className="primary-button" type="submit">
                  Show the route <ArrowRight size={16} aria-hidden="true" />
                </button>
                <p>This public surface previews the method. Agent execution runs through the authenticated REST, MCP, CLI or folder-drop interfaces.</p>
              </div>
            </div>

            {submitted && (
              <div className="route-preview" aria-live="polite">
                <div className="route-heading">
                  <div>
                    <span className="micro">One Hands route preview</span>
                    <h3>{submitted}</h3>
                  </div>
                  <span className="truth-badge">Preview · no publish</span>
                </div>
                <ol>
                  {route.map((step, index) => (
                    <li key={`${step.title}-${index}`}>
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
            <p className="eyebrow">03 — Optional operating layer</p>
            <h2 id="cloud-title">Keep the work.<br /><em>Not the dependency.</em></h2>
            <p>Cloud state can index organizations, projects and receipts. Canonical brand intelligence still lives in portable ICM files and approved manifests.</p>
          </div>
          <CloudWorkspace intent={submitted} />
        </section>

        <section className="system section-shell" id="system">
          <div className="section-heading">
            <span>04 — One office, many doors</span>
            <h2>Call it from<br /><em>where the work happens.</em></h2>
          </div>
          <div className="system-grid">
            <article><MessageCircle aria-hidden="true" /><h3>One Hands</h3><p>Outcome-first orchestration over the same ICM stages, work orders and approval language.</p><span className="status live"><Check size={13} /> Runtime contract</span></article>
            <article><Search aria-hidden="true" /><h3>SEO inside</h3><p>Entity, search intent, page architecture, metadata and social discovery stay consistent with the approved brand.</p><span className="status contract"><FileOutput size={13} /> Workflow registered</span></article>
            <article><Share2 aria-hidden="true" /><h3>Social governed</h3><p>Plan and adapt inside PARÉ; Postiz can schedule or publish only after recorded approval.</p><span className="status contract"><ShieldCheck size={13} /> Approval gated</span></article>
            <article><Server aria-hidden="true" /><h3>Self-hostable</h3><p>REST, MCP, CLI and Docker are built around owner-controlled credentials, files and worker endpoints.</p><span className="status live"><Usb size={13} /> Sovereign package</span></article>
          </div>
        </section>

        <section className="closing" id="ownership">
          <div>
            <p className="eyebrow">05 — Ownership</p>
            <h2>Installed for you.<br />Owned by you.<br />Operated your way.</h2>
          </div>
          <div className="closing-copy">
            <p>We can install, customize, migrate and maintain PARÉ. If the relationship ends, the software and approved company brand intelligence do not disappear with us.</p>
            <a href="#studio">Create a brand <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>
      </main>

      <footer>
        <span>PARÉ — Brand systems, reduced to what matters.</span>
        <span>Pauli Brand Studio · Sovereign software · 2026</span>
      </footer>
    </>
  )
}
