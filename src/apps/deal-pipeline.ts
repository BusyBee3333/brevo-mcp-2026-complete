export function dealPipelineApp() {
  return {
    name: 'deal-pipeline',
    description: 'Visual CRM deal pipeline with drag-and-drop stages and deal tracking',
    ui: {
      title: 'Deal Pipeline',
      content: `
# CRM Pipeline

<div class="pipeline-header">
  <h2>{{pipelineName}}</h2>
  <div class="pipeline-stats">
    <span>Total Value: <strong>\${{totalValue}}</strong></span>
    <span>{{totalDeals}} Deals</span>
    <span>Win Rate: <strong>{{winRate}}%</strong></span>
  </div>
</div>

<div class="pipeline-board">
  {{#each stages}}
  <div class="pipeline-stage">
    <div class="stage-header">
      <h4>{{this.name}}</h4>
      <span class="stage-count">{{this.deals.length}}</span>
    </div>
    <div class="stage-value">\${{this.totalValue}}</div>
    
    <div class="deals-container">
      {{#each this.deals}}
      <div class="deal-card" draggable="true">
        <div class="deal-name">{{this.name}}</div>
        <div class="deal-value">\${{this.attributes.amount}}</div>
        <div class="deal-contact">{{this.contactName}}</div>
        <div class="deal-date">{{this.modifiedAt}}</div>
      </div>
      {{/each}}
    </div>
  </div>
  {{/each}}
</div>

## Quick Actions
- [Add New Deal](#new-deal)
- [Change Pipeline](#pipelines)
- [Export Pipeline](#export)
- [Pipeline Reports](#reports)
`,
      style: `
        .pipeline-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .pipeline-stats { display: flex; gap: 30px; color: #666; }
        .pipeline-board { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px; }
        .pipeline-stage { min-width: 280px; background: #f8f9fa; border-radius: 8px; padding: 15px; }
        .stage-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .stage-count { background: #007bff; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
        .stage-value { font-size: 20px; font-weight: bold; color: #28a745; margin-bottom: 15px; }
        .deals-container { max-height: 600px; overflow-y: auto; }
        .deal-card { background: white; padding: 15px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid #007bff; cursor: move; }
        .deal-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .deal-name { font-weight: bold; margin-bottom: 5px; }
        .deal-value { font-size: 18px; color: #28a745; margin-bottom: 5px; }
        .deal-contact { color: #666; font-size: 14px; }
        .deal-date { color: #999; font-size: 12px; margin-top: 5px; }
      `,
    },
  };
}
