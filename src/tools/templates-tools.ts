import { z } from 'zod';
import { BrevoApiClient } from '../types/api-client.js';
import { EmailTemplate } from '../types/index.js';

export function createTemplatesTools(client: BrevoApiClient) {
  return [
    {
      name: 'brevo_list_templates',
      description: 'List all email templates',
      inputSchema: z.object({
        limit: z.number().optional().describe('Number of templates (default: 50)'),
        offset: z.number().optional().describe('Pagination offset'),
        sort: z.enum(['asc', 'desc']).optional().describe('Sort by creation date'),
      }),
      execute: async (args: any) => {
        const result = await client.getPaginated<EmailTemplate>('/smtp/templates', {
          limit: args.limit || 50,
          offset: args.offset || 0,
          sort: args.sort,
        });
        return {
          templates: result.items,
          total: result.total,
          count: result.items.length,
        };
      },
    },
    {
      name: 'brevo_get_template',
      description: 'Get details of a specific email template',
      inputSchema: z.object({
        templateId: z.number().describe('Template ID'),
      }),
      execute: async (args: any) => {
        return await client.get<EmailTemplate>(`/smtp/templates/${args.templateId}`);
      },
    },
    {
      name: 'brevo_create_template',
      description: 'Create a new email template',
      inputSchema: z.object({
        name: z.string().describe('Template name'),
        subject: z.string().describe('Email subject line'),
        sender: z.object({
          name: z.string().optional(),
          email: z.string().email(),
        }).describe('Sender information'),
        htmlContent: z.string().describe('HTML content with template variables'),
        isActive: z.boolean().optional().describe('Is template active (default: true)'),
        replyTo: z.string().email().optional().describe('Reply-to email'),
        toField: z.string().optional().describe('To field placeholder'),
        tag: z.string().optional().describe('Tag for categorization'),
        attachmentUrl: z.string().url().optional().describe('URL of attachment'),
      }),
      execute: async (args: any) => {
        const data: any = {
          name: args.name,
          subject: args.subject,
          sender: args.sender,
          htmlContent: args.htmlContent,
        };
        if (args.isActive !== undefined) data.isActive = args.isActive;
        if (args.replyTo) data.replyTo = args.replyTo;
        if (args.toField) data.toField = args.toField;
        if (args.tag) data.tag = args.tag;
        if (args.attachmentUrl) data.attachmentUrl = args.attachmentUrl;

        return await client.post('/smtp/templates', data);
      },
    },
    {
      name: 'brevo_update_template',
      description: 'Update an email template',
      inputSchema: z.object({
        templateId: z.number().describe('Template ID'),
        name: z.string().optional().describe('Template name'),
        subject: z.string().optional().describe('Email subject'),
        sender: z.object({
          name: z.string().optional(),
          email: z.string().email(),
        }).optional().describe('Sender information'),
        htmlContent: z.string().optional().describe('HTML content'),
        isActive: z.boolean().optional().describe('Is template active'),
        replyTo: z.string().email().optional().describe('Reply-to email'),
        tag: z.string().optional().describe('Tag'),
      }),
      execute: async (args: any) => {
        const data: any = {};
        if (args.name) data.name = args.name;
        if (args.subject) data.subject = args.subject;
        if (args.sender) data.sender = args.sender;
        if (args.htmlContent) data.htmlContent = args.htmlContent;
        if (args.isActive !== undefined) data.isActive = args.isActive;
        if (args.replyTo) data.replyTo = args.replyTo;
        if (args.tag) data.tag = args.tag;

        return await client.put(`/smtp/templates/${args.templateId}`, data);
      },
    },
    {
      name: 'brevo_delete_template',
      description: 'Delete an email template',
      inputSchema: z.object({
        templateId: z.number().describe('Template ID'),
      }),
      execute: async (args: any) => {
        return await client.delete(`/smtp/templates/${args.templateId}`);
      },
    },
    {
      name: 'brevo_send_test_template',
      description: 'Send a test email using a template',
      inputSchema: z.object({
        templateId: z.number().describe('Template ID'),
        emailTo: z.array(z.string().email()).describe('Test recipient emails'),
      }),
      execute: async (args: any) => {
        return await client.post(`/smtp/templates/${args.templateId}/sendTest`, {
          emailTo: args.emailTo,
        });
      },
    },
  ];
}
