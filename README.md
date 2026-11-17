async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function renderTrendChart(trends) {
  const container = document.getElementById('trendChart');
  if (!container) return;

  const maxValue = Math.max(...trends.map((item) => item.value));
  container.innerHTML = trends
    .map(
      (item) => `
        <div class="bar" data-month="${item.month}" style="height: ${(item.value / maxValue) * 100}%"></div>
      `
    )
    .join('');
}

function renderAssets(assets) {
  const container = document.getElementById('assetsList');
  if (!container) return;

  container.innerHTML = assets
    .map((asset) => {
      const badgeClass = asset.condition === 'Critical' ? 'critical' : asset.condition === 'Watch' ? 'watch' : 'good';
      return `
        <article class="asset-card">
          <div class="topline">
            <h4>${asset.name}</h4>
            <span class="badge ${badgeClass}">${asset.condition}</span>
          </div>
          <p class="asset-meta">${asset.id} • ${asset.type}</p>
          <p class="asset-meta">Location: ${asset.location}</p>
          <p class="asset-meta">Last service: ${asset.lastService}</p>
          <div class="uptime">
            <span>Availability</span>
            <strong>${asset.availability}%</strong>
          </div>
          <div class="progress">
            <span style="width:${asset.availability}%"></span>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderWorkOrders(workOrders) {
  const container = document.getElementById('workOrdersTable');
  if (!container) return;

  container.innerHTML = workOrders
    .map(
      (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.assetId}</td>
          <td>${item.title}</td>
          <td><span class="priority-pill ${item.priority.toLowerCase()}">${item.priority}</span></td>
          <td><span class="status-pill ${item.status.toLowerCase().replace(/\s+/g, '-')}">${item.status}</span></td>
          <td>${item.technician}</td>
          <td>${item.dueDate}</td>
        </tr>
      `
    )
    .join('');
}

function renderSchedule(schedule) {
  const container = document.getElementById('scheduleTable');
  if (!container) return;

  container.innerHTML = schedule
    .map(
      (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.assetId}</td>
          <td>${item.task}</td>
          <td>${item.frequency}</td>
          <td>${item.nextDue}</td>
          <td>${item.owner}</td>
        </tr>
      `
    )
    .join('');
}

function renderSummary(summary) {
  document.getElementById('openWorkOrders').textContent = summary.openWorkOrders;
  document.getElementById('criticalIssues').textContent = summary.critical;
  document.getElementById('complianceRate').textContent = `${summary.compliance}%`;
  document.getElementById('uptimeRate').textContent = `${summary.uptime}%`;
}

async function loadDashboard() {
  try {
    const overview = await fetchJson('/api/overview');
    const assets = await fetchJson('/api/assets');
    const workOrders = await fetchJson('/api/work-orders');
    const schedule = await fetchJson('/api/schedule');

    renderSummary(overview.summary);
    renderTrendChart(overview.trends);
    renderAssets(assets);
    renderWorkOrders(workOrders);
    renderSchedule(schedule);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  const payload = {
    title: formData.get('title'),
    assetId: formData.get('assetId'),
    priority: formData.get('priority'),
    status: formData.get('status'),
    technician: formData.get('technician'),
    dueDate: formData.get('dueDate')
  };

  try {
    await fetchJson('/api/work-orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    form.reset();
    await loadDashboard();
  } catch (error) {
    console.error('Failed to create work order:', error);
    alert('Unable to create the work order. Please review the form and try again.');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  document.getElementById('workOrderForm').addEventListener('submit', handleFormSubmit);
});
