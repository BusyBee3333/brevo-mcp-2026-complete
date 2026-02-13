export function smsDashboardApp() {
  return {
    name: 'sms-dashboard',
    description: 'SMS campaign management dashboard with delivery tracking and analytics',
    ui: {
      title: 'SMS Dashboard',
      content: `
# SMS Campaigns

<div class="sms-overview">
  <div class="sms-metric">
    <div class="metric-icon">📱</div>
    <div class="metric-content">
      <div class="metric-value">{{totalSms}}</div>
      <div class="metric-label">Total SMS Sent</div>
    </div>
  </div>
  
  <div class="sms-metric">
    <div class="metric-icon">✅</div>
    <div class="metric-content">
      <div class="metric-value">{{deliveryRate}}%</div>
      <div class="metric-label">Delivery Rate</div>
    </div>
  </div>
  
  <div class="sms-metric">
    <div class="metric-icon">🔗</div>
    <div class="metric-content">
      <div class="metric-value">{{clickRate}}%</div>
      <div class="metric-label">Click Rate</div>
    </div>
  </div>
  
  <div class="sms-metric">
    <div class="metric-icon">💰</div>
    <div class="metric-content">
      <div class="metric-value">\${{costThisMonth}}</div>
      <div class="metric-label">Cost This Month</div>
    </div>
  </div>
</div>

## SMS Campaigns
{{#each campaigns}}
<div class="sms-campaign-card">
  <div class="campaign-header-row">
    <div>
      <h4>{{this.name}}</h4>
      <div class="campaign-sender">From: {{this.sender}}</div>
    </div>
    <span class="status-badge status-{{this.status}}">{{this.status}}</span>
  </div>
  
  <div class="campaign-content">{{this.content}}</div>
  
  <div class="campaign-stats-row">
    <div class="stat-item">
      <span class="stat-label">Recipients:</span>
      <span class="stat-value">{{this.stats.recipients}}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Delivered:</span>
      <span class="stat-value">{{this.stats.delivered}}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Clicked:</span>
      <span class="stat-value">{{this.stats.clicked}}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Failed:</span>
      <span class="stat-value">{{this.stats.failed}}</span>
    </div>
  </div>
  
  <div class="campaign-footer">
    <span class="campaign-date">{{this.scheduledAt}}</span>
    <div class="campaign-actions">
      <button class="btn-sm">View Report</button>
      {{#if this.isDraft}}
      <button class="btn-sm btn-primary">Send Now</button>
      {{/if}}
    </div>
  </div>
</div>
{{/each}}

## Quick Actions
- [Create SMS Campaign](#new-sms)
- [View All Reports](#sms-reports)
- [Manage Senders](#sms-senders)
`,
      style: `
        .sms-overview { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .sms-metric { display: flex; gap: 15px; padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; }
        .metric-icon { font-size: 48px; }
        .metric-value { font-size: 28px; font-weight: bold; color: #007bff; }
        .metric-label { color: #666; font-size: 13px; }
        .sms-campaign-card { padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 15px; }
        .campaign-header-row { display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; }
        .campaign-sender { color: #666; font-size: 14px; }
        .status-badge { padding: 5px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status-sent { background: #28a745; color: white; }
        .status-draft { background: #ffc107; color: black; }
        .status-queued { background: #17a2b8; color: white; }
        .campaign-content { padding: 15px; background: #f8f9fa; border-radius: 4px; margin-bottom: 15px; font-family: monospace; }
        .campaign-stats-row { display: flex; gap: 30px; margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 4px; }
        .stat-item { display: flex; gap: 5px; }
        .stat-label { color: #666; }
        .stat-value { font-weight: bold; }
        .campaign-footer { display: flex; justify-content: space-between; align-items: center; }
        .campaign-date { color: #999; font-size: 14px; }
        .campaign-actions { display: flex; gap: 10px; }
        .btn-sm { padding: 6px 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; }
        .btn-primary { background: #007bff; color: white; border-color: #007bff; }
      `,
    },
  };
}
