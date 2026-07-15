const axes = [
  'Source completeness', 'Business clarity', 'Audience clarity', 'Offer and conversion clarity',
  'Differentiation', 'Brand purpose and values', 'Proof and claim safety', 'Voice evidence',
  'Visual evidence', 'Logo status', 'Application requirements', 'Accessibility requirements',
  'Language and localization', 'Rights and licensing', 'Technical environment', 'Deliverable scope',
  'Approval authority', 'Production constraints', 'Repository and handoff readiness', 'Contradiction resolution'
];

const initialScores = [9, 7, 7, 6, 7, 8, 8, 7, 8, 7, 8, 8, 7, 7, 9, 8, 10, 8, 9, 7];
const axisList = document.getElementById('axisList');

axes.forEach((axis, index) => {
  const row = document.createElement('div');
  row.className = 'axis-row';
  const id = `axis-${index}`;
  row.innerHTML = `<label for="${id}">${axis}</label><input id="${id}" type="range" min="0" max="10" step="1" value="${initialScores[index]}"><span class="axis-value">${initialScores[index]}.0</span>`;
  row.querySelector('input').addEventListener('input', event => {
    row.querySelector('.axis-value').textContent = `${Number(event.target.value).toFixed(1)}`;
    updateGate();
  });
  axisList.appendChild(row);
});

function updateGate() {
  const values = [...document.querySelectorAll('.axis-row input')].map(input => Number(input.value));
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const criticalFailure = values.some(value => value < 8);
  document.getElementById('gateScore').textContent = average.toFixed(1);
  const state = document.getElementById('gateState');
  const passed = average >= 8.5 && !criticalFailure;
  state.textContent = passed ? 'Approved' : 'Blocked';
  state.className = `status ${passed ? '' : 'blocked'}`;
}
updateGate();

const sources = [
  ['Master system prompt', 'Document', 'Governing', 'Read'],
  ['KAKU brand book', 'PDF', 'Governing', 'Read visually'],
  ['Brand voice template', 'PDF', 'Governing', 'Read'],
  ['Assigned project repository', 'Git', 'Primary', 'Pending']
];
const sourceRows = document.getElementById('sourceRows');
function renderSources() {
  sourceRows.innerHTML = sources.map(source => `<tr>${source.map(value => `<td>${value}</td>`).join('')}</tr>`).join('');
}
renderSources();
document.getElementById('addSource').addEventListener('click', () => {
  sources.push(['New source', 'Unknown', 'Unclassified', 'Needs inspection']);
  renderSources();
});

const voiceSections = [
  'Who we are', 'Audience', 'Offers and calls to action', 'Voice axes', 'Never say or do',
  'Real phrases', 'Founder stories', 'Wins', 'Failures and lessons', 'Surprises',
  'Proof we can claim', 'Content pillars', 'Message hierarchy', 'Platform rules',
  'Website UX writing', 'Email rules', 'Sales rules', 'Support rules',
  'Localization and glossary', 'Claim approval controls', 'Crisis rules', 'Before and after examples', 'Voice tests'
];
document.getElementById('voiceRequirements').innerHTML = voiceSections.map(item => `<div class="requirement">${item}</div>`).join('');

const kakuSections = [
  'Cover and identity', 'Creative rationale', 'Master logo reveal', 'Symbol anatomy and meaning',
  'Logo system and uses', 'Logo in context', 'Typography', 'Color behavior',
  'Color palette and rationale', 'Primary business collateral', 'Product, service, packaging, or merchandise application',
  'Website or digital application', 'Closing, ownership, version, and credits'
];
document.getElementById('kakuSequence').innerHTML = kakuSections.map(item => `<li>${item}</li>`).join('');

document.querySelectorAll('.nav-item').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.view).classList.add('active');
  });
});

document.querySelectorAll('.mode').forEach(button => {
  button.addEventListener('click', () => button.classList.toggle('selected'));
});
