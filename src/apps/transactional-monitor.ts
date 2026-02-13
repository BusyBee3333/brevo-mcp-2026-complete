export function transactionalMonitorApp() {
  return {
    name: 'transactional-monitor',
    description: 'Real-time monitoring of transactional emails and SMS with event tracking',
    ui: {
      title: 'Transactional Monitor',
      content: `
# Transactional Email & SMS Monitor

<div class="monitor-tabs">
  <button class="tab active">Email Events</button>
  <button class="tab">SMS Events</button>
  <button class="tab">Statistics</button>
</div>

<div class="monitor-stats">
  <div class="monitor-card">
    <div class="card-icon">📧</div>
    <div class="card-info">
      <div class="card-value">{{emailsSentToday}}</div>
      <div class="card-label">Emails Today</div>
    </div>
  </div>
  
  <div class="monitor-card">
    <div class="card-icon">✅</div>
    <div class="card-info">
      <div class="card-value">{{deliveryRate}}%</div>
      <div class="card-label">Delivery Rate</div>
    </div>
  </div>
  
  <div class="monitor-card">
    <div class="card-icon">📱</div>
    <div class="card-info">
      <div class="card-value">{{smsSentToday}}</div>
      <div class="card-label">SMS Today</div>
    </div>
  </div>
  
  <div class="monitor-card">
    <div class="card-icon">⚠️</div>
    <div class="card-info">
      <div class="card-value">{{bounceRate}}%</div>
      <div class="card-label">Bounce Rate</div>
    </div>
  </div>
</div>

## Recent Events
<div class="events-filter">
  <select class="filter-input">
    <option>All Events</option>
    <option>Delivered</option>
    <option>Opened</option>
    <option>Clicked</option>
    <option>Bounced</option>
    <option>Spam</option>
  </select>
  <input type="text" placeholder="Search by email or message ID" class="filter-input" />
</div>

<table class="events-table">
  <thead>
    <tr>
      <th>Time</th>
      <th>Event</th>
      <th>Recipient</th>
      <th>Subject/Content</th>
      <th>Template</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {{#each events}}
    <tr>
      <td>{{this.date}}</td>
      <td><span class="event-badge event-{{this.event}}">{{this.event}}</span></td>
      <td>{{this.email}}</td>
      <td class="subject-col">{{this.subject}}</td>
      <td>{{this.templateId}}</td>
      <td><span class="status-{{this.status}}">{{this.status}}</span></td>
    </tr>
    {{/each}}
  </tbody>
</table>

<div class="pagination">
  <button>← Previous</button>
  <span>Showing {{offset}}-{{limit}} of {{total}}</span>
  <button>Next →</button>
</div>
`,
      style: `
        .monitor-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab { padding: 10px 20px; border: none; background: #f8f9fa; border-radius: 4px; cursor: pointer; }
        .tab.active { background: #007bff; color: white; }
        .monitor-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .monitor-card { display: flex; gap: 15px; padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; }
        .card-icon { font-size: 40px; }
        .card-value { font-size: 28px; font-weight: bold; }
        .card-label { color: #666; font-size: 14px; }
        .events-filter { display: flex; gap: 10px; margin-bottom: 20px; }
        .filter-input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .events-table { width: 100%; border-collapse: collapse; }
        .events-table th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: bold; }
        .events-table td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
        .event-badge { padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .event-delivered { background: #d4edda; color: #155724; }
        .event-opened { background: #d1ecf1; color: #0c5460; }
        .event-clicked { background: #cce5ff; color: #004085; }
        .event-bounced { background: #f8d7da; color: #721c24; }
        .subject-col { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pagination { display: flex; justify-content: center; gap: 20px; margin-top: 20px; align-items: center; }
      `,
    },
  };
}
