const express = require('express');
const fs = require('fs');
const path = require('path');
const { buildOperationsReport } = require('./reports');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

const fallbackStore = {
  assets: [
    { id: 'AST-101', name: 'Boiler B-17', condition: 'Good', availability: 96 },
    { id: 'AST-207', name: 'Air Compressor C-3', condition: 'Watch', availability: 88 },
    { id: 'AST-304', name: 'Cooling Tower CT-9', condition: 'Good', availability: 94 },
    { id: 'AST-412', name: 'Generator G-2', condition: 'Critical', availability: 71 }
  ],
  workOrders: [
    { id: 'WO-2047', assetId: 'AST-101', title: 'Inspect pressure relief valve', priority: 'High', status: 'Open', dueDate: '2026-11-22', technician: 'R. Silva' },
    { id: 'WO-2048', assetId: 'AST-207', title: 'Replace drive belt and verify alignment', priority: 'Medium', status: 'In Progress', dueDate: '2026-11-25', technician: 'J. Patel' },
    { id: 'WO-2049', assetId: 'AST-412', title: 'Complete emergency generator load test', priority: 'Critical', status: 'Open', dueDate: '2026-11-18', technician: 'M. Gomez' }
  ],
  inventory: [
    { id: 'INV-1001', name: 'Valve gasket kit', sku: 'VG-44', quantity: 14, location: 'Spare Bay A', status: 'Ready' },
    { id: 'INV-1002', name: 'Drive belt set', sku: 'DB-120', quantity: 6, location: 'Tool Room', status: 'Low' }
  ],
  schedule: [
    { id: 'PM-5002', assetId: 'AST-304', task: 'Cooling tower cleaning', frequency: 'Monthly', nextDue: '2026-11-25', owner: 'Facilities' },
    { id: 'PM-5003', assetId: 'AST-101', task: 'Pressure vessel inspection', frequency: 'Quarterly', nextDue: '2026-11-29', owner: 'Safety' }
  ]
};

function readStore() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  } catch (error) {
    console.warn(`Using report fallback data: ${error.message}`);
  }
  return fallbackStore;
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'GMAO Carrier Pro' });
});

app.get('/api/reports', (req, res) => {
  res.json(buildOperationsReport(readStore()));
});

app.listen(PORT, () => {
  console.log(`GMAO Carrier Pro running on http://localhost:${PORT}`);
});
