export function reportDashboardApp() {
  return {
    name: 'report-dashboard',
    description: 'Comprehensive analytics and reporting dashboard with charts and insights',
    ui: {
      title: 'Reports & Analytics',
      content: `
# Reports Dashboard

<div class="report-period">
  <select class="period-select">
    <option>Last 7 Days</option>
    <option>Last 30 Days</option>
    <option>Last 90 Days</option>
    <option>Custom Range</option>
  </select>
  <button class="btn-export">📥 Export Report</button>
</div>

<div class="kpi-grid">
  <div class="kpi-card">
    <div class="kpi-header">
      <h4>Total Sends</h4>
      <span class="kpi-trend up">+15%</span>
    </div>
    <div class="kpi-value">{{totalSends}}</div>
    <div class="kpi-chart">📊</div>
  </div>
  
  <div class="kpi-card">
    <div class="kpi-header">
      <h4>Open Rate</h4>
      <span class="kpi-trend up">+3.2%</span>
    </div>
    <div class="kpi-value">{{openRate}}%</div>
    <div class="kpi-chart">📈</div>
  </div>
  
  <div class="kpi-card">
    <div class="kpi-header">
      <h4>Click Rate</h4>
      <span class="kpi-trend down">-1.5%</span>
    </div>
    <div class="kpi-value">{{clickRate}}%</div>
    <div class="kpi-chart">📉</div>
  </div>
  
  <div class="kpi-card">
    <div class="kpi-header">
      <h4>Conversion Rate</h4>
      <span class="kpi-trend up">+5.8%</span>
    </div>
    <div class="kpi-value">{{conversionRate}}%</div>
    <div class="kpi-chart">💰</div>
  </div>
</div>

## Performance Over Time
<div class="chart-container">
  <div class="chart-placeholder">
    📊 Email Performance Chart
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-color" style="background: #007bff;"></span> Opens</span>
      <span class="legend-item"><span class="legend-color" style="background: #28a745;"></span> Clicks</span>
      <span class="legend-item"><span class="legend-color" style="background: #ffc107;"></span> Bounces</span>
    </div>
  </div>
</div>

## Top Performing Campaigns
<table class="report-table">
  <thead>
    <tr>
      <th>Campaign</th>
      <th>Sent</th>
      <th>Opens</th>
      <th>Clicks</th>
      <th>Conv. Rate</th>
      <th>Revenue</th>
    </tr>
  </thead>
  <tbody>
    {{#each topCampaigns}}
    <tr>
      <td><strong>{{this.name}}</strong></td>
      <td>{{this.sent}}</td>
      <td>{{this.opens}} ({{this.openRate}}%)</td>
      <td>{{this.clicks}} ({{this.clickRate}}%)</td>
      <td><span class="rate-badge">{{this.conversionRate}}%</span></td>
      <td><strong>\${{this.revenue}}</strong></td>
    </tr>
    {{/each}}
  </tbody>
</table>

## Engagement by Device
<div class="device-stats">
  <div class="device-stat">
    <div class="device-icon">💻</div>
    <div class="device-name">Desktop</div>
    <div class="device-percent">{{desktopPercent}}%</div>
  </div>
  <div class="device-stat">
    <div class="device-icon">📱</div>
    <div class="device-name">Mobile</div>
    <div class="device-percent">{{mobilePercent}}%</div>
  </div>
  <div class="device-stat">
    <div class="device-icon">📧</div>
    <div class="device-name">Webmail</div>
    <div class="device-percent">{{webmailPercent}}%</div>
  </div>
</div>
`,
      style: `
        .report-period { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .period-select { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .btn-export { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .kpi-card { padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; }
        .kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .kpi-trend { font-size: 12px; font-weight: bold; }
        .kpi-trend.up { color: #28a745; }
        .kpi-trend.down { color: #dc3545; }
        .kpi-value { font-size: 36px; font-weight: bold; color: #007bff; margin-bottom: 10px; }
        .kpi-chart { font-size: 30px; }
        .chart-container { padding: 30px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 30px; }
        .chart-placeholder { height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8f9fa; border-radius: 4px; font-size: 24px; color: #666; }
        .chart-legend { display: flex; gap: 20px; margin-top: 20px; font-size: 14px; }
        .legend-item { display: flex; align-items: center; gap: 5px; }
        .legend-color { width: 15px; height: 15px; border-radius: 3px; }
        .report-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .report-table th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: bold; }
        .report-table td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
        .rate-badge { padding: 4px 8px; background: #d4edda; color: #155724; border-radius: 4px; font-weight: bold; }
        .device-stats { display: flex; gap: 30px; justify-content: center; }
        .device-stat { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; min-width: 150px; }
        .device-icon { font-size: 48px; margin-bottom: 10px; }
        .device-name { color: #666; margin-bottom: 5px; }
        .device-percent { font-size: 24px; font-weight: bold; color: #007bff; }
      `,
    },
  };
}
