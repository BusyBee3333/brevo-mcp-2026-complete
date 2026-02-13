export function importWizardApp() {
  return {
    name: 'import-wizard',
    description: 'Step-by-step wizard for importing contacts with mapping and validation',
    ui: {
      title: 'Import Contacts Wizard',
      content: `
# Import Contacts

<div class="wizard-progress">
  <div class="progress-step active">
    <div class="step-circle">1</div>
    <div class="step-label">Upload File</div>
  </div>
  <div class="progress-line"></div>
  <div class="progress-step">
    <div class="step-circle">2</div>
    <div class="step-label">Map Fields</div>
  </div>
  <div class="progress-line"></div>
  <div class="progress-step">
    <div class="step-circle">3</div>
    <div class="step-label">Configure</div>
  </div>
  <div class="progress-line"></div>
  <div class="progress-step">
    <div class="step-circle">4</div>
    <div class="step-label">Review & Import</div>
  </div>
</div>

<div class="wizard-content">
  <h2>Step 1: Upload Your File</h2>
  
  <div class="upload-area">
    <div class="upload-icon">📄</div>
    <h3>Drag and drop your CSV file here</h3>
    <p>or</p>
    <button class="btn-upload">Browse Files</button>
    <div class="upload-info">
      Supported format: CSV (comma-separated values)<br>
      Maximum file size: 10 MB<br>
      Maximum contacts: 100,000 per import
    </div>
  </div>
  
  <div class="template-section">
    <h3>Need a template?</h3>
    <p>Download our CSV template with all the standard fields</p>
    <button class="btn-secondary">📥 Download Template</button>
  </div>
  
  <div class="requirements-section">
    <h3>File Requirements</h3>
    <ul class="requirements-list">
      <li class="req-item">
        <span class="req-icon">✓</span>
        First row must contain column headers
      </li>
      <li class="req-item">
        <span class="req-icon">✓</span>
        Email column is required
      </li>
      <li class="req-item">
        <span class="req-icon">✓</span>
        UTF-8 encoding recommended
      </li>
      <li class="req-item">
        <span class="req-icon">✓</span>
        Use comma (,) as field separator
      </li>
    </ul>
  </div>
</div>

<div class="wizard-actions">
  <button class="btn-cancel">Cancel</button>
  <button class="btn-next" disabled>Next: Map Fields →</button>
</div>

<div class="recent-imports">
  <h3>Recent Imports</h3>
  <table class="imports-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>File Name</th>
        <th>Total</th>
        <th>Success</th>
        <th>Failed</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {{#each recentImports}}
      <tr>
        <td>{{this.date}}</td>
        <td>{{this.fileName}}</td>
        <td>{{this.total}}</td>
        <td class="success-count">{{this.success}}</td>
        <td class="failed-count">{{this.failed}}</td>
        <td><span class="status-badge status-{{this.status}}">{{this.status}}</span></td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</div>
`,
      style: `
        .wizard-progress { display: flex; align-items: center; justify-content: center; margin-bottom: 40px; padding: 30px; background: white; border-radius: 8px; }
        .progress-step { display: flex; flex-direction: column; align-items: center; }
        .step-circle { width: 40px; height: 40px; border-radius: 50%; background: #e0e0e0; color: #666; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .progress-step.active .step-circle { background: #007bff; color: white; }
        .step-label { margin-top: 10px; font-size: 14px; color: #666; }
        .progress-step.active .step-label { color: #007bff; font-weight: bold; }
        .progress-line { width: 100px; height: 2px; background: #e0e0e0; margin: 0 20px; }
        .wizard-content { background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; }
        .upload-area { border: 2px dashed #007bff; border-radius: 8px; padding: 60px; text-align: center; background: #f8f9ff; margin: 20px 0; }
        .upload-icon { font-size: 64px; margin-bottom: 20px; }
        .btn-upload { padding: 12px 30px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        .upload-info { margin-top: 20px; color: #666; font-size: 14px; line-height: 1.6; }
        .template-section { padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 30px 0; text-align: center; }
        .btn-secondary { padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .requirements-section { margin-top: 30px; }
        .requirements-list { list-style: none; padding: 0; }
        .req-item { display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8f9fa; margin-bottom: 8px; border-radius: 4px; }
        .req-icon { width: 24px; height: 24px; background: #28a745; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .wizard-actions { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .btn-cancel { padding: 10px 20px; background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
        .btn-next { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn-next:disabled { background: #ccc; cursor: not-allowed; }
        .recent-imports { background: white; padding: 30px; border-radius: 8px; }
        .imports-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .imports-table th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: bold; }
        .imports-table td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
        .success-count { color: #28a745; font-weight: bold; }
        .failed-count { color: #dc3545; font-weight: bold; }
        .status-badge { padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status-completed { background: #d4edda; color: #155724; }
        .status-processing { background: #fff3cd; color: #856404; }
        .status-failed { background: #f8d7da; color: #721c24; }
      `,
    },
  };
}
