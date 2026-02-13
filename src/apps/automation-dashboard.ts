export function automationDashboardApp() {
  return {
    name: 'automation-dashboard',
    description: 'Marketing automation workflows dashboard with performance tracking',
    ui: {
      title: 'Automation Dashboard',
      content: `
# Marketing Automation

<div class="automation-stats">
  <div class="auto-stat">
    <h3>Active Workflows</h3>
    <div class="auto-number">{{activeWorkflows}}</div>
  </div>
  <div class="auto-stat">
    <h3>Total Sent</h3>
    <div class="auto-number">{{totalSent}}</div>
  </div>
  <div class="auto-stat">
    <h3>Conversion Rate</h3>
    <div class="auto-number">{{conversionRate}}%</div>
  </div>
  <div class="auto-stat">
    <h3>Revenue</h3>
    <div class="auto-number">\${{totalRevenue}}</div>
  </div>
</div>

## Workflows
{{#each workflows}}
<div class="workflow-card">
  <div class="workflow-header">
    <h4>{{this.name}}</h4>
    <div class="workflow-status">
      <span class="status-indicator status-{{this.status}}"></span>
      {{this.status}}
    </div>
  </div>
  
  <div class="workflow-stats-grid">
    <div class="workflow-stat">
      <div class="stat-label">Sent</div>
      <div class="stat-value">{{this.stats.sent}}</div>
    </div>
    <div class="workflow-stat">
      <div class="stat-label">Opened</div>
      <div class="stat-value">{{this.stats.opened}}</div>
    </div>
    <div class="workflow-stat">
      <div class="stat-label">Clicked</div>
      <div class="stat-value">{{this.stats.clicked}}</div>
    </div>
    <div class="workflow-stat">
      <div class="stat-label">Goals</div>
      <div class="stat-value">{{this.stats.goal}}</div>
    </div>
  </div>
  
  <div class="workflow-actions">
    <button class="btn-small">View Details</button>
    {{#if this.isActive}}
    <button class="btn-small btn-warning">Pause</button>
    {{else}}
    <button class="btn-small btn-success">Activate</button>
    {{/if}}
  </div>
</div>
{{/each}}

## Quick Actions
- [Create Workflow](#new-workflow)
- [View Reports](#workflow-reports)
- [Manage Triggers](#triggers)
`,
      style: `
        .automation-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .auto-stat { padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; }
        .auto-number { font-size: 32px; font-weight: bold; color: #007bff; margin-top: 10px; }
        .workflow-card { padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 20px; }
        .workflow-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .workflow-status { display: flex; align-items: center; gap: 8px; }
        .status-indicator { width: 10px; height: 10px; border-radius: 50%; }
        .status-active { background: #28a745; }
        .status-inactive { background: #dc3545; }
        .status-draft { background: #ffc107; }
        .workflow-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px; }
        .workflow-stat { text-align: center; padding: 10px; background: #f8f9fa; border-radius: 4px; }
        .stat-label { font-size: 12px; color: #666; }
        .stat-value { font-size: 20px; font-weight: bold; margin-top: 5px; }
        .workflow-actions { display: flex; gap: 10px; }
        .btn-small { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; background: #007bff; color: white; }
        .btn-warning { background: #ffc107; color: black; }
        .btn-success { background: #28a745; }
      `,
    },
  };
}
