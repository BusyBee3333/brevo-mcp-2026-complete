export function campaignBuilderApp() {
  return {
    name: 'campaign-builder',
    description: 'Visual campaign builder for creating and scheduling email campaigns',
    ui: {
      title: 'Campaign Builder',
      content: `
# Create Email Campaign

<div class="builder-container">
  <div class="builder-sidebar">
    <div class="step">
      <div class="step-number">1</div>
      <div class="step-title">Setup</div>
    </div>
    <div class="step active">
      <div class="step-number">2</div>
      <div class="step-title">Design</div>
    </div>
    <div class="step">
      <div class="step-number">3</div>
      <div class="step-title">Recipients</div>
    </div>
    <div class="step">
      <div class="step-number">4</div>
      <div class="step-title">Schedule</div>
    </div>
  </div>
  
  <div class="builder-main">
    <h2>Campaign Settings</h2>
    
    <div class="form-group">
      <label>Campaign Name</label>
      <input type="text" placeholder="Enter campaign name" class="form-input" />
    </div>
    
    <div class="form-group">
      <label>Subject Line</label>
      <input type="text" placeholder="Enter subject line" class="form-input" />
    </div>
    
    <div class="form-group">
      <label>Sender</label>
      <select class="form-input">
        {{#each senders}}
        <option value="{{this.id}}">{{this.name}} <{{this.email}}></option>
        {{/each}}
      </select>
    </div>
    
    <div class="form-group">
      <label>Template</label>
      <div class="template-grid">
        {{#each templates}}
        <div class="template-card">
          <div class="template-preview">📧</div>
          <div class="template-name">{{this.name}}</div>
        </div>
        {{/each}}
      </div>
    </div>
    
    <div class="form-group">
      <label>Content Editor</label>
      <textarea class="form-textarea" rows="10" placeholder="HTML content..."></textarea>
    </div>
    
    <div class="builder-actions">
      <button class="btn-secondary">Save Draft</button>
      <button class="btn-primary">Continue to Recipients →</button>
    </div>
  </div>
</div>
`,
      style: `
        .builder-container { display: flex; gap: 30px; }
        .builder-sidebar { width: 200px; }
        .step { padding: 15px; margin-bottom: 10px; border-radius: 8px; background: #f8f9fa; display: flex; align-items: center; gap: 10px; }
        .step.active { background: #007bff; color: white; }
        .step-number { width: 30px; height: 30px; background: white; color: #007bff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .step.active .step-number { background: white; color: #007bff; }
        .builder-main { flex: 1; }
        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; font-weight: bold; margin-bottom: 8px; }
        .form-input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .form-textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; }
        .template-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .template-card { padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; text-align: center; cursor: pointer; }
        .template-card:hover { border-color: #007bff; }
        .template-preview { font-size: 48px; margin-bottom: 10px; }
        .builder-actions { display: flex; gap: 10px; margin-top: 30px; }
        .btn-secondary { padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn-primary { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
      `,
    },
  };
}
