async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Request failed: ${response.status}`);
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
  const filterValue = (document.getElementById('assetFilter')?.value || '').trim().toLowerCase();
  const typeValue = (document.getElementById('assetTypeFilter')?.value || '').trim();
  const container = document.getElementById('assetsList');
  if (!container) return;

  const filtered = assets.filter((asset) => {
    const matchesText = !filterValue || [asset.name, asset.id, asset.location, asset.type].some((value) => String(value).toLowerCase().includes(filterValue));
    const matchesType = !typeValue || asset.type === typeValue;
    return matchesText && matchesType;
  });

  if (!filtered.length) {
    container.innerHTML = '<p class="empty-state">No assets match the current filters.</p>';
    return;
  }

  container.innerHTML = filtered
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
  const statusFilter = (document.getElementById('workOrderStatusFilter')?.value || '').trim();
  const priorityFilter = (document.getElementById('workOrderPriorityFilter')?.value || '').trim();
  const container = document.getElementById('workOrdersTable');
  if (!container) return;

  const filtered = workOrders.filter((item) => {
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  if (!filtered.length) {
    container.innerHTML = '<tr><td colspan="8">No work orders match the selected filters.</td></tr>';
    return;
  }

  container.innerHTML = filtered
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
          <td><button class="action-btn danger" data-work-order-id="${item.id}" type="button">Close</button></td>
        </tr>
      `
    )
    .join('');

  document.querySelectorAll('[data-work-order-id]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-work-order-id');
      try {
        await fetchJson(`/api/work-orders/${id}`, { method: 'DELETE' });
        await loadDashboard();
      } catch (error) {
        console.error('Failed to close work order:', error);
      }
    });
  });
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

async function handleAssetSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  const payload = {
    name: formData.get('name'),
    type: formData.get('type'),
    location: formData.get('location'),
    condition: formData.get('condition'),
    availability: Number(formData.get('availability') || 90)
  };

  try {
    await fetchJson('/api/assets', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    form.reset();
    document.getElementById('assetTypeFilter').value = '';
    await loadDashboard();
  } catch (error) {
    console.error('Failed to create asset:', error);
    alert('Unable to create the asset. Please check the required fields.');
  }
}

async function handleWorkOrderSubmit(event) {
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
  document.getElementById('refreshBtn').addEventListener('click', loadDashboard);
  document.getElementById('assetFilter').addEventListener('input', () => loadDashboard());
  document.getElementById('assetTypeFilter').addEventListener('change', () => loadDashboard());
  document.getElementById('workOrderStatusFilter').addEventListener('change', () => loadDashboard());
  document.getElementById('workOrderPriorityFilter').addEventListener('change', () => loadDashboard());
  document.getElementById('assetForm').addEventListener('submit', handleAssetSubmit);
  document.getElementById('workOrderForm').addEventListener('submit', handleWorkOrderSubmit);
  loadDashboard();
});
