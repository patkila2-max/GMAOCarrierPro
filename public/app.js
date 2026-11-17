:root {
  --bg: #f4f7fb;
  --panel: #ffffff;
  --panel-alt: #edf3ff;
  --primary: #1e4fd8;
  --primary-dark: #1639a7;
  --text: #122033;
  --muted: #5e7089;
  --success: #17a673;
  --warning: #f0ad4e;
  --danger: #d94b4b;
  --border: #dfe8f6;
  --shadow: 0 10px 30px rgba(18, 32, 51, 0.08);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: Inter, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--text);
}

button,
input,
select {
  font: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #0c1732, #111d38);
  color: white;
  padding: 32px 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
}

.brand-badge {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.12);
  font-size: 1.3rem;
  font-weight: 700;
}

.brand h1 {
  margin: 0;
  font-size: 1.2rem;
}

.eyebrow {
  margin: 0 0 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 12px 14px;
  border-radius: 10px;
  transition: 0.2s ease;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(255, 255, 255, 0.09);
  color: #fff;
}

.main-content {
  padding: 28px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.topbar h2 {
  margin: 0;
  font-size: clamp(1.7rem, 2vw, 2.2rem);
}

.primary-btn {
  background: var(--primary);
  border: none;
  color: #fff;
  border-radius: 10px;
  padding: 12px 18px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow);
}

.primary-btn:hover {
  background: var(--primary-dark);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 20px 18px;
  border-radius: 18px;
  box-shadow: var(--shadow);
}

.stat-card strong {
  display: block;
  font-size: 2rem;
  margin: 10px 0 8px;
}

.stat-card small,
.stat-label {
  color: var(--muted);
}

.stat-card.accent {
  background: linear-gradient(135deg, #eef4ff, #dfeaff);
}

.stat-card.success {
  background: linear-gradient(135deg, #ebfff7, #d8f9eb);
}

.stat-card.warning {
  background: linear-gradient(135deg, #fff5e3, #ffe7b5);
}

.panel,
.panel-chart {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 20px;
  margin-bottom: 24px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  min-height: 150px;
  padding-top: 12px;
}

.bar {
  flex: 1;
  background: linear-gradient(180deg, #8eb0ff, var(--primary));
  border-radius: 10px 10px 0 0;
  position: relative;
  min-height: 20px;
}

.bar::after {
  content: attr(data-month);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -24px;
  font-size: 0.7rem;
  color: var(--muted);
}

.asset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.asset-card {
  border: 1px solid var(--border);
  background: #f8fbff;
  border-radius: 12px;
  padding: 16px;
}

.asset-card .topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.asset-card h4 {
  margin: 0;
  font-size: 1rem;
}

.badge {
  border-radius: 999px;
  font-size: 0.72rem;
  padding: 5px 8px;
  font-weight: 600;
}

.badge.good {
  background: #e2faf0;
  color: var(--success);
}

.badge.watch {
  background: #fff1d8;
  color: #b67c00;
}

.badge.critical {
  background: #ffe7e7;
  color: var(--danger);
}

.asset-meta {
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 0.9rem;
}

.asset-card .uptime {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  color: var(--muted);
}

.progress {
  height: 8px;
  background: #eaf1ff;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 6px;
}

.progress > span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #63d3a6, var(--success));
}

.split-panel {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr;
  gap: 18px;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid var(--border);
  font-size: 0.92rem;
}

th {
  color: var(--muted);
  font-weight: 700;
  background: #f9fbff;
}

.priority-pill,
.status-pill {
  display: inline-block;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.72rem;
  font-weight: 700;
}

.priority-pill.high,
.priority-pill.critical {
  background: #ffe8e8;
  color: var(--danger);
}

.priority-pill.medium {
  background: #fff1d8;
  color: #b67c00;
}

.priority-pill.low {
  background: #e4f9ee;
  color: var(--success);
}

.status-pill.open,
.status-pill.in-progress {
  background: #dfeaff;
  color: var(--primary);
}

.status-pill.closed {
  background: #e3f5eb;
  color: var(--success);
}

.mini-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f7faff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.mini-form h4 {
  margin: 0 0 4px;
}

.mini-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--muted);
  font-size: 0.85rem;
}

.mini-form input,
.mini-form select {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
}

@media (max-width: 980px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    padding-bottom: 18px;
  }

  .nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .dashboard-grid {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  .split-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .main-content {
    padding: 18px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
