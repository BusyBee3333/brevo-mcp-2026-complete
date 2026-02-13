export function campaignDashboardApp() {
  return {
    name: 'campaign-dashboard',
    description: 'Email campaign dashboard with performance metrics and recent campaigns',
    ui: {
      title: 'Campaign Dashboard',
      content: `
# Campaign Dashboard

<div class="stats-overview">
  <div class="stat-card">
    <h3>Total Campaigns</h3>
    <div class="stat-number">{{totalCampaigns}}</div>
    <div class="stat-detail">{{activeCampaigns}} active</div>
  </div>
  
  <div class="stat-card">
    <h3>Emails Sent</h3>
    <div class="stat-number">{{totalEmailsSent}}</div>
    <div class="stat-detail">This month</div>
  </div>
  
  <div class="stat-card">
    <h3>Avg Open Rate</h3>
    <div class="stat-number">{{avgOpenRate}}%</div>
    <div class="stat-trend">+{{openRateChange}}%</div>
  </div>
  
  <div class="stat-card">
    <h3>Avg Click Rate</h3>
    <div class="stat-number">{{avgClickRate}}%</div>
    <div class="stat-trend">+{{clickRateChange}}%</div>
  </div>
</div>

## Recent Campaigns
{{#each recentCampaigns}}
<div class="campaign-card">
  <div class="campaign-header">
    <h4>{{this.name}}</h4>
    <span class="status-badge status-{{this.status}}">{{this.status}}</span>
  </div>
  <div class="campaign-subject">{{this.subject}}</div>
  <div class="campaign-stats">
    <span>📧 {{this.stats.sent}} sent</span>
    <span>📖 {{this.stats.openRate}}% opened</span>
    <span>🔗 {{this.stats.clickRate}}% clicked</span>
  </div>
  <div class="campaign-date">{{this.createdAt}}</div>
</div>
{{/each}}

## Quick Actions
- [Create New Campaign](#new-campaign)
- [View All Campaigns](#campaigns)
- [Campaign Reports](#reports)
- [A/B Test Campaign](#ab-test)
`,
      style: `
        .stats-overview { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; }
        .stat-number { font-size: 36px; font-weight: bold; margin: 10px 0; }
        .stat-detail { opacity: 0.9; }
        .stat-trend { color: #4ade80; font-weight: bold; }
        .campaign-card { padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 15px; }
        .campaign-header { display: flex; justify-content: space-between; align-items: center; }
        .status-badge { padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status-draft { background: #ffc107; color: black; }
        .status-sent { background: #28a745; color: white; }
        .status-queued { background: #17a2b8; color: white; }
        .campaign-subject { color: #666; margin: 10px 0; }
        .campaign-stats { display: flex; gap: 20px; margin: 10px 0; }
        .campaign-date { color: #999; font-size: 0.9em; }
      `,
    },
  };
}
