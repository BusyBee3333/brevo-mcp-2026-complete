# Brevo MCP Server

Complete Model Context Protocol (MCP) server for Brevo (formerly SendinBlue) with 55+ tools and 14 interactive apps.

## Features

### 🛠️ 55+ Tools Across 10 Categories

- **Contacts** (12 tools): List, get, create, update, delete, search, import, export, manage attributes, folders, and lists
- **Email Campaigns** (9 tools): List, get, create, update, delete, send, schedule, reports, and link tracking
- **Transactional** (4 tools): Send transactional emails/SMS, event tracking, aggregated reports
- **Lists** (7 tools): Manage contact lists, add/remove contacts
- **Senders** (6 tools): List, create, update, delete, validate sender domains
- **Templates** (6 tools): List, create, update, delete templates, send test emails
- **Automations** (5 tools): List workflows, activate/deactivate, get stats
- **SMS Campaigns** (6 tools): List, create, update, send SMS campaigns, reports
- **CRM Deals** (7 tools): Manage deals, pipelines, and stages
- **Webhooks** (5 tools): List, create, update, delete webhooks for real-time events

### 📱 14 Interactive MCP Apps

1. **contact-dashboard** - Overview with key metrics and recent activity
2. **contact-detail** - Full profile view with attributes and timeline
3. **contact-grid** - Searchable, filterable grid view
4. **campaign-dashboard** - Campaign performance metrics
5. **campaign-builder** - Visual campaign creation wizard
6. **automation-dashboard** - Marketing automation workflows
7. **deal-pipeline** - Visual CRM pipeline with drag-and-drop
8. **transactional-monitor** - Real-time transactional event tracking
9. **email-template-gallery** - Browse and manage templates
10. **sms-dashboard** - SMS campaign management
11. **list-manager** - Contact lists and folders organization
12. **report-dashboard** - Comprehensive analytics and insights
13. **webhook-manager** - Configure webhooks for integrations
14. **import-wizard** - Step-by-step contact import

## Installation

```bash
npm install
npm run build
```

## Configuration

Set your Brevo API key as an environment variable:

```bash
export BREVO_API_KEY=your-api-key-here
```

Get your API key from: https://app.brevo.com/settings/keys/api

## Usage

### Running the Server

```bash
npm start
```

Or with inline API key:

```bash
BREVO_API_KEY=your-api-key-here npm start
```

### MCP Client Configuration

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "brevo": {
      "command": "node",
      "args": ["/path/to/brevo/dist/main.js"],
      "env": {
        "BREVO_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Tool Examples

### Create a Contact

```typescript
brevo_create_contact({
  email: "user@example.com",
  attributes: {
    FIRSTNAME: "John",
    LASTNAME: "Doe",
    COMPANY: "Acme Inc"
  },
  listIds: [123]
})
```

### Send Transactional Email

```typescript
brevo_send_transactional_email({
  to: [{ email: "user@example.com", name: "John Doe" }],
  sender: { email: "hello@company.com", name: "Company" },
  subject: "Welcome!",
  htmlContent: "<h1>Welcome to our service!</h1>",
  tags: ["welcome", "onboarding"]
})
```

### Create Email Campaign

```typescript
brevo_create_email_campaign({
  name: "Monthly Newsletter",
  subject: "Your Monthly Update",
  sender: { name: "Company", email: "newsletter@company.com" },
  htmlContent: "<html>...</html>",
  recipients: {
    listIds: [123],
    exclusionListIds: [456]
  },
  scheduledAt: "2024-02-01T10:00:00Z"
})
```

### List Contacts

```typescript
brevo_list_contacts({
  limit: 50,
  offset: 0,
  listIds: [123],
  sort: "desc"
})
```

## API Reference

### Contacts Tools

- `brevo_list_contacts` - List all contacts with filters
- `brevo_get_contact` - Get contact by email/ID
- `brevo_create_contact` - Create new contact
- `brevo_update_contact` - Update contact
- `brevo_delete_contact` - Delete contact
- `brevo_search_contacts` - Advanced contact search
- `brevo_import_contacts` - Bulk import from CSV
- `brevo_export_contacts` - Export contacts
- `brevo_list_contact_attributes` - List all attributes
- `brevo_create_contact_attribute` - Create custom attribute
- `brevo_list_contact_folders` - List folders
- `brevo_list_contact_lists` - List all lists

### Campaign Tools

- `brevo_list_email_campaigns` - List campaigns
- `brevo_get_email_campaign` - Get campaign details
- `brevo_create_email_campaign` - Create campaign
- `brevo_update_email_campaign` - Update campaign
- `brevo_delete_email_campaign` - Delete campaign
- `brevo_send_email_campaign` - Send immediately
- `brevo_schedule_email_campaign` - Schedule send
- `brevo_get_campaign_report` - Get performance report
- `brevo_list_campaign_links` - Get campaign links

### Transactional Tools

- `brevo_send_transactional_email` - Send transactional email
- `brevo_send_transactional_sms` - Send SMS
- `brevo_list_transactional_events` - List events
- `brevo_get_aggregated_report` - Get statistics

### Lists Tools

- `brevo_list_lists` - List all contact lists
- `brevo_get_list` - Get list details
- `brevo_create_list` - Create new list
- `brevo_update_list` - Update list
- `brevo_delete_list` - Delete list
- `brevo_add_contacts_to_list` - Add contacts
- `brevo_remove_contacts_from_list` - Remove contacts

### Templates Tools

- `brevo_list_templates` - List templates
- `brevo_get_template` - Get template
- `brevo_create_template` - Create template
- `brevo_update_template` - Update template
- `brevo_delete_template` - Delete template
- `brevo_send_test_template` - Send test email

### Automation Tools

- `brevo_list_workflows` - List workflows
- `brevo_get_workflow` - Get workflow
- `brevo_activate_workflow` - Activate workflow
- `brevo_deactivate_workflow` - Deactivate workflow
- `brevo_get_workflow_stats` - Get statistics

### SMS Tools

- `brevo_list_sms_campaigns` - List SMS campaigns
- `brevo_get_sms_campaign` - Get campaign
- `brevo_create_sms_campaign` - Create campaign
- `brevo_update_sms_campaign` - Update campaign
- `brevo_send_sms_campaign` - Send SMS campaign
- `brevo_get_sms_campaign_report` - Get report

### CRM Deals Tools

- `brevo_list_deals` - List deals
- `brevo_get_deal` - Get deal
- `brevo_create_deal` - Create deal
- `brevo_update_deal` - Update deal
- `brevo_delete_deal` - Delete deal
- `brevo_list_pipelines` - List pipelines
- `brevo_list_deal_stages` - List stages

### Webhook Tools

- `brevo_list_webhooks` - List webhooks
- `brevo_get_webhook` - Get webhook
- `brevo_create_webhook` - Create webhook
- `brevo_update_webhook` - Update webhook
- `brevo_delete_webhook` - Delete webhook

## MCP Apps

All apps are accessible via MCP resources at `brevo://app/{app-name}`

### Contact Apps
- `contact-dashboard` - Metrics and overview
- `contact-detail` - Full contact profile
- `contact-grid` - Searchable contact table

### Campaign Apps
- `campaign-dashboard` - Campaign analytics
- `campaign-builder` - Visual campaign creator

### Other Apps
- `automation-dashboard` - Workflow management
- `transactional-monitor` - Real-time event tracking
- `email-template-gallery` - Template browser
- `sms-dashboard` - SMS management
- `deal-pipeline` - CRM pipeline view
- `list-manager` - List organization
- `report-dashboard` - Analytics hub
- `webhook-manager` - Webhook configuration
- `import-wizard` - Contact import tool

## Architecture

```
brevo/
├── src/
│   ├── types/
│   │   ├── index.ts           # TypeScript interfaces
│   │   └── api-client.ts      # Brevo API client
│   ├── tools/
│   │   ├── contacts-tools.ts   # 12 contact tools
│   │   ├── campaigns-tools.ts  # 9 campaign tools
│   │   ├── transactional-tools.ts # 4 transactional tools
│   │   ├── lists-tools.ts      # 7 list tools
│   │   ├── senders-tools.ts    # 6 sender tools
│   │   ├── templates-tools.ts  # 6 template tools
│   │   ├── automations-tools.ts # 5 automation tools
│   │   ├── sms-tools.ts        # 6 SMS tools
│   │   ├── deals-tools.ts      # 7 CRM tools
│   │   └── webhooks-tools.ts   # 5 webhook tools
│   ├── apps/
│   │   ├── contact-dashboard.ts
│   │   ├── contact-detail.ts
│   │   ├── contact-grid.ts
│   │   ├── campaign-dashboard.ts
│   │   ├── campaign-builder.ts
│   │   ├── automation-dashboard.ts
│   │   ├── deal-pipeline.ts
│   │   ├── transactional-monitor.ts
│   │   ├── template-gallery.ts
│   │   ├── sms-dashboard.ts
│   │   ├── list-manager.ts
│   │   ├── report-dashboard.ts
│   │   ├── webhook-manager.ts
│   │   └── import-wizard.ts
│   ├── server.ts              # MCP server implementation
│   └── main.ts                # Entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode (watch)
npm run dev

# Clean build artifacts
npm run clean
```

## API Documentation

Brevo API v3 Documentation: https://developers.brevo.com/reference

## License

MIT

## Support

For issues and feature requests, please file an issue in the repository.

## Related Projects

- [Brevo API Documentation](https://developers.brevo.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
