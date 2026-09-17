import { FormEvent, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileOutput,
  MessageCircle,
  Search,
  Server,
  ShieldCheck,
  Share2,
  Usb,
  Type,
} from 'lucide-react'
import { CloudWorkspace } from './components/CloudWorkspace'

type RouteStep = {
  title: string
  detail: string
}

type WorkflowShortcut = {
  id: string
  label: string
  prompt: string
  description: string
  route: RouteStep[]
}

const workflowShortcuts: WorkflowShortcut[] = [
  {
    id: 'brownfield-rescue.v1',
    label: 'Rescue existing',
    prompt: 'Rescue this existing product without rewriting what already works. Inspect it first, reduce the friction, make the smallest justified changes, and prove the result.',
    description: 'Inspect → baseline → repair one bounded slice → visual QA → proof.',
    route: [
      { title: 'Baseline', detail: 'Inspect the existing product, architecture, content, interaction model and current checks before changing anything.' },
      { title: 'Find the friction', detail: 'Identify broken behavior, duplicate logic, cognitive load, generic design patterns and the smallest meaningful blast radius.' },
      { title: 'Lock direction only if needed', detail: 'Use reference research only when the current visual direction is insufficient or contradictory; preserve protected assets and working conventions.' },
      { title: 'Repair one bounded slice', detail: 'Make the smallest isolated change that materially improves the user outcome without rewriting the product.' },
      { title: 'Verify', detail: 'Test responsive behavior, accessibility, state clarity, regressions and visual drift against the approved direction.' },
      { title: 'Prove and hand back', detail: 'Return evidence, remaining risks and rollback. A builder may not approve its own work.' },
    ],
  },
  {
    id: 'greenfield-interface.v1',
    label: 'Design new',
    prompt: 'Design a new interface from the user outcome first. Validate the smallest valuable scope, establish the visual direction, specify it, build one verifiable slice, and prove it.',
    description: 'Outcome → reference lock → specification → one slice → proof.',
    route: [
      { title: 'Define the outcome', detail: 'Establish the user, trigger, desired result, primary action, constraints, ownership and proof before styling.' },
      { title: 'Research directions', detail: 'Study several relevant references, compare their underlying design logic and select one dominant foundation.' },
      { title: 'Lock the system', detail: 'Specify typography, spacing, color roles, imagery, motion, interaction and accessibility before implementation.' },
      { title: 'Build one slice', detail: 'Implement the smallest end-to-end interface slice that can be meaningfully tested.' },
      { title: 'Challenge the result', detail: 'Run independent visual, usability, accessibility and failure-state review.' },
      { title: 'Prove', detail: 'Return rendered evidence and an explicit verification status before expanding scope.' },
    ],
  },
  {
    id: 'audit-cut.v1',
    label: 'Audit + cut',
    prompt: 'Audit this experience for clutter, confusion, generic AI design and unnecessary decisions. Rank the problems, remove what does not earn attention, and give me the smallest repair plan.',
    description: 'Evidence-first critique and subtraction without automatic mutation.',
    route: [
      { title: 'Observe', detail: 'Inspect the actual interface, copy, states and task path rather than judging from assumptions.' },
      { title: 'Rank defects', detail: 'Classify issues by severity: blocked outcome, material friction, polish debt or optional improvement.' },
      { title: 'Subtract', detail: 'Remove, combine, infer or progressively disclose anything that does not help the user understand, decide, act, verify or recover.' },
      { title: 'Protect what works', detail: 'Preserve useful conventions, brand truth, accessibility and consequential human controls.' },
      { title: 'Return the repair slice', detail: 'Provide the smallest high-leverage fix sequence with proof criteria. Do not mutate unless implementation was requested.' },
    ],
  },
  {
    id: 'reference-lock.v1',
    label: 'Reference lock',
    prompt: 'Research and lock a distinctive visual direction before building. Compare multiple references, choose one dominant foundation, define the design decisions, and prevent visual drift.',
    description: 'Research → compare → select → decision ledger → locked direction.',
    route: [
      { title: 'Read the brief', detail: 'Resolve the audience, outcome, brand truth, protected assets and the specific visual problem that needs direction.' },
      { title: 'Research multiple references', detail: 'Study several relevant examples for typography, color, imagery, pacing, interaction and craft rather than copying a finished layout.' },
      { title: 'Choose a dominant foundation', detail: 'Select one reference logic as the primary system. Propose primary, secondary and fallback type choices from the font reference set, then verify licensing before approval.' },
      { title: 'Write the decision ledger', detail: 'Lock the chosen type family, roles, weights, fallback stack, license evidence, palette roles, spacing, imagery, iconography, motion, states and responsive behavior before coding.' },
      { title: 'Set anti-drift rules', detail: 'Record what must not be introduced so implementation cannot slide back into generic AI aesthetics or unrelated references.' },
    ],
  },
  {
    id: 'visual-qa.v1',
    label: 'Visual QA',
    prompt: 'Verify this implementation visually and functionally. Compare the rendered result against the approved system at the required breakpoints, rank defects, repair material drift, and report what is actually proven.',
    description: 'Render → compare → repair → accessibility/state check → proof.',
    route: [
      { title: 'Render the real implementation', detail: 'Inspect the actual product at required desktop and mobile breakpoints, including loading, empty, error and interactive states where relevant.' },
      { title: 'Compare against the lock', detail: 'Check typography, spacing, hierarchy, color roles, imagery, motion, interaction and responsive ordering against the approved system.' },
      { title: 'Rank visual defects', detail: 'Separate release blockers from material drift, polish debt and optional refinements.' },
      { title: 'Repair material drift', detail: 'Fix the smallest set of defects that prevent the implementation from matching the approved direction and user outcome.' },
      { title: 'Verify accessibility and state truth', detail: 'Check focus, keyboard use, contrast, reduced motion, touch targets and whether success/failure states accurately describe reality.' },
      { title: 'Issue proof status', detail: 'Report DESIGNED, IMPLEMENTED, TESTED, PREVIEW VERIFIED or PRODUCTION VERIFIED only when supporting evidence exists.' },
    ],
  },
]

const quickPrompts = [
  'Build a complete brand kit from my current website and logo.',
  'Create an Instagram campaign system from the approved brand.',
  'Build the brand, website SEO and search-ready content architecture.',
  'Install this brand system on our own server and package the intelligence for handoff.',
]

type FontReference = {
  name: string
  className: string
  note: string
  href: string
}

const fontReferences: FontReference[] = [
  { name: 'Geist', className: 'Sans / system', note: 'Vercel', href: 'https://vercel.com/font#get' },
  { name: 'Galgo Condensed', className: 'Display / condensed', note: 'Giulia Boggio', href: 'https://www.awwwards.com/inspiration/galgo-condensed-by-giulia-boggio' },
  { name: 'NOHEMI', className: 'Sans / display', note: 'License check required', href: 'https://www.awwwards.com/inspiration/nohemi-typeface' },
  { name: 'Ranade', className: 'Sans / versatile', note: 'Fontshare', href: 'https://www.fontshare.com/fonts/ranade' },
  { name: 'Clash Display', className: 'Display / variable', note: 'Fontshare', href: 'https://www.fontshare.com/fonts/clash-display' },
  { name: 'Cabinet Grotesk', className: 'Grotesk / variable', note: 'Fontshare', href: 'https://www.fontshare.com/fonts/cabinet-grotesk' },
  { name: 'Satoshi', className: 'Sans / variable', note: 'Fontshare', href: 'https://www.fontshare.com/fonts/satoshi' },
  { name: 'Junicode Bold Condensed', className: 'Serif / condensed', note: 'License check required', href: 'https://www.awwwards.com/inspiration/junicode-bold-condensed' },
  { name: 'Bigilla', className: 'Serif / display', note: 'Jérémie Gauthier', href: 'https://www.pixelsurplus.com/freebies/bigilla-free-display-serif-typeface' },
  { name: 'OffBit', className: 'Display / pixel', note: 'License check required', href: 'https://www.awwwards.com/inspiration/offbit-free-font' },
  { name: 'Disket Mono', className: 'Mono / grid', note: 'License check required', href: 'https://www.awwwards.com/inspiration/disket-mono-display-monospaced-grid-based-typeface' },
  { name: 'Heming', className: 'Mono / variable', note: 'Personal + commercial listed', href: 'https://www.awwwards.com/inspiration/heming-a-free-variable-monotype-font' },
]

const fontSources = [
  {
    label: 'Awwwards Free Fonts collection',
    href: 'https://www.awwwards.com/awwwards/collections/free-fonts/',
  },
  {
    label: '100 Best Free Fonts for Designers in 2025',
    href: 'https://www.awwwards.com/best-free-fonts.html',
  },
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

function buildRoute(value: string, workflowId: string): RouteStep[] {
  const workflow = workflowShortcuts.find((candidate) => candidate.id === workflowId)
  if (workflow) return workflow.route

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
      detail: 'Create identity, production SVG, a primary/secondary/fallback type proposal from the PARÉ Fonts library, color, imagery and the applications this company actually needs. Verify the current font license before production use.',
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
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [submittedWorkflowId, setSubmittedWorkflowId] = useState('')
  const submittedWorkflow = useMemo(
    () => workflowShortcuts.find((workflow) => workflow.id === submittedWorkflowId) ?? null,
    [submittedWorkflowId],
  )
  const route = useMemo(
    () => (submitted ? buildRoute(submitted, submittedWorkflowId) : []),
    [submitted, submittedWorkflowId],
  )
  const cloudIntent = submitted
    ? submittedWorkflowId
      ? `${submitted}\n\nUse built-in workflow: ${submittedWorkflowId}.`
      : submitted
    : ''

  function chooseWorkflow(workflow: WorkflowShortcut) {
    setSelectedWorkflowId(workflow.id)
    setOutcome(workflow.prompt)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = outcome.trim()
    if (!value) return
    setSubmitted(value)
    setSubmittedWorkflowId(selectedWorkflowId)
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
          <a href="#fonts">Fonts</a>
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
                onChange={(event) => {
                  setOutcome(event.target.value)
                  setSelectedWorkflowId('')
                }}
                placeholder="Build the launch brand for our company. We need the identity, production SVG, voice, SEO, social system and a self-hosted handoff."
              />
              <div>
                <span className="micro">Built-in engineering workflows</span>
                <div className="quick-prompts" aria-label="Built-in engineering workflows">
                  {workflowShortcuts.map((workflow) => (
                    <button
                      key={workflow.id}
                      type="button"
                      aria-pressed={selectedWorkflowId === workflow.id}
                      title={workflow.description}
                      onClick={() => chooseWorkflow(workflow)}
                    >
                      {workflow.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="micro">Common outcomes</span>
                <div className="quick-prompts" aria-label="Example outcomes">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => {
                        setSelectedWorkflowId('')
                        setOutcome(prompt)
                      }}
                    >
                      {prompt.includes('Instagram') ? 'Social campaign' : prompt.includes('SEO') ? 'Brand + SEO' : prompt.includes('server') ? 'Sovereign install' : 'Brand kit'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="composer-submit">
                <button className="primary-button" type="submit">
                  Show the route <ArrowRight size={16} aria-hidden="true" />
                </button>
                <p>Choose a built-in workflow or describe the outcome normally. One Hands keeps the workflow machinery behind the conversation.</p>
              </div>
            </div>

            {submitted && (
              <div className="route-preview" aria-live="polite">
                <div className="route-heading">
                  <div>
                    <span className="micro">One Hands route preview</span>
                    <h3>{submitted}</h3>
                    {submittedWorkflow && (
                      <p className="micro">{submittedWorkflow.label} · {submittedWorkflow.id}</p>
                    )}
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

        <section className="fonts section-shell" id="fonts" aria-labelledby="fonts-title">
          <div className="section-heading">
            <span>03 — Fonts</span>
            <h2 id="fonts-title">Type with a reason.<br /><em>License before release.</em></h2>
          </div>
          <div className="font-intro">
            <p>
              Every PARÉ brand-kit route now proposes a primary, secondary and fallback type system from this reference library.
              These are research leads, not bundled font files or automatic commercial-use clearance.
            </p>
            <div className="font-sources" aria-label="Font research sources">
              {fontSources.map((source) => (
                <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
                  {source.label} <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="font-grid">
            {fontReferences.map((font, index) => (
              <a className="font-card" key={font.name} href={font.href} target="_blank" rel="noreferrer">
                <span className="font-index">{String(index + 1).padStart(2, '0')}</span>
                <Type aria-hidden="true" />
                <h3>{font.name}</h3>
                <p>{font.className}</p>
                <small>{font.note} <ArrowUpRight size={12} aria-hidden="true" /></small>
              </a>
            ))}
          </div>
          <div className="font-gate">
            <strong>Brand-kit type gate</strong>
            <span>Shortlist → role + weight tests → small-size proof → current license read-back → owner selection → production files.</span>
          </div>
        </section>

        <section className="cloud-shell" aria-labelledby="cloud-title">
          <div className="cloud-shell-copy">
            <p className="eyebrow">04 — Optional operating layer</p>
            <h2 id="cloud-title">Keep the work.<br /><em>Not the dependency.</em></h2>
            <p>Cloud state can index organizations, projects and receipts. Canonical brand intelligence still lives in portable ICM files and approved manifests.</p>
          </div>
          <CloudWorkspace intent={cloudIntent} />
        </section>

        <section className="system section-shell" id="system">
          <div className="section-heading">
            <span>05 — One office, many doors</span>
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
            <p className="eyebrow">06 — Ownership</p>
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
