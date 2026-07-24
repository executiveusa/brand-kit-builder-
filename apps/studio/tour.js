import { translate } from './i18n.js';

export const TOUR_STORAGE_KEY = 'pauli-brand-studio-tour-v1-complete';

export const tourSteps = [
  { target: '#project-switcher', title: 'tour.projectSwitcherTitle', body: 'tour.projectSwitcherBody' },
  { target: '#new-project-button', title: 'tour.newProjectTitle', body: 'tour.newProjectBody' },
  { target: '#workflow-panel', title: 'tour.workflowTitle', body: 'tour.workflowBody' },
  { target: '[data-stage="intake"]', title: 'tour.intakeTitle', body: 'tour.intakeBody' },
  { target: '[data-stage="sources"]', title: 'tour.sourcesTitle', body: 'tour.sourcesBody' },
  { target: '[data-stage="readiness"]', title: 'tour.readinessTitle', body: 'tour.readinessBody' },
  { target: '[data-stage="strategy"]', title: 'tour.strategyTitle', body: 'tour.strategyBody' },
  { target: '[data-stage="voice"]', title: 'tour.voiceTitle', body: 'tour.voiceBody' },
  { target: '[data-stage="visual"]', title: 'tour.visualTitle', body: 'tour.visualBody' },
  { target: '[data-stage="brandbook"]', title: 'tour.brandbookTitle', body: 'tour.brandbookBody' },
  { target: '[data-stage="guardian"]', title: 'tour.guardianTitle', body: 'tour.guardianBody' },
  { target: '[data-stage="export"]', title: 'tour.exportTitle', body: 'tour.exportBody' },
  { target: '#canvas-tabs', title: 'tour.canvasTabsTitle', body: 'tour.canvasTabsBody' },
  { target: '#viewport-controls', title: 'tour.viewportTitle', body: 'tour.viewportBody' },
  { target: '#brand-canvas', title: 'tour.canvasTitle', body: 'tour.canvasBody' },
  { target: '#bottom-dock', title: 'tour.bottomDockTitle', body: 'tour.bottomDockBody' },
  { target: '#inspector-panel', title: 'tour.inspectorTitle', body: 'tour.inspectorBody' },
  { target: '#color-controls', title: 'tour.colorsTitle', body: 'tour.colorsBody' },
  { target: '#type-controls', title: 'tour.typeTitle', body: 'tour.typeBody' },
  { target: '[data-inspector="voice"]', title: 'tour.voiceControlsTitle', body: 'tour.voiceControlsBody', before: () => document.querySelector('[data-inspector="voice"]')?.click() },
  { target: '[data-inspector="provenance"]', title: 'tour.evidenceTitle', body: 'tour.evidenceBody', before: () => document.querySelector('[data-inspector="provenance"]')?.click() },
  { target: '#apply-controls', title: 'tour.applyTitle', body: 'tour.applyBody', before: () => document.querySelector('[data-inspector="design"]')?.click() },
  { target: '#language-switcher', title: 'tour.languageTitle', body: 'tour.languageBody' },
  { target: '#agent-status', title: 'tour.agentTitle', body: 'tour.agentBody' },
  { target: '#tour-button', title: 'tour.tourButtonTitle', body: 'tour.tourButtonBody' }
];

export class ProductTour {
  constructor(root = document.getElementById('tour-root')) {
    this.root = root;
    this.index = 0;
    this.active = false;
    this.keyHandler = (event) => {
      if (!this.active) return;
      if (event.key === 'Escape') this.finish(false);
      if (event.key === 'ArrowRight') this.next();
      if (event.key === 'ArrowLeft') this.previous();
    };
    window.addEventListener('resize', () => this.position());
    window.addEventListener('scroll', () => this.position(), true);
    window.addEventListener('pauli:locale-change', () => this.render());
  }

  shouldAutoStart() {
    const requested = new URLSearchParams(location.search).get('tour') === '1';
    return requested || localStorage.getItem(TOUR_STORAGE_KEY) !== 'true';
  }

  start({ force = false } = {}) {
    if (!force && !this.shouldAutoStart()) return;
    this.index = 0;
    this.active = true;
    document.addEventListener('keydown', this.keyHandler);
    this.render();
  }

  next() {
    if (this.index >= tourSteps.length - 1) return this.finish(true);
    this.index += 1;
    this.render();
  }

  previous() {
    if (this.index === 0) return;
    this.index -= 1;
    this.render();
  }

  finish(markComplete = true) {
    document.querySelector('.tour-target')?.classList.remove('tour-target');
    if (markComplete) localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    this.root.replaceChildren();
    this.active = false;
    document.removeEventListener('keydown', this.keyHandler);
    document.getElementById('tour-button')?.focus();
  }

  render() {
    if (!this.active) return;
    document.querySelector('.tour-target')?.classList.remove('tour-target');
    const step = tourSteps[this.index];
    step.before?.();
    const target = document.querySelector(step.target);
    if (!target) return this.next();
    target.classList.add('tour-target');
    target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });

    const shade = document.createElement('div');
    shade.className = 'tour-shade';
    const focus = document.createElement('div');
    focus.className = 'tour-focus';
    focus.setAttribute('aria-hidden', 'true');
    const card = document.createElement('section');
    card.className = 'tour-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-labelledby', 'tour-title');
    card.innerHTML = `
      <div class="tour-progress"><span>${translate('tour.step')} ${this.index + 1} ${translate('tour.of')} ${tourSteps.length}</span><span>${Math.round(((this.index + 1) / tourSteps.length) * 100)}%</span></div>
      <header><h2 id="tour-title">${translate(step.title)}</h2></header>
      <p>${translate(step.body)}</p>
      <div class="tour-actions">
        <button type="button" class="text-button" data-tour-action="skip" data-help="tourSkip" aria-label="${translate('tour.skip')}">${translate('tour.skip')}</button>
        <div>
          <button type="button" class="secondary-button" data-tour-action="back" data-help="tourBack" aria-label="${translate('tour.back')}" ${this.index === 0 ? 'disabled' : ''}>${translate('tour.back')}</button>
          <button type="button" class="primary-button" data-tour-action="next" data-help="tourNext" aria-label="${this.index === tourSteps.length - 1 ? translate('tour.finish') : translate('tour.next')}">${this.index === tourSteps.length - 1 ? translate('tour.finish') : translate('tour.next')}</button>
        </div>
      </div>`;
    this.root.replaceChildren(shade, focus, card);
    card.querySelector('[data-tour-action="skip"]').addEventListener('click', () => this.finish(true));
    card.querySelector('[data-tour-action="back"]').addEventListener('click', () => this.previous());
    card.querySelector('[data-tour-action="next"]').addEventListener('click', () => this.next());
    card.querySelector('[data-tour-action="next"]').focus();
    this.position();
  }

  position() {
    if (!this.active) return;
    const step = tourSteps[this.index];
    const target = document.querySelector(step.target);
    const focus = this.root.querySelector('.tour-focus');
    const card = this.root.querySelector('.tour-card');
    if (!target || !focus || !card) return;
    const rect = target.getBoundingClientRect();
    const pad = 6;
    Object.assign(focus.style, {
      left: `${Math.max(4, rect.left - pad)}px`, top: `${Math.max(4, rect.top - pad)}px`, width: `${Math.min(innerWidth - 8, rect.width + pad * 2)}px`, height: `${Math.min(innerHeight - 8, rect.height + pad * 2)}px`
    });
    const cardRect = card.getBoundingClientRect();
    let left = rect.right + 18;
    let top = rect.top;
    if (left + cardRect.width > innerWidth - 14) left = Math.max(14, rect.left - cardRect.width - 18);
    if (top + cardRect.height > innerHeight - 14) top = Math.max(14, innerHeight - cardRect.height - 14);
    if (rect.width > innerWidth * .7 || rect.height > innerHeight * .55) {
      left = Math.max(14, (innerWidth - cardRect.width) / 2);
      top = Math.max(14, innerHeight - cardRect.height - 18);
    }
    Object.assign(card.style, { left: `${left}px`, top: `${top}px` });
  }
}
