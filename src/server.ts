/**
 * Brevo MCP Server
 * Provides comprehensive tools for Brevo email marketing, SMS, CRM, and automation
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { BrevoAPIClient } from './api-client.js';

const API_KEY = process.env.BREVO_API_KEY;
if (!API_KEY) {
  throw new Error('BREVO_API_KEY environment variable is required');
}

const client = new BrevoAPIClient({ apiKey: API_KEY });
const server = new Server(
  {
    name: 'brevo-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ============================================================================
// TOOL DEFINITIONS
// ============================================================================

const tools: Tool[] = [
  // CONTACTS (8 tools)
  {
    name: 'brevo_get_contact',
    description: 'Get a contact by email or ID',
    inputSchema: {
      type: 'object',
      properties: {
        identifier: { type: 'string', description: 'Contact email or ID' },
      },
      required: ['identifier'],
    },
  },
  {
    name: 'brevo_create_contact',
    description: 'Create a new contact',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Contact email address' },
        attributes: { type: 'object', description: 'Contact attributes (firstName, lastName, etc.)' },
        listIds: { type: 'array', items: { type: 'number' }, description: 'List IDs to add contact to' },
        emailBlacklisted: { type: 'boolean', description: 'Whether email is blacklisted' },
        smsBlacklisted: { type: 'boolean', description: 'Whether SMS is blacklisted' },
        updateEnabled: { type: 'boolean', description: 'Update if exists' },
      },
      required: ['email'],
    },
  },
  {
    name: 'brevo_update_contact',
    description: 'Update an existing contact',
    inputSchema: {
      type: 'object',
      properties: {
        identifier: { type: 'string', description: 'Contact email or ID' },
        attributes: { type: 'object', description: 'Contact attributes to update' },
        listIds: { type: 'array', items: { type: 'number' }, description: 'List IDs to add contact to' },
        unlinkListIds: { type: 'array', items: { type: 'number' }, description: 'List IDs to remove contact from' },
        emailBlacklisted: { type: 'boolean', description: 'Whether email is blacklisted' },
        smsBlacklisted: { type: 'boolean', description: 'Whether SMS is blacklisted' },
      },
      required: ['identifier'],
    },
  },
  {
    name: 'brevo_delete_contact',
    description: 'Delete a contact',
    inputSchema: {
      type: 'object',
      properties: {
        identifier: { type: 'string', description: 'Contact email or ID' },
      },
      required: ['identifier'],
    },
  },
  {
    name: 'brevo_list_contacts',
    description: 'List all contacts with pagination',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of contacts to return (max 50)' },
        offset: { type: 'number', description: 'Offset for pagination' },
        modifiedSince: { type: 'string', description: 'Filter by modified date (ISO 8601)' },
        listIds: { type: 'array', items: { type: 'number' }, description: 'Filter by list IDs' },
        sort: { type: 'string', description: 'Sort order (asc/desc)' },
      },
    },
  },
  {
    name: 'brevo_import_contacts',
    description: 'Import contacts from file or URL',
    inputSchema: {
      type: 'object',
      properties: {
        fileUrl: { type: 'string', description: 'URL of CSV file to import' },
        listIds: { type: 'array', items: { type: 'number' }, description: 'List IDs to add contacts to' },
        notifyUrl: { type: 'string', description: 'Webhook URL for import completion' },
        updateExistingContacts: { type: 'boolean', description: 'Update existing contacts' },
        emailBlacklist: { type: 'boolean', description: 'Import blacklisted emails' },
        smsBlacklist: { type: 'boolean', description: 'Import blacklisted SMS' },
      },
    },
  },
  {
    name: 'brevo_export_contacts',
    description: 'Export contacts to CSV',
    inputSchema: {
      type: 'object',
      properties: {
        exportAttributes: { type: 'array', items: { type: 'string' }, description: 'Attributes to export' },
        filter: { type: 'object', description: 'Filter criteria for export' },
        notifyUrl: { type: 'string', description: 'Webhook URL for export completion' },
      },
    },
  },
  {
    name: 'brevo_get_contact_stats',
    description: 'Get campaign statistics for a contact',
    inputSchema: {
      type: 'object',
      properties: {
        identifier: { type: 'string', description: 'Contact email or ID' },
      },
      required: ['identifier'],
    },
  },

  // LISTS (7 tools)
  {
    name: 'brevo_list_contact_lists',
    description: 'Get all contact lists',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of lists to return' },
        offset: { type: 'number', description: 'Offset for pagination' },
        sort: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'brevo_get_contact_list',
    description: 'Get a specific contact list',
    inputSchema: {
      type: 'object',
      properties: {
        listId: { type: 'number', description: 'List ID' },
      },
      required: ['listId'],
    },
  },
  {
    name: 'brevo_create_contact_list',
    description: 'Create a new contact list',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'List name' },
        folderId: { type: 'number', description: 'Folder ID to organize list' },
      },
      required: ['name'],
    },
  },
  {
    name: 'brevo_update_contact_list',
    description: 'Update a contact list',
    inputSchema: {
      type: 'object',
      properties: {
        listId: { type: 'number', description: 'List ID' },
        name: { type: 'string', description: 'New list name' },
        folderId: { type: 'number', description: 'New folder ID' },
      },
      required: ['listId'],
    },
  },
  {
    name: 'brevo_delete_contact_list',
    description: 'Delete a contact list',
    inputSchema: {
      type: 'object',
      properties: {
        listId: { type: 'number', description: 'List ID' },
      },
      required: ['listId'],
    },
  },
  {
    name: 'brevo_add_contact_to_list',
    description: 'Add contacts to a list',
    inputSchema: {
      type: 'object',
      properties: {
        listId: { type: 'number', description: 'List ID' },
        emails: { type: 'array', items: { type: 'string' }, description: 'Contact emails to add' },
      },
      required: ['listId', 'emails'],
    },
  },
  {
    name: 'brevo_remove_contact_from_list',
    description: 'Remove contacts from a list',
    inputSchema: {
      type: 'object',
      properties: {
        listId: { type: 'number', description: 'List ID' },
        emails: { type: 'array', items: { type: 'string' }, description: 'Contact emails to remove' },
      },
      required: ['listId', 'emails'],
    },
  },

  // FOLDERS (4 tools)
  {
    name: 'brevo_list_folders',
    description: 'Get all contact folders',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of folders to return' },
        offset: { type: 'number', description: 'Offset for pagination' },
      },
    },
  },
  {
    name: 'brevo_create_folder',
    description: 'Create a new folder',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Folder name' },
      },
      required: ['name'],
    },
  },
  {
    name: 'brevo_update_folder',
    description: 'Update a folder',
    inputSchema: {
      type: 'object',
      properties: {
        folderId: { type: 'number', description: 'Folder ID' },
        name: { type: 'string', description: 'New folder name' },
      },
      required: ['folderId', 'name'],
    },
  },
  {
    name: 'brevo_delete_folder',
    description: 'Delete a folder',
    inputSchema: {
      type: 'object',
      properties: {
        folderId: { type: 'number', description: 'Folder ID' },
      },
      required: ['folderId'],
    },
  },

  // EMAIL CAMPAIGNS (9 tools)
  {
    name: 'brevo_list_email_campaigns',
    description: 'Get all email campaigns',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['classic', 'trigger'], description: 'Campaign type' },
        status: { type: 'string', enum: ['draft', 'sent', 'queued', 'suspended', 'archive'], description: 'Campaign status' },
        limit: { type: 'number', description: 'Number of campaigns to return' },
        offset: { type: 'number', description: 'Offset for pagination' },
        sort: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'brevo_get_email_campaign',
    description: 'Get a specific email campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'brevo_create_email_campaign',
    description: 'Create a new email campaign',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Campaign name' },
        subject: { type: 'string', description: 'Email subject' },
        sender: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' } }, description: 'Sender details' },
        htmlContent: { type: 'string', description: 'HTML content of email' },
        htmlUrl: { type: 'string', description: 'URL to HTML content' },
        scheduledAt: { type: 'string', description: 'Schedule date/time (ISO 8601)' },
        recipients: {
          type: 'object',
          properties: {
            listIds: { type: 'array', items: { type: 'number' } },
            exclusionListIds: { type: 'array', items: { type: 'number' } },
          },
          description: 'Recipient lists',
        },
        replyTo: { type: 'string', description: 'Reply-to email' },
        tag: { type: 'string', description: 'Campaign tag' },
      },
      required: ['name', 'subject', 'sender'],
    },
  },
  {
    name: 'brevo_update_email_campaign',
    description: 'Update an email campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
        name: { type: 'string', description: 'Campaign name' },
        subject: { type: 'string', description: 'Email subject' },
        htmlContent: { type: 'string', description: 'HTML content' },
        scheduledAt: { type: 'string', description: 'Schedule date/time' },
        recipients: { type: 'object', description: 'Recipient lists' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'brevo_delete_email_campaign',
    description: 'Delete an email campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'brevo_send_email_campaign',
    description: 'Send an email campaign immediately',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'brevo_send_test_email',
    description: 'Send test email for a campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
        emailTo: { type: 'array', items: { type: 'string' }, description: 'Test recipient emails' },
      },
      required: ['campaignId', 'emailTo'],
    },
  },
  {
    name: 'brevo_update_email_campaign_status',
    description: 'Update email campaign status',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
        status: { type: 'string', enum: ['draft', 'suspended', 'archive'], description: 'New status' },
      },
      required: ['campaignId', 'status'],
    },
  },
  {
    name: 'brevo_get_email_campaign_report',
    description: 'Get email campaign statistics and report',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
      },
      required: ['campaignId'],
    },
  },

  // TRANSACTIONAL EMAIL (6 tools)
  {
    name: 'brevo_send_transactional_email',
    description: 'Send a transactional email',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              name: { type: 'string' },
            },
          },
          description: 'Recipients',
        },
        sender: { type: 'object', properties: { email: { type: 'string' }, name: { type: 'string' } }, description: 'Sender' },
        subject: { type: 'string', description: 'Email subject' },
        htmlContent: { type: 'string', description: 'HTML content' },
        textContent: { type: 'string', description: 'Plain text content' },
        templateId: { type: 'number', description: 'Template ID to use' },
        params: { type: 'object', description: 'Template parameters' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Email tags' },
        scheduledAt: { type: 'string', description: 'Schedule time (ISO 8601)' },
      },
      required: ['to'],
    },
  },
  {
    name: 'brevo_get_transactional_email',
    description: 'Get transactional email by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Email UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'brevo_get_transactional_email_events',
    description: 'Get transactional email events',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Filter by email' },
        templateId: { type: 'number', description: 'Filter by template ID' },
        messageId: { type: 'string', description: 'Filter by message ID' },
        event: { type: 'string', description: 'Filter by event type' },
        tags: { type: 'string', description: 'Filter by tags' },
        days: { type: 'number', description: 'Number of days to look back' },
        limit: { type: 'number', description: 'Results limit' },
        offset: { type: 'number', description: 'Pagination offset' },
      },
    },
  },
  {
    name: 'brevo_get_transactional_email_stats',
    description: 'Get aggregated transactional email statistics',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        days: { type: 'number', description: 'Number of days' },
        tag: { type: 'string', description: 'Filter by tag' },
      },
    },
  },
  {
    name: 'brevo_block_email_domain',
    description: 'Block an email domain',
    inputSchema: {
      type: 'object',
      properties: {
        domain: { type: 'string', description: 'Domain to block' },
      },
      required: ['domain'],
    },
  },
  {
    name: 'brevo_unblock_email_domain',
    description: 'Unblock an email domain',
    inputSchema: {
      type: 'object',
      properties: {
        domain: { type: 'string', description: 'Domain to unblock' },
      },
      required: ['domain'],
    },
  },

  // EMAIL TEMPLATES (6 tools)
  {
    name: 'brevo_list_email_templates',
    description: 'Get all email templates',
    inputSchema: {
      type: 'object',
      properties: {
        templateStatus: { type: 'boolean', description: 'Filter by active status' },
        limit: { type: 'number', description: 'Results limit' },
        offset: { type: 'number', description: 'Pagination offset' },
      },
    },
  },
  {
    name: 'brevo_get_email_template',
    description: 'Get a specific email template',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: { type: 'number', description: 'Template ID' },
      },
      required: ['templateId'],
    },
  },
  {
    name: 'brevo_create_email_template',
    description: 'Create a new email template',
    inputSchema: {
      type: 'object',
      properties: {
        templateName: { type: 'string', description: 'Template name' },
        subject: { type: 'string', description: 'Email subject' },
        sender: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' } }, description: 'Sender' },
        htmlContent: { type: 'string', description: 'HTML content' },
        htmlUrl: { type: 'string', description: 'URL to HTML content' },
        isActive: { type: 'boolean', description: 'Is template active' },
        tag: { type: 'string', description: 'Template tag' },
      },
      required: ['templateName', 'subject', 'sender'],
    },
  },
  {
    name: 'brevo_update_email_template',
    description: 'Update an email template',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: { type: 'number', description: 'Template ID' },
        templateName: { type: 'string', description: 'Template name' },
        subject: { type: 'string', description: 'Email subject' },
        htmlContent: { type: 'string', description: 'HTML content' },
        isActive: { type: 'boolean', description: 'Is template active' },
      },
      required: ['templateId'],
    },
  },
  {
    name: 'brevo_delete_email_template',
    description: 'Delete an email template',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: { type: 'number', description: 'Template ID' },
      },
      required: ['templateId'],
    },
  },
  {
    name: 'brevo_send_test_template',
    description: 'Send test email using a template',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: { type: 'number', description: 'Template ID' },
        emailTo: { type: 'array', items: { type: 'string' }, description: 'Test recipient emails' },
      },
      required: ['templateId', 'emailTo'],
    },
  },

  // SENDERS (4 tools)
  {
    name: 'brevo_list_senders',
    description: 'Get all senders',
    inputSchema: {
      type: 'object',
      properties: {
        ip: { type: 'string', description: 'Filter by IP' },
        domain: { type: 'string', description: 'Filter by domain' },
      },
    },
  },
  {
    name: 'brevo_create_sender',
    description: 'Create a new sender',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Sender name' },
        email: { type: 'string', description: 'Sender email' },
      },
      required: ['name', 'email'],
    },
  },
  {
    name: 'brevo_update_sender',
    description: 'Update a sender',
    inputSchema: {
      type: 'object',
      properties: {
        senderId: { type: 'number', description: 'Sender ID' },
        name: { type: 'string', description: 'Sender name' },
        email: { type: 'string', description: 'Sender email' },
      },
      required: ['senderId'],
    },
  },
  {
    name: 'brevo_delete_sender',
    description: 'Delete a sender',
    inputSchema: {
      type: 'object',
      properties: {
        senderId: { type: 'number', description: 'Sender ID' },
      },
      required: ['senderId'],
    },
  },

  // SMS (8 tools)
  {
    name: 'brevo_send_transactional_sms',
    description: 'Send a transactional SMS',
    inputSchema: {
      type: 'object',
      properties: {
        sender: { type: 'string', description: 'Sender name/number (max 11 chars)' },
        recipient: { type: 'string', description: 'Recipient phone number (E.164 format)' },
        content: { type: 'string', description: 'SMS content' },
        type: { type: 'string', enum: ['transactional', 'marketing'], description: 'SMS type' },
        tag: { type: 'string', description: 'SMS tag' },
        webUrl: { type: 'string', description: 'Webhook URL for delivery status' },
      },
      required: ['sender', 'recipient', 'content'],
    },
  },
  {
    name: 'brevo_get_transactional_sms_events',
    description: 'Get transactional SMS events',
    inputSchema: {
      type: 'object',
      properties: {
        phoneNumber: { type: 'string', description: 'Filter by phone number' },
        event: { type: 'string', description: 'Filter by event type' },
        tags: { type: 'string', description: 'Filter by tags' },
        days: { type: 'number', description: 'Number of days' },
        limit: { type: 'number', description: 'Results limit' },
        offset: { type: 'number', description: 'Pagination offset' },
      },
    },
  },
  {
    name: 'brevo_get_transactional_sms_stats',
    description: 'Get aggregated SMS statistics',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        days: { type: 'number', description: 'Number of days' },
        tag: { type: 'string', description: 'Filter by tag' },
      },
    },
  },
  {
    name: 'brevo_list_sms_campaigns',
    description: 'Get all SMS campaigns',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['draft', 'sent', 'queued', 'suspended', 'inProgress'], description: 'Filter by status' },
        limit: { type: 'number', description: 'Results limit' },
        offset: { type: 'number', description: 'Pagination offset' },
      },
    },
  },
  {
    name: 'brevo_get_sms_campaign',
    description: 'Get a specific SMS campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'brevo_create_sms_campaign',
    description: 'Create a new SMS campaign',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Campaign name' },
        sender: { type: 'string', description: 'Sender name/number' },
        content: { type: 'string', description: 'SMS content' },
        recipients: {
          type: 'object',
          properties: {
            listIds: { type: 'array', items: { type: 'number' } },
            exclusionListIds: { type: 'array', items: { type: 'number' } },
          },
          description: 'Recipient lists',
        },
        scheduledAt: { type: 'string', description: 'Schedule time (ISO 8601)' },
      },
      required: ['name', 'sender', 'content'],
    },
  },
  {
    name: 'brevo_update_sms_campaign',
    description: 'Update an SMS campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
        name: { type: 'string', description: 'Campaign name' },
        content: { type: 'string', description: 'SMS content' },
        scheduledAt: { type: 'string', description: 'Schedule time' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'brevo_send_sms_campaign',
    description: 'Send SMS campaign immediately',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
      },
      required: ['campaignId'],
    },
  },

  // CRM - DEALS (5 tools)
  {
    name: 'brevo_list_deals',
    description: 'Get all CRM deals',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Results limit' },
        offset: { type: 'number', description: 'Pagination offset' },
        sort: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'brevo_get_deal',
    description: 'Get a specific deal',
    inputSchema: {
      type: 'object',
      properties: {
        dealId: { type: 'string', description: 'Deal ID' },
      },
      required: ['dealId'],
    },
  },
  {
    name: 'brevo_create_deal',
    description: 'Create a new deal',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Deal name' },
        attributes: { type: 'object', description: 'Deal attributes (amount, pipeline, stage, etc.)' },
        linkedContactsIds: { type: 'array', items: { type: 'number' }, description: 'Linked contact IDs' },
        linkedCompaniesIds: { type: 'array', items: { type: 'string' }, description: 'Linked company IDs' },
      },
      required: ['name'],
    },
  },
  {
    name: 'brevo_update_deal',
    description: 'Update a deal',
    inputSchema: {
      type: 'object',
      properties: {
        dealId: { type: 'string', description: 'Deal ID' },
        name: { type: 'string', description: 'Deal name' },
        attributes: { type: 'object', description: 'Deal attributes' },
      },
      required: ['dealId'],
    },
  },
  {
    name: 'brevo_delete_deal',
    description: 'Delete a deal',
    inputSchema: {
      type: 'object',
      properties: {
        dealId: { type: 'string', description: 'Deal ID' },
      },
      required: ['dealId'],
    },
  },

  // CRM - COMPANIES (5 tools)
  {
    name: 'brevo_list_companies',
    description: 'Get all CRM companies',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Results limit' },
        offset: { type: 'number', description: 'Pagination offset' },
        sort: { type: 'string', description: 'Sort order' },
      },
    },
  },
  {
    name: 'brevo_get_company',
    description: 'Get a specific company',
    inputSchema: {
      type: 'object',
      properties: {
        companyId: { type: 'string', description: 'Company ID' },
      },
      required: ['companyId'],
    },
  },
  {
    name: 'brevo_create_company',
    description: 'Create a new company',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Company name' },
        attributes: { type: 'object', description: 'Company attributes' },
        linkedContactsIds: { type: 'array', items: { type: 'number' }, description: 'Linked contact IDs' },
      },
      required: ['name'],
    },
  },
  {
    name: 'brevo_update_company',
    description: 'Update a company',
    inputSchema: {
      type: 'object',
      properties: {
        companyId: { type: 'string', description: 'Company ID' },
        name: { type: 'string', description: 'Company name' },
        attributes: { type: 'object', description: 'Company attributes' },
      },
      required: ['companyId'],
    },
  },
  {
    name: 'brevo_delete_company',
    description: 'Delete a company',
    inputSchema: {
      type: 'object',
      properties: {
        companyId: { type: 'string', description: 'Company ID' },
      },
      required: ['companyId'],
    },
  },

  // CRM - TASKS (5 tools)
  {
    name: 'brevo_list_tasks',
    description: 'Get all CRM tasks',
    inputSchema: {
      type: 'object',
      properties: {
        filterType: { type: 'string', enum: ['contacts', 'companies', 'deals'], description: 'Filter by entity type' },
        filterId: { type: 'string', description: 'Entity ID to filter by' },
        limit: { type: 'number', description: 'Results limit' },
        offset: { type: 'number', description: 'Pagination offset' },
      },
    },
  },
  {
    name: 'brevo_get_task',
    description: 'Get a specific task',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'Task ID' },
      },
      required: ['taskId'],
    },
  },
  {
    name: 'brevo_create_task',
    description: 'Create a new task',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Task name' },
        taskTypeId: { type: 'string', description: 'Task type ID' },
        date: { type: 'string', description: 'Task date (ISO 8601)' },
        duration: { type: 'number', description: 'Duration in minutes' },
        notes: { type: 'string', description: 'Task notes' },
        done: { type: 'boolean', description: 'Is task done' },
        assignToId: { type: 'string', description: 'User ID to assign to' },
        contactsIds: { type: 'array', items: { type: 'number' }, description: 'Linked contact IDs' },
        dealsIds: { type: 'array', items: { type: 'string' }, description: 'Linked deal IDs' },
        companiesIds: { type: 'array', items: { type: 'string' }, description: 'Linked company IDs' },
      },
      required: ['name', 'taskTypeId', 'date', 'assignToId'],
    },
  },
  {
    name: 'brevo_update_task',
    description: 'Update a task',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'Task ID' },
        name: { type: 'string', description: 'Task name' },
        date: { type: 'string', description: 'Task date' },
        done: { type: 'boolean', description: 'Is task done' },
        notes: { type: 'string', description: 'Task notes' },
      },
      required: ['taskId'],
    },
  },
  {
    name: 'brevo_delete_task',
    description: 'Delete a task',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'Task ID' },
      },
      required: ['taskId'],
    },
  },

  // WEBHOOKS (4 tools)
  {
    name: 'brevo_list_webhooks',
    description: 'Get all webhooks',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['marketing', 'transactional', 'inbound'], description: 'Filter by webhook type' },
      },
    },
  },
  {
    name: 'brevo_create_webhook',
    description: 'Create a new webhook',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Webhook URL' },
        description: { type: 'string', description: 'Webhook description' },
        events: {
          type: 'array',
          items: { type: 'string' },
          description: 'Events to subscribe to (e.g., request, delivered, hardBounce, opened, click)',
        },
        type: { type: 'string', enum: ['transactional', 'marketing', 'inbound'], description: 'Webhook type' },
      },
      required: ['url', 'events'],
    },
  },
  {
    name: 'brevo_update_webhook',
    description: 'Update a webhook',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'number', description: 'Webhook ID' },
        url: { type: 'string', description: 'Webhook URL' },
        description: { type: 'string', description: 'Webhook description' },
        events: { type: 'array', items: { type: 'string' }, description: 'Events to subscribe to' },
      },
      required: ['webhookId'],
    },
  },
  {
    name: 'brevo_delete_webhook',
    description: 'Delete a webhook',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'number', description: 'Webhook ID' },
      },
      required: ['webhookId'],
    },
  },

  // ACCOUNT & MISC (3 tools)
  {
    name: 'brevo_get_account',
    description: 'Get account information including plan and credits',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'brevo_get_process',
    description: 'Get status of an import/export process',
    inputSchema: {
      type: 'object',
      properties: {
        processId: { type: 'number', description: 'Process ID' },
      },
      required: ['processId'],
    },
  },
  {
    name: 'brevo_create_doi_contact',
    description: 'Create double opt-in (DOI) contact subscription',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Contact email' },
        attributes: { type: 'object', description: 'Contact attributes' },
        includeListIds: { type: 'array', items: { type: 'number' }, description: 'Lists to subscribe to' },
        templateId: { type: 'number', description: 'DOI template ID' },
        redirectionUrl: { type: 'string', description: 'Redirect URL after confirmation' },
      },
      required: ['email', 'includeListIds', 'templateId', 'redirectionUrl'],
    },
  },
];

// ============================================================================
// TOOL HANDLERS
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // CONTACTS
    if (name === 'brevo_get_contact') {
      const result = await client.getContact(args.identifier as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_contact') {
      const result = await client.createContact(args as any);
      return { content: [{ type: 'text', text: `Contact created with ID: ${result.id}` }] };
    }
    if (name === 'brevo_update_contact') {
      const { identifier, ...params } = args;
      await client.updateContact(identifier as string, params as any);
      return { content: [{ type: 'text', text: 'Contact updated successfully' }] };
    }
    if (name === 'brevo_delete_contact') {
      await client.deleteContact(args.identifier as string);
      return { content: [{ type: 'text', text: 'Contact deleted successfully' }] };
    }
    if (name === 'brevo_list_contacts') {
      const result = await client.getContacts(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_import_contacts') {
      const result = await client.importContacts(args as any);
      return { content: [{ type: 'text', text: `Import started with process ID: ${result.processId}` }] };
    }
    if (name === 'brevo_export_contacts') {
      const result = await client.exportContacts(args as any);
      return { content: [{ type: 'text', text: `Export started with ID: ${result.exportId}` }] };
    }
    if (name === 'brevo_get_contact_stats') {
      const result = await client.getContactStats(args.identifier as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // LISTS
    if (name === 'brevo_list_contact_lists') {
      const result = await client.getLists(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_get_contact_list') {
      const result = await client.getList(args.listId as number);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_contact_list') {
      const result = await client.createList(args as any);
      return { content: [{ type: 'text', text: `List created with ID: ${result.id}` }] };
    }
    if (name === 'brevo_update_contact_list') {
      const { listId, ...params } = args;
      await client.updateList(listId as number, params as any);
      return { content: [{ type: 'text', text: 'List updated successfully' }] };
    }
    if (name === 'brevo_delete_contact_list') {
      await client.deleteList(args.listId as number);
      return { content: [{ type: 'text', text: 'List deleted successfully' }] };
    }
    if (name === 'brevo_add_contact_to_list') {
      const result = await client.addContactToList(args.listId as number, args.emails as string[]);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_remove_contact_from_list') {
      const result = await client.removeContactFromList(args.listId as number, args.emails as string[]);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // FOLDERS
    if (name === 'brevo_list_folders') {
      const result = await client.getFolders(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_folder') {
      const result = await client.createFolder(args as any);
      return { content: [{ type: 'text', text: `Folder created with ID: ${result.id}` }] };
    }
    if (name === 'brevo_update_folder') {
      const { folderId, name } = args;
      await client.updateFolder(folderId as number, { name: name as string });
      return { content: [{ type: 'text', text: 'Folder updated successfully' }] };
    }
    if (name === 'brevo_delete_folder') {
      await client.deleteFolder(args.folderId as number);
      return { content: [{ type: 'text', text: 'Folder deleted successfully' }] };
    }

    // EMAIL CAMPAIGNS
    if (name === 'brevo_list_email_campaigns') {
      const result = await client.getEmailCampaigns(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_get_email_campaign') {
      const result = await client.getEmailCampaign(args.campaignId as number);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_email_campaign') {
      const result = await client.createEmailCampaign(args as any);
      return { content: [{ type: 'text', text: `Campaign created with ID: ${result.id}` }] };
    }
    if (name === 'brevo_update_email_campaign') {
      const { campaignId, ...params } = args;
      await client.updateEmailCampaign(campaignId as number, params as any);
      return { content: [{ type: 'text', text: 'Campaign updated successfully' }] };
    }
    if (name === 'brevo_delete_email_campaign') {
      await client.deleteEmailCampaign(args.campaignId as number);
      return { content: [{ type: 'text', text: 'Campaign deleted successfully' }] };
    }
    if (name === 'brevo_send_email_campaign') {
      await client.sendEmailCampaignNow(args.campaignId as number);
      return { content: [{ type: 'text', text: 'Campaign sent successfully' }] };
    }
    if (name === 'brevo_send_test_email') {
      await client.sendTestEmail(args.campaignId as number, args.emailTo as string[]);
      return { content: [{ type: 'text', text: 'Test email sent successfully' }] };
    }
    if (name === 'brevo_update_email_campaign_status') {
      await client.updateEmailCampaignStatus(args.campaignId as number, args.status as any);
      return { content: [{ type: 'text', text: 'Campaign status updated successfully' }] };
    }
    if (name === 'brevo_get_email_campaign_report') {
      const result = await client.getEmailCampaignReport(args.campaignId as number);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // TRANSACTIONAL EMAIL
    if (name === 'brevo_send_transactional_email') {
      const result = await client.sendTransacEmail(args as any);
      return { content: [{ type: 'text', text: `Email sent with message ID: ${result.messageId}` }] };
    }
    if (name === 'brevo_get_transactional_email') {
      const result = await client.getTransacEmailContent(args.uuid as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_get_transactional_email_events') {
      const result = await client.getTransacEmailEvents(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_get_transactional_email_stats') {
      const result = await client.getTransacEmailStats(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_block_email_domain') {
      await client.blockDomain(args.domain as string);
      return { content: [{ type: 'text', text: 'Domain blocked successfully' }] };
    }
    if (name === 'brevo_unblock_email_domain') {
      await client.unblockDomain(args.domain as string);
      return { content: [{ type: 'text', text: 'Domain unblocked successfully' }] };
    }

    // EMAIL TEMPLATES
    if (name === 'brevo_list_email_templates') {
      const result = await client.getEmailTemplates(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_get_email_template') {
      const result = await client.getEmailTemplate(args.templateId as number);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_email_template') {
      const result = await client.createEmailTemplate(args as any);
      return { content: [{ type: 'text', text: `Template created with ID: ${result.id}` }] };
    }
    if (name === 'brevo_update_email_template') {
      const { templateId, ...params } = args;
      await client.updateEmailTemplate(templateId as number, params as any);
      return { content: [{ type: 'text', text: 'Template updated successfully' }] };
    }
    if (name === 'brevo_delete_email_template') {
      await client.deleteEmailTemplate(args.templateId as number);
      return { content: [{ type: 'text', text: 'Template deleted successfully' }] };
    }
    if (name === 'brevo_send_test_template') {
      await client.sendTestEmailTemplate(args.templateId as number, { emailTo: args.emailTo as string[] });
      return { content: [{ type: 'text', text: 'Test template email sent successfully' }] };
    }

    // SENDERS
    if (name === 'brevo_list_senders') {
      const result = await client.getSenders(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_sender') {
      const result = await client.createSender(args as any);
      return { content: [{ type: 'text', text: `Sender created with ID: ${result.id}` }] };
    }
    if (name === 'brevo_update_sender') {
      const { senderId, ...params } = args;
      await client.updateSender(senderId as number, params as any);
      return { content: [{ type: 'text', text: 'Sender updated successfully' }] };
    }
    if (name === 'brevo_delete_sender') {
      await client.deleteSender(args.senderId as number);
      return { content: [{ type: 'text', text: 'Sender deleted successfully' }] };
    }

    // SMS
    if (name === 'brevo_send_transactional_sms') {
      const result = await client.sendTransacSms(args as any);
      return { content: [{ type: 'text', text: `SMS sent. Message ID: ${result.messageId}, Used credits: ${result.usedCredits}` }] };
    }
    if (name === 'brevo_get_transactional_sms_events') {
      const result = await client.getTransacSmsEvents(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_get_transactional_sms_stats') {
      const result = await client.getTransacSmsStats(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_list_sms_campaigns') {
      const result = await client.getSmsCampaigns(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_get_sms_campaign') {
      const result = await client.getSmsCampaign(args.campaignId as number);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_sms_campaign') {
      const result = await client.createSmsCampaign(args as any);
      return { content: [{ type: 'text', text: `SMS campaign created with ID: ${result.id}` }] };
    }
    if (name === 'brevo_update_sms_campaign') {
      const { campaignId, ...params } = args;
      await client.updateSmsCampaign(campaignId as number, params as any);
      return { content: [{ type: 'text', text: 'SMS campaign updated successfully' }] };
    }
    if (name === 'brevo_send_sms_campaign') {
      await client.sendSmsCampaignNow(args.campaignId as number);
      return { content: [{ type: 'text', text: 'SMS campaign sent successfully' }] };
    }

    // CRM - DEALS
    if (name === 'brevo_list_deals') {
      const result = await client.getDeals(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_get_deal') {
      const result = await client.getDeal(args.dealId as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_deal') {
      const result = await client.createDeal(args as any);
      return { content: [{ type: 'text', text: `Deal created with ID: ${result.id}` }] };
    }
    if (name === 'brevo_update_deal') {
      const { dealId, ...params } = args;
      await client.updateDeal(dealId as string, params as any);
      return { content: [{ type: 'text', text: 'Deal updated successfully' }] };
    }
    if (name === 'brevo_delete_deal') {
      await client.deleteDeal(args.dealId as string);
      return { content: [{ type: 'text', text: 'Deal deleted successfully' }] };
    }

    // CRM - COMPANIES
    if (name === 'brevo_list_companies') {
      const result = await client.getCompanies(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_get_company') {
      const result = await client.getCompany(args.companyId as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_company') {
      const result = await client.createCompany(args as any);
      return { content: [{ type: 'text', text: `Company created with ID: ${result.id}` }] };
    }
    if (name === 'brevo_update_company') {
      const { companyId, ...params } = args;
      await client.updateCompany(companyId as string, params as any);
      return { content: [{ type: 'text', text: 'Company updated successfully' }] };
    }
    if (name === 'brevo_delete_company') {
      await client.deleteCompany(args.companyId as string);
      return { content: [{ type: 'text', text: 'Company deleted successfully' }] };
    }

    // CRM - TASKS
    if (name === 'brevo_list_tasks') {
      const result = await client.getTasks(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_get_task') {
      const result = await client.getTask(args.taskId as string);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_task') {
      const result = await client.createTask(args as any);
      return { content: [{ type: 'text', text: `Task created with ID: ${result.id}` }] };
    }
    if (name === 'brevo_update_task') {
      const { taskId, ...params } = args;
      await client.updateTask(taskId as string, params as any);
      return { content: [{ type: 'text', text: 'Task updated successfully' }] };
    }
    if (name === 'brevo_delete_task') {
      await client.deleteTask(args.taskId as string);
      return { content: [{ type: 'text', text: 'Task deleted successfully' }] };
    }

    // WEBHOOKS
    if (name === 'brevo_list_webhooks') {
      const result = await client.getWebhooks(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_webhook') {
      const result = await client.createWebhook(args as any);
      return { content: [{ type: 'text', text: `Webhook created with ID: ${result.id}` }] };
    }
    if (name === 'brevo_update_webhook') {
      const { webhookId, ...params } = args;
      await client.updateWebhook(webhookId as number, params as any);
      return { content: [{ type: 'text', text: 'Webhook updated successfully' }] };
    }
    if (name === 'brevo_delete_webhook') {
      await client.deleteWebhook(args.webhookId as number);
      return { content: [{ type: 'text', text: 'Webhook deleted successfully' }] };
    }

    // ACCOUNT & MISC
    if (name === 'brevo_get_account') {
      const result = await client.getAccount();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_get_process') {
      const result = await client.getProcess(args.processId as number);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    if (name === 'brevo_create_doi_contact') {
      await client.createDoiContact(args as any);
      return { content: [{ type: 'text', text: 'DOI contact created successfully. Confirmation email sent.' }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// ============================================================================
// RESOURCES
// ============================================================================

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'brevo://account',
      name: 'Account Information',
      description: 'Current Brevo account details, plan, and credits',
      mimeType: 'application/json',
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'brevo://account') {
    const account = await client.getAccount();
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(account, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

export async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Brevo MCP Server running on stdio');
}
