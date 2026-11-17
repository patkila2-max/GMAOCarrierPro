function buildOperationsReport(store, now = new Date()) {
  const assets = store.assets || [];
  const workOrders = store.workOrders || [];
  const inventory = store.inventory || [];
  const schedule = store.schedule || [];

  const criticalAssets = assets.filter((asset) => asset.condition === 'Critical');
  const lowInventory = inventory.filter((item) => String(item.status || '').toLowerCase() === 'low');
  const overdueWorkOrders = workOrders.filter((order) => {
    if (order.status === 'Closed' || !order.dueDate) return false;
    const dueDate = new Date(`${order.dueDate}T00:00:00`);
    return !Number.isNaN(dueDate.getTime()) && dueDate < now;
  });

  const alerts = [
    ...criticalAssets.map((asset) => ({
      type: 'Critical asset',
      title: `${asset.name} (${asset.id})`,
      severity: 'High',
      detail: 'Asset condition is flagged critical and requires immediate review.'
    })),
    ...lowInventory.map((item) => ({
      type: 'Inventory risk',
      title: `${item.name} (${item.sku})`,
      severity: 'Medium',
      detail: `Only ${item.quantity} units remain in ${item.location}.`
    })),
    ...overdueWorkOrders.map((order) => ({
      type: 'Overdue work order',
      title: `${order.title} (${order.id})`,
      severity: order.priority === 'Critical' ? 'High' : 'Medium',
      detail: `Due ${order.dueDate}. Assigned to ${order.technician || 'unassigned'}.`
    }))
  ];

  return {
    generatedAt: now.toISOString(),
    summary: {
      totalAssets: assets.length,
      openWorkOrders: workOrders.filter((order) => order.status !== 'Closed').length,
      criticalIssues: criticalAssets.length,
      lowInventory: lowInventory.length,
      overdueWorkOrders: overdueWorkOrders.length,
      scheduledPm: schedule.length
    },
    byStatus: ['Open', 'In Progress', 'Closed'].map((status) => ({
      status,
      count: workOrders.filter((order) => order.status === status).length
    })),
    alerts,
    upcomingMaintenance: schedule.slice(0, 4).map((item) => ({
      id: item.id,
      asset: item.assetId,
      task: item.task,
      due: item.nextDue,
      owner: item.owner
    }))
  };
}

module.exports = { buildOperationsReport };
