export function contactDetailApp() {
  return {
    name: 'contact-detail',
    description: 'Detailed view of a single contact with full profile, attributes, and activity history',
    ui: {
      title: 'Contact Detail',
      content: `
# Contact Profile: {{email}}

<div class="profile-header">
  <div class="profile-info">
    <h2>{{attributes.FIRSTNAME}} {{attributes.LASTNAME}}</h2>
    <div class="contact-email">{{email}}</div>
    <div class="contact-id">ID: {{id}}</div>
  </div>
  
  <div class="profile-status">
    {{#if emailBlacklisted}}
    <span class="badge badge-danger">Email Blacklisted</span>
    {{/if}}
    {{#if smsBlacklisted}}
    <span class="badge badge-warning">SMS Blacklisted</span>
    {{/if}}
    {{#unless emailBlacklisted}}
    <span class="badge badge-success">Active</span>
    {{/unless}}
  </div>
</div>

## Contact Attributes
<table class="attributes-table">
  {{#each attributes}}
  <tr>
    <td class="attr-name">{{@key}}</td>
    <td class="attr-value">{{this}}</td>
  </tr>
  {{/each}}
</table>

## Lists Membership
<div class="lists-section">
  {{#each listIds}}
  <span class="list-badge">List {{this}}</span>
  {{/each}}
</div>

## Activity Timeline
<div class="timeline">
  <div class="timeline-item">
    <div class="timeline-date">{{modifiedAt}}</div>
    <div class="timeline-event">Contact Modified</div>
  </div>
  <div class="timeline-item">
    <div class="timeline-date">{{createdAt}}</div>
    <div class="timeline-event">Contact Created</div>
  </div>
</div>

## Actions
- [Edit Contact](#edit/{{id}})
- [Add to List](#add-list/{{id}})
- [Export Contact](#export/{{id}})
- [Delete Contact](#delete/{{id}})
`,
      style: `
        .profile-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .profile-info h2 { margin: 0 0 10px 0; }
        .contact-email { font-size: 18px; color: #007bff; }
        .contact-id { color: #666; font-size: 14px; }
        .badge { padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .badge-success { background: #28a745; color: white; }
        .badge-danger { background: #dc3545; color: white; }
        .badge-warning { background: #ffc107; color: black; }
        .attributes-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .attributes-table td { padding: 10px; border-bottom: 1px solid #e0e0e0; }
        .attr-name { font-weight: bold; width: 200px; }
        .list-badge { display: inline-block; padding: 5px 12px; background: #e7f3ff; color: #007bff; border-radius: 4px; margin: 5px; }
        .timeline { margin: 20px 0; }
        .timeline-item { padding: 15px; border-left: 3px solid #007bff; margin-left: 20px; }
        .timeline-date { font-weight: bold; color: #007bff; }
      `,
    },
  };
}
