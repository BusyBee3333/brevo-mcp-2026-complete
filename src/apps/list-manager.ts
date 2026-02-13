export function listManagerApp() {
  return {
    name: 'list-manager',
    description: 'Manage contact lists and folders with organization and segmentation tools',
    ui: {
      title: 'List Manager',
      content: `
# Contact Lists & Folders

<div class="manager-header">
  <div class="manager-stats">
    <div class="stat-box">
      <div class="stat-number">{{totalLists}}</div>
      <div class="stat-label">Total Lists</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">{{totalSubscribers}}</div>
      <div class="stat-label">Total Subscribers</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">{{totalFolders}}</div>
      <div class="stat-label">Folders</div>
    </div>
  </div>
  <button class="btn-create">+ Create List</button>
</div>

<div class="manager-layout">
  <div class="folders-sidebar">
    <h3>Folders</h3>
    <div class="folder-list">
      {{#each folders}}
      <div class="folder-item">
        <span class="folder-icon">📁</span>
        <span class="folder-name">{{this.name}}</span>
        <span class="folder-count">{{this.totalSubscribers}}</span>
      </div>
      {{/each}}
    </div>
    <button class="btn-secondary">+ New Folder</button>
  </div>
  
  <div class="lists-main">
    <div class="lists-toolbar">
      <input type="text" placeholder="Search lists..." class="search-input" />
      <select class="sort-select">
        <option>Sort by Name</option>
        <option>Sort by Size</option>
        <option>Sort by Date</option>
      </select>
    </div>
    
    <div class="lists-grid">
      {{#each lists}}
      <div class="list-card">
        <div class="list-header">
          <h4>{{this.name}}</h4>
          <div class="list-menu">⋮</div>
        </div>
        
        <div class="list-stats">
          <div class="list-stat">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <div class="stat-num">{{this.totalSubscribers}}</div>
              <div class="stat-text">Subscribers</div>
            </div>
          </div>
          
          <div class="list-stat">
            <div class="stat-icon">🚫</div>
            <div class="stat-info">
              <div class="stat-num">{{this.totalBlacklisted}}</div>
              <div class="stat-text">Blacklisted</div>
            </div>
          </div>
        </div>
        
        <div class="list-folder">
          {{#if this.folderId}}
          📁 {{this.folderName}}
          {{else}}
          No folder
          {{/if}}
        </div>
        
        <div class="list-actions">
          <button class="action-btn">View Contacts</button>
          <button class="action-btn">Add Contacts</button>
          <button class="action-btn">Edit</button>
        </div>
      </div>
      {{/each}}
    </div>
  </div>
</div>
`,
      style: `
        .manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .manager-stats { display: flex; gap: 20px; }
        .stat-box { padding: 15px 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; }
        .stat-number { font-size: 28px; font-weight: bold; }
        .stat-label { font-size: 12px; opacity: 0.9; }
        .btn-create { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .manager-layout { display: flex; gap: 20px; }
        .folders-sidebar { width: 250px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .folders-sidebar h3 { margin-top: 0; }
        .folder-list { margin: 15px 0; }
        .folder-item { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 4px; cursor: pointer; margin-bottom: 5px; }
        .folder-item:hover { background: white; }
        .folder-count { margin-left: auto; color: #666; font-size: 12px; }
        .btn-secondary { width: 100%; padding: 8px; background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
        .lists-main { flex: 1; }
        .lists-toolbar { display: flex; gap: 10px; margin-bottom: 20px; }
        .search-input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .sort-select { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .lists-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .list-card { padding: 20px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; }
        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .list-menu { cursor: pointer; font-size: 20px; }
        .list-stats { display: flex; gap: 20px; margin-bottom: 15px; }
        .list-stat { display: flex; gap: 10px; align-items: center; }
        .stat-icon { font-size: 24px; }
        .stat-num { font-size: 20px; font-weight: bold; }
        .stat-text { font-size: 12px; color: #666; }
        .list-folder { padding: 8px; background: #f8f9fa; border-radius: 4px; margin-bottom: 15px; font-size: 14px; }
        .list-actions { display: flex; gap: 5px; flex-wrap: wrap; }
        .action-btn { padding: 6px 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
      `,
    },
  };
}
