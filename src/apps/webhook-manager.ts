export function webhookManagerApp() {
  return {
    name: 'webhook-manager',
    description: 'Manage webhooks for real-time event notifications and integrations',
    ui: {
      title: 'Webhook Manager',
      content: `
# Webhook Manager

<div class="webhook-header">
  <div class="webhook-info">
    <h2>Active Webhooks</h2>
    <p>Configure webhooks to receive real-time notifications for email and SMS events</p>
  </div>
  <button class="btn-primary">+ Create Webhook</button>
</div>

<div class="webhook-types">
  <button class="type-btn active">All Webhooks</button>
  <button class="type-btn">Marketing</button>
  <button class="type-btn">Transactional</button>
</div>

## Configured Webhooks
{{#each webhooks}}
<div class="webhook-card">
  <div class="webhook-card-header">
    <div>
      <h4>{{this.description}}</h4>
      <div class="webhook-url">{{this.url}}</div>
    </div>
    <div class="webhook-status">
      <span class="status-indicator {{this.isActive}}"></span>
      <button class="btn-menu">⋮</button>
    </div>
  </div>
  
  <div class="webhook-type-badge">{{this.type}}</div>
  
  <div class="webhook-events">
    <strong>Events:</strong>
    <div class="event-tags">
      {{#each this.events}}
      <span class="event-tag">{{this}}</span>
      {{/each}}
    </div>
  </div>
  
  <div class="webhook-meta">
    <div class="meta-item">
      <span class="meta-label">Created:</span>
      <span>{{this.createdAt}}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Last Modified:</span>
      <span>{{this.modifiedAt}}</span>
    </div>
    {{#if this.batched}}
    <div class="meta-item">
      <span class="badge-info">Batched Events</span>
    </div>
    {{/if}}
    {{#if this.auth}}
    <div class="meta-item">
      <span class="badge-secure">🔒 Authenticated</span>
    </div>
    {{/if}}
  </div>
  
  <div class="webhook-actions">
    <button class="action-btn">Test Webhook</button>
    <button class="action-btn">View Logs</button>
    <button class="action-btn">Edit</button>
    <button class="action-btn danger">Delete</button>
  </div>
</div>
{{/each}}

## Available Events
<div class="events-reference">
  <div class="event-category">
    <h4>Email Events</h4>
    <ul>
      <li><code>delivered</code> - Email successfully delivered</li>
      <li><code>opened</code> - Email opened by recipient</li>
      <li><code>clicked</code> - Link clicked in email</li>
      <li><code>soft_bounce</code> - Temporary delivery failure</li>
      <li><code>hard_bounce</code> - Permanent delivery failure</li>
      <li><code>spam</code> - Marked as spam</li>
      <li><code>unsubscribed</code> - Recipient unsubscribed</li>
    </ul>
  </div>
  
  <div class="event-category">
    <h4>SMS Events</h4>
    <ul>
      <li><code>sms_delivered</code> - SMS successfully delivered</li>
      <li><code>sms_failed</code> - SMS delivery failed</li>
      <li><code>sms_replied</code> - Recipient replied to SMS</li>
    </ul>
  </div>
  
  <div class="event-category">
    <h4>Contact Events</h4>
    <ul>
      <li><code>contact_created</code> - New contact added</li>
      <li><code>contact_updated</code> - Contact information updated</li>
      <li><code>contact_deleted</code> - Contact removed</li>
      <li><code>list_addition</code> - Contact added to list</li>
    </ul>
  </div>
</div>
`,
      style: `
        .webhook-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .webhook-info p { color: #666; margin: 5px 0 0 0; }
        .btn-primary { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .webhook-types { display: flex; gap: 10px; margin-bottom: 30px; }
        .type-btn { padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; }
        .type-btn.active { background: #007bff; color: white; border-color: #007bff; }
        .webhook-card { padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 20px; }
        .webhook-card-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .webhook-url { color: #007bff; font-family: monospace; font-size: 14px; margin-top: 5px; word-break: break-all; }
        .webhook-status { display: flex; align-items: center; gap: 10px; }
        .status-indicator { width: 12px; height: 12px; border-radius: 50%; background: #28a745; }
        .status-indicator.inactive { background: #dc3545; }
        .btn-menu { background: none; border: none; font-size: 20px; cursor: pointer; }
        .webhook-type-badge { display: inline-block; padding: 4px 10px; background: #e7f3ff; color: #007bff; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 15px; }
        .webhook-events { margin-bottom: 15px; }
        .event-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        .event-tag { padding: 4px 8px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; font-family: monospace; }
        .webhook-meta { display: flex; flex-wrap: wrap; gap: 20px; padding: 15px; background: #f8f9fa; border-radius: 4px; margin-bottom: 15px; }
        .meta-item { display: flex; gap: 5px; font-size: 14px; }
        .meta-label { color: #666; }
        .badge-info { padding: 4px 8px; background: #d1ecf1; color: #0c5460; border-radius: 4px; font-size: 12px; }
        .badge-secure { padding: 4px 8px; background: #d4edda; color: #155724; border-radius: 4px; font-size: 12px; }
        .webhook-actions { display: flex; gap: 10px; }
        .action-btn { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .action-btn.danger { background: #dc3545; }
        .events-reference { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px; }
        .event-category { padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .event-category h4 { margin-top: 0; }
        .event-category ul { list-style: none; padding: 0; }
        .event-category li { padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
        .event-category code { background: white; padding: 2px 6px; border-radius: 3px; color: #007bff; }
      `,
    },
  };
}
