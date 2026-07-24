import { GUARDIAN_DEFINITIONS, GUARDIAN_ORDER, guardianGate, releaseGate } from './guardian-export-domain.js';
import { guardianExportCopy as copy } from './guardian-export-copy.js';
import { buildExportPackage } from './export-package.js';

function esc(value) { return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }
function locale() { return document.documentElement.dataset.locale === 'es-MX' ? 'es-MX' : 'en'; }
function guardianName(name) { return locale() === 'es-MX' ? GUARDIAN_DEFINITIONS[name].es : GUARDIAN_DEFINITIONS[name].en; }
function guardianDescription(name) { return locale() === 'es-MX' ? GUARDIAN_DEFINITIONS[name].descriptionEs : GUARDIAN_DEFINITIONS[name].descriptionEn; }
function checkLabel(check) { return locale() === 'es-MX' ? check[2] : check[1]; }
function statusLabel(status) { return copy(status === 'passed' ? 'passed' : status === 'failed' ? 'failed' : 'pending'); }

function findingRow(finding = {}, index = 0) {
  const severity = finding.severity || 'P2';
  return `<tr data-finding-row class="severity-${severity.toLowerCase()}"><td><select name="finding_severity_${index}" aria-label="${copy('severity')} ${index + 1}"><option value="P0" ${severity === 'P0' ? 'selected' : ''}>P0</option><option value="P1" ${severity === 'P1' ? 'selected' : ''}>P1</option><option value="P2" ${severity === 'P2' ? 'selected' : ''}>P2</option></select></td><td><textarea name="finding_title_${index}" aria-label="${copy('findingTitle')} ${index + 1}">${esc(finding.title)}</textarea></td><td><textarea name="finding_evidence_${index}" aria-label="${copy('evidence')} ${index + 1}">${esc(finding.evidence)}</textarea></td><td><textarea name="finding_recommendation_${index}" aria-label="${copy('recommendation')} ${index + 1}">${esc(finding.recommendation)}</textarea></td><td><label class="guardian-check"><input type="checkbox" name="finding_resolved_${index}" ${finding.resolved ? 'checked' : ''}><span>${copy('resolved')}</span></label><textarea name="finding_resolution_${index}" aria-label="${copy('resolution')} ${index + 1}">${esc(finding.resolution_note)}</textarea></td><td><button type="button" class="text-button" data-remove-finding data-help="removeFinding" title="${copy('remove')}" aria-label="${copy('remove')}">${copy('remove')}</button></td></tr>`;
}

function guardianPayload(form, name) {
  const data = new FormData(form);
  const checks = Object.fromEntries(GUARDIAN_DEFINITIONS[name].checks.map(([id]) => [id, data.get(`check_${id}`) === 'on']));
  const findings = [...form.querySelectorAll('[data-finding-row]')].map((row, index) => ({
    finding_id: row.dataset.findingId || `finding-${Date.now().toString(36)}-${index}`,
    severity: row.querySelector(`[name="finding_severity_${index}"]`)?.value || row.querySelector('select[name^="finding_severity_"]').value,
    title: row.querySelector('textarea[name^="finding_title_"]').value.trim(),
    evidence: row.querySelector('textarea[name^="finding_evidence_"]').value.trim(),
    recommendation: row.querySelector('textarea[name^="finding_recommendation_"]').value.trim(),
    resolved: row.querySelector('input[name^="finding_resolved_"]').checked,
    resolution_note: row.querySelector('textarea[name^="finding_resolution_"]').value.trim()
  })).filter((finding) => finding.title || finding.evidence || finding.recommendation);
  return {
    name,
    reviewer_name: String(data.get('reviewer_name') || '').trim(),
    reviewer_role: String(data.get('reviewer_role') || '').trim(),
    independent_confirmed: data.get('independent_confirmed') === 'on',
    summary: String(data.get('summary') || '').trim(),
    checks,
    findings
  };
}

function downloadBytes(bytes, filename, type) {
  const blob = new Blob([bytes], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function installGuardianExportTools(brandTools) {
  const originalOpenStage = brandTools.openStage.bind(brandTools);
  let activeGuardian = 'brand';
  let approvalMessage = '';
  let packageCache = null;

  function prepare(stage, title, help) {
    if (brandTools.dialog.open) brandTools.dialog.close();
    brandTools.dialog.dataset.stage = stage;
    brandTools.dialog.querySelector('#workbench-title').textContent = title;
    brandTools.dialog.querySelector('#workbench-help').textContent = help;
    brandTools.dialog.showModal();
    return brandTools.dialog.querySelector('#workbench-content');
  }

  function bindFindingRows(container) {
    container.querySelectorAll('[data-finding-row]').forEach((row) => {
      const select = row.querySelector('select[name^="finding_severity_"]');
      select.addEventListener('change', () => {
        row.classList.remove('severity-p0', 'severity-p1', 'severity-p2');
        row.classList.add(`severity-${select.value.toLowerCase()}`);
      });
      row.querySelector('[data-remove-finding]').addEventListener('click', () => row.remove());
    });
  }

  function renderGuardian() {
    const project = brandTools.store.getCurrent();
    if (!['active', 'complete'].includes(project.stages.guardian.status)) return originalOpenStage('guardian');
    const gate = guardianGate(project);
    if (!GUARDIAN_ORDER.includes(activeGuardian)) activeGuardian = gate.failing_guardians[0] || 'brand';
    const review = project.guardians[activeGuardian];
    const definition = GUARDIAN_DEFINITIONS[activeGuardian];
    const content = prepare('guardian', copy('guardianTitle'), copy('guardianHelp'));
    const findings = review.findings.length ? review.findings : [];
    content.innerHTML = `<div class="guardian-workspace"><aside class="guardian-nav"><div class="guardian-scoreboard"><div><strong>${GUARDIAN_ORDER.filter((name) => project.guardians[name].status === 'passed').length}/4</strong><small>${copy('passed')}</small></div><div><strong>${gate.p0}</strong><small>${copy('p0')}</small></div><div><strong>${gate.unresolved_p1}</strong><small>${copy('p1')}</small></div></div>${GUARDIAN_ORDER.map((name) => `<button type="button" class="${name === activeGuardian ? 'is-active' : ''} is-${project.guardians[name].status}" data-guardian="${name}" data-help="selectGuardian" aria-label="${guardianName(name)}: ${statusLabel(project.guardians[name].status)}"><span><strong>${guardianName(name)}</strong><small>${guardianDescription(name)}</small></span><span>${statusLabel(project.guardians[name].status)}</span></button>`).join('')}</aside><form id="guardian-form" class="guardian-form"><section class="guardian-section"><header><div><h3>${guardianName(activeGuardian)}</h3><p>${guardianDescription(activeGuardian)}</p></div></header><div class="guardian-reviewer-grid"><label><span>${copy('reviewer')}</span><input name="reviewer_name" value="${esc(review.reviewer_name)}" required></label><label><span>${copy('role')}</span><input name="reviewer_role" value="${esc(review.reviewer_role)}" required></label><label class="guardian-independence wide"><input type="checkbox" name="independent_confirmed" ${review.independent_confirmed ? 'checked' : ''}><span>${copy('independent')}</span></label><label class="wide"><span>${copy('summary')}</span><textarea name="summary" rows="4" required>${esc(review.summary)}</textarea></label></div><p class="release-note">${copy('cooperative')}</p></section><section class="guardian-section"><header><div><h3>${copy('checks')}</h3></div></header><div class="guardian-check-list">${definition.checks.map((check) => `<label class="guardian-check"><input type="checkbox" name="check_${check[0]}" ${review.checks[check[0]] ? 'checked' : ''}><span>${esc(checkLabel(check))}</span></label>`).join('')}</div></section><section class="guardian-section"><header><div><h3>${copy('findings')}</h3></div><button id="add-finding" class="secondary-button" type="button" data-help="addGuardianFinding" aria-label="${copy('addFinding')}">${copy('addFinding')}</button></header><div class="table-wrap"><table class="findings-table"><thead><tr><th>${copy('severity')}</th><th>${copy('findingTitle')}</th><th>${copy('evidence')}</th><th>${copy('recommendation')}</th><th>${copy('resolution')}</th><th></th></tr></thead><tbody id="finding-rows">${findings.map((finding, index) => findingRow(finding, index)).join('')}</tbody></table></div></section><div class="release-note ${gate.passed ? 'is-ready' : ''}">${gate.passed ? copy('complete') : copy('incomplete')}</div><footer class="form-footer"><span>${statusLabel(review.status)}</span><button class="primary-button" type="submit" data-help="saveGuardianReview" aria-label="${copy('saveReview')}">${copy('saveReview')}</button></footer></form></div>`;
    content.querySelectorAll('[data-guardian]').forEach((button) => button.addEventListener('click', () => { activeGuardian = button.dataset.guardian; renderGuardian(); }));
    const rows = content.querySelector('#finding-rows');
    bindFindingRows(rows);
    content.querySelector('#add-finding').addEventListener('click', () => {
      rows.insertAdjacentHTML('beforeend', findingRow({}, rows.children.length));
      bindFindingRows(rows);
      rows.lastElementChild.querySelector('textarea').focus();
    });
    content.querySelector('#guardian-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = guardianPayload(event.currentTarget, activeGuardian);
      brandTools.project = brandTools.store.saveGuardian(project.project_id, activeGuardian, payload);
      await brandTools.agentBridge?.invoke('save-guardian-review', { project_id: project.project_id, guardian: activeGuardian, review: brandTools.project.guardians[activeGuardian] });
      brandTools.renderChrome();
      const next = GUARDIAN_ORDER.find((name) => brandTools.project.guardians[name].status !== 'passed');
      if (next) activeGuardian = next;
      renderGuardian();
    });
  }

  function expectedFiles() {
    return ['brandbook.html', 'brandbook-print.css', 'design-tokens.json', 'design-tokens.css', 'brand-strategy.json', 'brand-voice.json', 'visual-system.json', 'source-ledger.json', 'claims-ledger.json', 'guardian-report.json', 'asset-manifest.json', 'handoff.json', 'README.md', 'package-manifest.json'];
  }

  function renderExport() {
    const project = brandTools.store.getCurrent();
    if (!['active', 'complete'].includes(project.stages.export.status)) return originalOpenStage('export');
    const gate = releaseGate(project);
    const content = prepare('export', copy('exportTitle'), copy('exportHelp'));
    const command = `node bin/brand-kit-builder.mjs approve \\\n  --workspace ./workspace \\\n  --project-id ${project.project_id} \\\n  --action export`;
    const approvalText = gate.approval ? `${copy('approvalFound')} ${project.export_approval.approved_by} · ${project.export_approval.approved_at}` : (approvalMessage || copy('approvalMissing'));
    content.innerHTML = `<section class="guardian-section"><div class="release-gate-summary"><article class="release-gate-card ${gate.guardian.passed ? 'is-ready' : ''}"><strong>${copy('guardianGate')}</strong><small>${gate.guardian.passed ? copy('ready') : `${copy('blocked')}: ${gate.guardian.failing_guardians.map(guardianName).join(', ')}`}</small></article><article class="release-gate-card ${gate.approval ? 'is-ready' : ''}"><strong>${copy('approvalGate')}</strong><small>${approvalText}</small></article></div></section><section class="guardian-section"><header><div><h3>${copy('terminalTitle')}</h3><p>${copy('terminalHelp')}</p></div></header><code class="approval-command">${esc(command)}</code><div class="export-actions"><button id="check-export-approval" class="secondary-button" type="button" data-help="checkExportApproval" aria-label="${copy('checkApproval')}">${copy('checkApproval')}</button><button id="download-approved-package" class="primary-button" type="button" data-help="downloadExportPackage" aria-label="${copy('downloadZip')}" ${gate.passed ? '' : 'disabled'}>${copy('downloadZip')}</button></div><p class="release-note">${copy('pdfNote')}</p></section><section class="guardian-section"><header><div><h3>${copy('files')}</h3></div></header><div class="export-file-list">${expectedFiles().map((path) => `<div class="export-file"><span><strong>${path}</strong><small>${packageCache?.files?.find((file) => file.path === path)?.sha256 || (gate.passed ? copy('ready') : copy('blocked'))}</small></span><span>${packageCache?.files?.find((file) => file.path === path)?.bytes_length?.toLocaleString(locale()) || '—'} ${copy('bytes')}</span></div>`).join('')}</div></section><div class="release-note ${gate.passed ? 'is-ready' : ''}">${project.export_package?.generated_at ? `${copy('exported')}: ${project.export_package.generated_at}` : (gate.passed ? copy('ready') : copy('blocked'))}</div>`;
    content.querySelector('#check-export-approval').addEventListener('click', async () => {
      const button = content.querySelector('#check-export-approval');
      button.disabled = true;
      const result = await brandTools.agentBridge?.invoke('inspect-export-approval', { project_id: project.project_id, action: 'export' });
      if (result?.approval?.status === 'approved' && result.approval.source === 'agent-core') {
        try {
          brandTools.project = brandTools.store.syncExportApproval(project.project_id, result.approval);
          approvalMessage = copy('approvalFound');
        } catch (error) {
          approvalMessage = error.message;
        }
      } else {
        approvalMessage = result?.demo ? copy('demoApproval') : copy('approvalMissing');
      }
      brandTools.renderChrome();
      renderExport();
    });
    content.querySelector('#download-approved-package').addEventListener('click', async () => {
      const button = content.querySelector('#download-approved-package');
      button.disabled = true;
      button.textContent = `${copy('downloadZip')}…`;
      try {
        packageCache = await buildExportPackage(brandTools.store.getCurrent(), locale());
        downloadBytes(packageCache.zip_bytes, `${packageCache.package_name}.zip`, 'application/zip');
        brandTools.project = brandTools.store.markExported(project.project_id, packageCache.manifest);
        await brandTools.agentBridge?.invoke('record-export-package', { project_id: project.project_id, manifest: packageCache.manifest });
        brandTools.renderChrome();
        renderExport();
      } catch (error) {
        approvalMessage = error.message;
        renderExport();
      }
    });
  }

  brandTools.openStage = (stage) => {
    if (stage === 'guardian') return renderGuardian();
    if (stage === 'export') return renderExport();
    return originalOpenStage(stage);
  };

  return { renderGuardian, renderExport };
}
