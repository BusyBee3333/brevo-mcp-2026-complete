import { z } from 'zod';
import { BrevoApiClient } from '../types/api-client.js';
import { TransactionalEmail, TransactionalSMS } from '../types/index.js';

export function createTransactionalTools(client: BrevoApiClient) {
  return [
    {
      name: 'brevo_send_transactional_email',
      description: 'Send a transactional email',
      inputSchema: z.object({
        to: z.array(z.object({
          email: z.string().email(),
          name: z.string().optional(),
        })).describe('Recipients'),
        sender: z.object({
          email: z.string().email(),
          name: z.string().optional(),
        }).describe('Sender information'),
        subject: z.string().optional().describe('Email subject'),
        htmlContent: z.string().optional().describe('HTML content'),
        textContent: z.string().optional().describe('Text content'),
        templateId: z.number().optional().describe('Template ID'),
        params: z.record(z.any()).optional().describe('Template parameters'),
        cc: z.array(z.object({
          email: z.string().email(),
          name: z.string().optional(),
        })).optional().describe('CC recipients'),
        bcc: z.array(z.object({
          email: z.string().email(),
          name: z.string().optional(),
        })).optional().describe('BCC recipients'),
        replyTo: z.object({
          email: z.string().email(),
          name: z.string().optional(),
        }).optional().describe('Reply-to'),
        attachment: z.array(z.object({
          url: z.string().url().optional(),
          content: z.string().optional(),
          name: z.string(),
        })).optional().describe('Attachments'),
        headers: z.record(z.string()).optional().describe('Custom headers'),
        tags: z.array(z.string()).optional().describe('Tags for categorization'),
      }),
      execute: async (args: any) => {
        const data: TransactionalEmail = {
          to: args.to,
          sender: args.sender,
        };
        if (args.subject) data.subject = args.subject;
        if (args.htmlContent) data.htmlContent = args.htmlContent;
        if (args.textContent) data.textContent = args.textContent;
        if (args.templateId) data.templateId = args.templateId;
        if (args.params) data.params = args.params;
        if (args.cc) data.cc = args.cc;
        if (args.bcc) data.bcc = args.bcc;
        if (args.replyTo) data.replyTo = args.replyTo;
        if (args.attachment) data.attachment = args.attachment;
        if (args.headers) data.headers = args.headers;
        if (args.tags) data.tags = args.tags;

        return await client.post('/smtp/email', data);
      },
    },
    {
      name: 'brevo_send_transactional_sms',
      description: 'Send a transactional SMS',
      inputSchema: z.object({
        sender: z.string().describe('Sender name (max 11 characters) or phone number'),
        recipient: z.string().describe('Recipient phone number (E.164 format)'),
        content: z.string().describe('SMS content (max 160 characters for single SMS)'),
        type: z.enum(['transactional', 'marketing']).optional().describe('SMS type (default: transactional)'),
        tag: z.string().optional().describe('Tag for categorization'),
        webUrl: z.string().url().optional().describe('URL for web version'),
      }),
      execute: async (args: any) => {
        const data: TransactionalSMS = {
          sender: args.sender,
          recipient: args.recipient,
          content: args.content,
        };
        if (args.type) data.type = args.type;
        if (args.tag) data.tag = args.tag;
        if (args.webUrl) data.webUrl = args.webUrl;

        return await client.post('/transactionalSMS/sms', data);
      },
    },
    {
      name: 'brevo_list_transactional_events',
      description: 'Get list of transactional email/SMS events',
      inputSchema: z.object({
        email: z.string().email().optional().describe('Filter by email'),
        templateId: z.number().optional().describe('Filter by template ID'),
        messageId: z.string().optional().describe('Filter by message ID'),
        event: z.enum(['bounces', 'hardBounces', 'softBounces', 'delivered', 'spam', 'requests', 'opened', 'clicks', 'invalid', 'deferred', 'blocked', 'unsubscribed']).optional().describe('Event type'),
        days: z.number().optional().describe('Number of days to retrieve (max 30)'),
        limit: z.number().optional().describe('Number of events (default: 50)'),
        offset: z.number().optional().describe('Pagination offset'),
        sort: z.enum(['asc', 'desc']).optional().describe('Sort by date'),
      }),
      execute: async (args: any) => {
        const params: any = {
          limit: args.limit || 50,
          offset: args.offset || 0,
        };
        if (args.email) params.email = args.email;
        if (args.templateId) params.templateId = args.templateId;
        if (args.messageId) params.messageId = args.messageId;
        if (args.event) params.event = args.event;
        if (args.days) params.days = args.days;
        if (args.sort) params.sort = args.sort;

        return await client.get('/smtp/statistics/events', params);
      },
    },
    {
      name: 'brevo_get_aggregated_report',
      description: 'Get aggregated transactional email/SMS statistics',
      inputSchema: z.object({
        startDate: z.string().describe('Start date (YYYY-MM-DD)'),
        endDate: z.string().describe('End date (YYYY-MM-DD)'),
        days: z.number().optional().describe('Number of days (alternative to date range)'),
        tag: z.string().optional().describe('Filter by tag'),
      }),
      execute: async (args: any) => {
        const params: any = {};
        if (args.days) {
          params.days = args.days;
        } else {
          params.startDate = args.startDate;
          params.endDate = args.endDate;
        }
        if (args.tag) params.tag = args.tag;

        return await client.get('/smtp/statistics/aggregatedReport', params);
      },
    },
  ];
}
