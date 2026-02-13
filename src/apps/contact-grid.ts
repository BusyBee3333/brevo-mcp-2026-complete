export function contactGridApp() {
  return {
    name: 'contact-grid',
    description: 'Searchable and filterable grid view of all contacts',
    ui: {
      title: 'Contact Grid',
      content: `
# All Contacts

<div class="grid-controls">
  <input type="text" placeholder="Search contacts..." class="search-input" />
  <select class="filter-select">
    <option>All Lists</option>
    {{#each lists}}
    <option value="{{this.id}}">{{this.name}}</option>
    {{/each}}
  </select>
  <button class="btn-primary">+ New Contact</button>
</div>

<table class="contacts-grid">
  <thead>
    <tr>
      <th>Email</th>
      <th>Name</th>
      <th>Lists</th>
      <th>Status</th>
      <th>Created</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {{#each contacts}}
    <tr>
      <td><a href="#contact/{{this.id}}">{{this.email}}</a></td>
      <td>{{this.attributes.FIRSTNAME}} {{this.attributes.LASTNAME}}</td>
      <td><span class="badge-count">{{this.listIds.length}}</span></td>
      <td>
        {{#if this.emailBlacklisted}}
        <span class="status-inactive">Blacklisted</span>
        {{else}}
        <span class="status-active">Active</span>
        {{/if}}
      </td>
      <td>{{this.createdAt}}</td>
      <td>
        <button class="btn-icon" title="Edit">✏️</button>
        <button class="btn-icon" title="Delete">🗑️</button>
      </td>
    </tr>
    {{/each}}
  </tbody>
</table>

<div class="pagination">
  <button>← Previous</button>
  <span>Page {{currentPage}} of {{totalPages}}</span>
  <button>Next →</button>
</div>
`,
      style: `
        .grid-controls { display: flex; gap: 10px; margin-bottom: 20px; }
        .search-input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .filter-select { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .btn-primary { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .contacts-grid { width: 100%; border-collapse: collapse; }
        .contacts-grid th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: bold; }
        .contacts-grid td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
        .contacts-grid tr:hover { background: #f8f9fa; }
        .badge-count { background: #007bff; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
        .status-active { color: #28a745; font-weight: bold; }
        .status-inactive { color: #dc3545; font-weight: bold; }
        .btn-icon { background: none; border: none; font-size: 18px; cursor: pointer; }
        .pagination { display: flex; justify-content: center; gap: 20px; margin-top: 20px; align-items: center; }
      `,
    },
  };
}
