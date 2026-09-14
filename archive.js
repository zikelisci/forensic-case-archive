const cases = window.FORENSIC_CASES || [];
const caseGrid = document.getElementById('case-grid');
document.getElementById('open-case-count').textContent = String(cases.filter((item) => item.status === 'Active').length);

cases.forEach((item) => {
  const file = document.createElement('article');
  file.className = 'archive-file';
  file.innerHTML = `
    <div class="file-edge" aria-hidden="true"></div>
    <div class="file-meta"><span>CASE ${item.number}</span><span class="file-status">${item.status}</span></div>
    <h3>${item.title}</h3>
    <p class="file-type">${item.type}</p>
    <dl>
      <div><dt>Focus</dt><dd>${item.focus}</dd></div>
      <div><dt>Estimated time</dt><dd>${item.time}</dd></div>
    </dl>
    <a class="primary-button file-link" href="${item.href}">Open case file <span aria-hidden="true">→</span></a>
  `;
  caseGrid.appendChild(file);
});

if (!cases.length) caseGrid.innerHTML = '<p class="empty-archive">No case files are currently assigned.</p>';
