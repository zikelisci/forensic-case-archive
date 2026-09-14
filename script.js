const tabs = [...document.querySelectorAll('.nav-tab')];
const panels = [...document.querySelectorAll('.panel')];

function showPanel(id) {
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.panel === id));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === id));
  const target = document.getElementById(id);
  target?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabs.forEach((tab) => tab.addEventListener('click', () => showPanel(tab.dataset.panel)));
document.querySelectorAll('.next-button').forEach((button) => button.addEventListener('click', () => showPanel(button.dataset.next)));

document.querySelectorAll('.hotspot').forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById('clue-placeholder').hidden = true;
    document.querySelectorAll('.clue-detail').forEach((detail) => { detail.hidden = detail.id !== button.dataset.clue; });
    button.classList.add('seen');
  });
});

document.querySelectorAll('.flip-card').forEach((card) => {
  const flip = () => {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(isFlipped));
  };
  card.addEventListener('click', flip);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      flip();
    }
  });
});

const evidenceItems = ['E-01 · Footwear impression', 'E-02 · Charred fire debris', 'E-03 · Extension cord', 'E-04 · Disposable lighter', 'E-05 · Stadium image', 'E-06 · Damage estimate', 'E-07 · Solvent inventory', 'E-08 · Console activity log', 'E-09 · “Burn it down” flyer', 'E-10 · Phone message'];
const ratings = ['Strong', 'Limited', 'Reject'];
const ratingGrid = document.getElementById('rating-grid');
evidenceItems.forEach((item, index) => {
  const row = document.createElement('div');
  row.className = 'rating-row';
  const title = document.createElement('strong');
  title.textContent = item;
  row.appendChild(title);
  ratings.forEach((rating) => {
    const label = document.createElement('label');
    label.className = 'rating-choice';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `rating_${index + 1}`;
    radio.value = rating;
    label.append(radio, rating);
    row.appendChild(label);
  });
  ratingGrid.appendChild(row);
});

const form = document.getElementById('case-form');
const saveStatus = document.getElementById('save-status');
const caseId = document.body.dataset.caseId || 'case';
const storageKey = `forensic-${caseId}-report-v4`;

function serializeForm() {
  return Object.fromEntries(new FormData(form).entries());
}

function saveForm() {
  localStorage.setItem(storageKey, JSON.stringify(serializeForm()));
  saveStatus.textContent = 'Saved locally';
}

function restoreForm() {
  try {
    const values = JSON.parse(localStorage.getItem(storageKey) || '{}');
    Object.entries(values).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (!field) return;
      if (field instanceof RadioNodeList) {
        [...field].forEach((choice) => { choice.checked = choice.value === value; });
      } else {
        field.value = value;
      }
    });
  } catch (error) {
    localStorage.removeItem(storageKey);
  }
}

form.addEventListener('input', () => {
  saveStatus.textContent = 'Saving…';
  window.clearTimeout(window.caseSaveTimer);
  window.caseSaveTimer = window.setTimeout(saveForm, 250);
});

document.getElementById('print-report').addEventListener('click', () => window.print());
const dialog = document.getElementById('confirm-dialog');
document.getElementById('clear-report').addEventListener('click', () => dialog.showModal());
dialog.addEventListener('close', () => {
  if (dialog.returnValue === 'confirm') {
    form.reset();
    localStorage.removeItem(storageKey);
    saveStatus.textContent = 'Report cleared';
  }
});

restoreForm();
