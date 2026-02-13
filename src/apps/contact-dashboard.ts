export function contactDashboardApp() {
  return {
    name: 'contact-dashboard',
    description: 'Overview dashboard of all contacts with key metrics and recent activity',
    ui: {
      title: 'Contact Dashboard',
      content: `
# Contact Dashboard

<div class="dashboard-grid">
  <div class="metric-card">
    <h3>Total Contacts</h3>
    <div class="metric-value">{{totalContacts}}</div>
    <div class="metric-change">+{{newContactsThisMonth}} this month</div>
  </div>
  
  <div class="metric-card">
    <h3>Active Contacts</h3>
    <div class="metric-value">{{activeContacts}}</div>
    <div class="metric-trend">{{engagementRate}}% engagement</div>
  </div>
  
  <div class="metric-card">
    <h3>Blacklisted</h3>
    <div class="metric-value">{{blacklistedContacts}}</div>
    <div class="metric-status">Email & SMS</div>
  </div>
  
  <div class="metric-card">
    <h3>Lists</h3>
    <div class="metric-value">{{totalLists}}</div>
    <div class="metric-info">{{totalFolders}} folders</div>
  </div>
</div>

## Recent Contacts
{{#each recentContacts}}
<div class="contact-row">
  <strong>{{this.email}}</strong>
  <span class="contact-date">Added {{this.createdAt}}</span>
  <span class="contact-lists">{{this.listCount}} lists</span>
</div>
{{/each}}

## Quick Actions
- [View All Contacts](#contacts)
- [Import Contacts](#import)
- [Create New List](#new-list)
- [Export Contacts](#export)
`,
      style: `
        .dashboard-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
        .metric-card { padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .metric-value { font-size: 32px; font-weight: bold; margin: 10px 0; }
        .metric-change { color: #28a745; }
        .metric-trend { color: #007bff; }
        .contact-row { padding: 12px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; }
        .contact-date { color: #666; }
        .contact-lists { color: #007bff; font-size: 0.9em; }
      `,
    },
  };
}
