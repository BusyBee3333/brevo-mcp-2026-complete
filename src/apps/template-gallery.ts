export function templateGalleryApp() {
  return {
    name: 'email-template-gallery',
    description: 'Browse, preview, and manage email templates with visual gallery',
    ui: {
      title: 'Email Template Gallery',
      content: `
# Email Templates

<div class="gallery-header">
  <input type="text" placeholder="Search templates..." class="search-bar" />
  <div class="gallery-filters">
    <button class="filter-btn active">All</button>
    <button class="filter-btn">Active</button>
    <button class="filter-btn">Drafts</button>
    <button class="filter-btn">Favorites</button>
  </div>
  <button class="btn-create">+ Create Template</button>
</div>

<div class="templates-grid">
  {{#each templates}}
  <div class="template-card">
    <div class="template-preview-box">
      <div class="preview-placeholder">
        <span class="preview-icon">📧</span>
        <div class="preview-subject">{{this.subject}}</div>
      </div>
    </div>
    
    <div class="template-info">
      <h4>{{this.name}}</h4>
      <div class="template-meta">
        <span class="template-sender">{{this.sender.name}}</span>
        <span class="template-date">{{this.modifiedAt}}</span>
      </div>
      
      <div class="template-tags">
        {{#if this.tag}}
        <span class="tag">{{this.tag}}</span>
        {{/if}}
        {{#if this.isActive}}
        <span class="tag tag-active">Active</span>
        {{else}}
        <span class="tag tag-inactive">Inactive</span>
        {{/if}}
      </div>
      
      <div class="template-actions">
        <button class="action-btn" title="Preview">👁️</button>
        <button class="action-btn" title="Edit">✏️</button>
        <button class="action-btn" title="Duplicate">📋</button>
        <button class="action-btn" title="Send Test">📤</button>
        <button class="action-btn" title="Delete">🗑️</button>
      </div>
    </div>
  </div>
  {{/each}}
</div>

<div class="pagination">
  <button>← Previous</button>
  <span>Page {{currentPage}} of {{totalPages}}</span>
  <button>Next →</button>
</div>
`,
      style: `
        .gallery-header { display: flex; gap: 15px; align-items: center; margin-bottom: 30px; }
        .search-bar { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .gallery-filters { display: flex; gap: 5px; }
        .filter-btn { padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; }
        .filter-btn.active { background: #007bff; color: white; border-color: #007bff; }
        .btn-create { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .templates-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; }
        .template-card { background: white; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; transition: box-shadow 0.3s; }
        .template-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .template-preview-box { height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; }
        .preview-placeholder { text-align: center; color: white; }
        .preview-icon { font-size: 60px; display: block; margin-bottom: 10px; }
        .preview-subject { font-size: 14px; opacity: 0.9; }
        .template-info { padding: 20px; }
        .template-info h4 { margin: 0 0 10px 0; }
        .template-meta { display: flex; justify-content: space-between; color: #666; font-size: 12px; margin-bottom: 10px; }
        .template-tags { display: flex; gap: 5px; margin-bottom: 15px; }
        .tag { padding: 4px 8px; background: #e0e0e0; border-radius: 4px; font-size: 11px; }
        .tag-active { background: #d4edda; color: #155724; }
        .tag-inactive { background: #f8d7da; color: #721c24; }
        .template-actions { display: flex; gap: 5px; justify-content: space-around; }
        .action-btn { background: none; border: none; font-size: 20px; cursor: pointer; padding: 5px; }
        .pagination { display: flex; justify-content: center; gap: 20px; margin-top: 30px; align-items: center; }
      `,
    },
  };
}
