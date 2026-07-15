import { DIGITAL_ANNEXES, KAKU_SECTIONS, brandbookIsComplete, renderBrandbookDocument } from './kaku-brandbook.js';
import { brandbookCopy as copy } from './brandbook-copy.js';

function esc(value) { return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }
function locale() { return document.documentElement.dataset.locale === 'es-MX' ? 'es-MX' : 'en'; }
function label(item) { return locale() === 'es-MX' ? item.es : item.en; }

export function installBrandbookTools(brandTools) {
  const originalOpenStage = brandTools.openStage.bind(brandTools);
  let active = null;
  let previewOpen = false;

  function itemList(project) {
    const core = project.brandbook.sections.map((section, index) => ({ type: 'section', key: section.id, number: String(index + 1).padStart(2, '0'), title: label(KAKU_SECTIONS[index]), done: section.approved }));
    const annexes = project.brandbook.annexes.map((annex, index) => ({ type: 'annex', key: annex.id, number: DIGITAL_ANNEXES[index].letter, title: label(DIGITAL_ANNEXES[index]), done: annex.included && Boolean(annex.content.trim()) }));
    return [...core, ...annexes];
  }

  function render() {
    const project = brandTools.store.getCurrent();
    if (!['active', 'complete'].includes(project.stages.brandbook.status)) return originalOpenStage('brandbook');
    if (!project.brandbook) brandTools.project = brandTools.store.seedBrandbook(project.project_id, locale());
    const currentProject = brandTools.store.getCurrent();
    const items = itemList(currentProject);
    if (!active || !items.some((item) => `${item.type}:${item.key}` === active)) {
      const firstIncomplete = items.find((item) => !item.done) || items[0];
      active = `${firstIncomplete.type}:${firstIncomplete.key}`;
    }
    const [type, key] = active.split(':');
    const collection = type === 'section' ? currentProject.brandbook.sections : currentProject.brandbook.annexes;
    const record = collection.find((item) => item.id === key);
    const meta = type === 'section' ? KAKU_SECTIONS.find((item) => item.id === key) : DIGITAL_ANNEXES.find((item) => item.id === key);
    const index = items.findIndex((item) => `${item.type}:${item.key}` === active);
    const approvedPages = currentProject.brandbook.sections.filter((section) => section.approved).length;
    const includedAnnexes = currentProject.brandbook.annexes.filter((annex) => annex.included && annex.content.trim()).length;
    const complete = brandbookIsComplete(currentProject.brandbook);
    if (brandTools.dialog.open) brandTools.dialog.close();
    brandTools.dialog.dataset.stage = 'brandbook';
    brandTools.dialog.querySelector('#workbench-title').textContent = copy('title');
    brandTools.dialog.querySelector('#workbench-help').textContent = copy('help');
    const content = brandTools.dialog.querySelector('#workbench-content');
    content.innerHTML = `<div class="brandbook-workspace"><aside class="book-navigation"><div class="book-progress"><div><strong>${approvedPages}/13</strong><small>${copy('approvedCount')}</small></div><div><strong>${includedAnnexes}/10</strong><small>${copy('annexCount')}</small></div></div><div><h3>${copy('core')}</h3><nav class="book-list">${items.filter((item) => item.type === 'section').map((item) => `<button type="button" class="${active === `section:${item.key}` ? 'is-active' : ''} ${item.done ? 'is-approved' : ''}" data-book-item="section:${item.key}"><span class="book-number">${item.number}</span><span>${esc(item.title)}</span><span class="book-status-dot" aria-hidden="true"></span></button>`).join('')}</nav></div><div><h3>${copy('annexes')}</h3><nav class="book-list">${items.filter((item) => item.type === 'annex').map((item) => `<button type="button" class="${active === `annex:${item.key}` ? 'is-active' : ''} ${item.done ? 'is-approved' : ''}" data-book-item="annex:${item.key}"><span class="book-number">${item.number}</span><span>${esc(item.title)}</span><span class="book-status-dot" aria-hidden="true"></span></button>`).join('')}</nav></div></aside><section class="book-editor"><header class="book-editor-header"><div><p class="eyebrow">${type === 'section' ? copy('page') : copy('annex')} ${type === 'section' ? meta.number : meta.letter}</p><h3>${esc(label(meta))}</h3><p>${copy('draftNotice')}</p></div><button id="toggle-book-preview" class="secondary-button" type="button">${copy('preview')}</button></header><form id="book-item-form"><label><span>${copy('content')}</span><textarea name="content" required>${esc(record.content)}</textarea></label>${type === 'section' ? `<label><span>${copy('sources')}</span><input type="text" name="source_refs" value="${esc((record.source_refs || []).join(', '))}" placeholder="${copy('sourceHint')}"></label><label class="book-approval"><input type="checkbox" name="approved" ${record.approved ? 'checked' : ''}><span>${copy('approved')}</span></label>` : `<label class="book-approval"><input type="checkbox" name="included" ${record.included ? 'checked' : ''}><span>${copy('included')}</span></label>`}<div class="book-notice ${complete ? 'is-complete' : ''}">${complete ? copy('complete') : copy('incomplete')}</div><div class="book-editor-actions"><div><button id="book-previous" class="secondary-button" type="button" ${index === 0 ? 'disabled' : ''}>${copy('previous')}</button><button id="book-next" class="secondary-button" type="button" ${index === items.length - 1 ? 'disabled' : ''}>${copy('next')}</button></div><button class="primary-button" type="submit">${copy('save')}</button></div></form><section id="book-preview-panel" class="book-preview-panel ${previewOpen ? '' : 'is-hidden'}"><header><strong>${copy('previewTitle')}</strong><button id="close-book-preview" class="text-button" type="button">${copy('closePreview')}</button></header><iframe class="book-preview-frame" title="${copy('previewTitle')}" sandbox="allow-same-origin"></iframe></section></section></div>`;
    content.querySelectorAll('[data-book-item]').forEach((button) => button.addEventListener('click', () => { active = button.dataset.bookItem; render(); }));
    content.querySelector('#book-previous').addEventListener('click', () => { if (index > 0) { active = `${items[index - 1].type}:${items[index - 1].key}`; render(); } });
    content.querySelector('#book-next').addEventListener('click', () => { if (index < items.length - 1) { active = `${items[index + 1].type}:${items[index + 1].key}`; render(); } });
    content.querySelector('#toggle-book-preview').addEventListener('click', () => { previewOpen = true; const panel = content.querySelector('#book-preview-panel'); panel.classList.remove('is-hidden'); panel.querySelector('iframe').srcdoc = renderBrandbookDocument(brandTools.store.getCurrent(), locale()); panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    content.querySelector('#close-book-preview').addEventListener('click', () => { previewOpen = false; content.querySelector('#book-preview-panel').classList.add('is-hidden'); });
    if (previewOpen) content.querySelector('.book-preview-frame').srcdoc = renderBrandbookDocument(currentProject, locale());
    content.querySelector('#book-item-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      if (type === 'section') {
        const patch = { content: String(data.get('content') || '').trim(), approved: data.get('approved') === 'on', source_refs: String(data.get('source_refs') || '').split(',').map((item) => item.trim()).filter(Boolean) };
        brandTools.project = brandTools.store.saveBrandbookSection(currentProject.project_id, key, patch);
        await brandTools.agentBridge?.invoke('save-brandbook-section', { project_id: currentProject.project_id, section_id: key, ...patch });
      } else {
        const patch = { content: String(data.get('content') || '').trim(), included: data.get('included') === 'on' };
        brandTools.project = brandTools.store.saveBrandbookAnnex(currentProject.project_id, key, patch);
        await brandTools.agentBridge?.invoke('save-brandbook-annex', { project_id: currentProject.project_id, annex_id: key, ...patch });
      }
      brandTools.renderChrome();
      render();
    });
    brandTools.dialog.showModal();
  }

  brandTools.openStage = (stage) => stage === 'brandbook' ? render() : originalOpenStage(stage);
  return { render };
}
