import { z } from 'zod';
import { BrevoApiClient } from '../types/api-client.js';
import { EmailCampaign, CampaignReport } from '../types/index.js';

export function createCampaignsTools(client: BrevoApiClient) {
  return [
    {
      name: 'brevo_list_email_campaigns',
      description: 'List all email campaigns with filters',
      inputSchema: z.object({
        type: z.enum(['classic', 'trigger', 'ab']).optional().describe('Campaign type'),
        status: z.enum(['draft', 'sent', 'queued', 'suspended', 'archive']).optional().describe('Campaign status'),
        limit: z.number().optional().describe('Number of campaigns (default: 50)'),
        offset: z.number().optional().describe('Pagination offset'),
        sort: z.enum(['asc', 'desc']).optional().describe('Sort by creation date'),
      }),
      execute: async (args: any) => {
        const params: any = { limit: args.limit || 50, offset: args.offset || 0 };
        if (args.type) params.type = args.type;
        if (args.status) params.status = args.status;
        if (args.sort) params.sort = args.sort;

        const result = await client.getPaginated<EmailCampaign>('/emailCampaigns', params);
        return {
          campaigns: result.items,
          total: result.total,
          count: result.items.length,
        };
      },
    },
    {
      name: 'brevo_get_email_campaign',
      description: 'Get details of a specific email campaign',
      inputSchema: z.object({
        campaignId: z.number().describe('Campaign ID'),
      }),
      execute: async (args: any) => {
        return await client.get<EmailCampaign>(`/emailCampaigns/${args.campaignId}`);
      },
    },
    {
      name: 'brevo_create_email_campaign',
      description: 'Create a new email campaign',
      inputSchema: z.object({
        name: z.string().describe('Campaign name'),
        subject: z.string().describe('Email subject line'),
        sender: z.object({
          name: z.string().optional(),
          email: z.string().email(),
        }).describe('Sender information'),
        type: z.enum(['classic', 'trigger', 'ab']).optional().describe('Campaign type (default: classic)'),
        htmlContent: z.string().optional().describe('HTML content of the email'),
        templateId: z.number().optional().describe('Template ID to use'),
        scheduledAt: z.string().optional().describe('Schedule date-time (ISO 8601)'),
        recipients: z.object({
          listIds: z.array(z.number()).optional(),
          exclusionListIds: z.array(z.number()).optional(),
          segmentIds: z.array(z.number()).optional(),
        }).optional().describe('Recipients configuration'),
        replyTo: z.string().email().optional().describe('Reply-to email'),
        toField: z.string().optional().describe('To field placeholder'),
        inlineImageActivation: z.boolean().optional().describe('Enable inline images'),
        mirrorActive: z.boolean().optional().describe('Enable mirror link'),
        recurring: z.boolean().optional().describe('Is recurring campaign'),
        abTesting: z.boolean().optional().describe('Enable A/B testing'),
        subjectA: z.string().optional().describe('Subject line A for A/B test'),
        subjectB: z.string().optional().describe('Subject line B for A/B test'),
        splitRule: z.number().optional().describe('A/B test split percentage'),
      }),
      execute: async (args: any) => {
        const data: any = {
          name: args.name,
          subject: args.subject,
          sender: args.sender,
        };
        if (args.type) data.type = args.type;
        if (args.htmlContent) data.htmlContent = args.htmlContent;
        if (args.templateId) data.templateId = args.templateId;
        if (args.scheduledAt) data.scheduledAt = args.scheduledAt;
        if (args.recipients) data.recipients = args.recipients;
        if (args.replyTo) data.replyTo = args.replyTo;
        if (args.toField) data.toField = args.toField;
        if (args.inlineImageActivation !== undefined) data.inlineImageActivation = args.inlineImageActivation;
        if (args.mirrorActive !== undefined) data.mirrorActive = args.mirrorActive;
        if (args.recurring !== undefined) data.recurring = args.recurring;
        if (args.abTesting !== undefined) data.abTesting = args.abTesting;
        if (args.subjectA) data.subjectA = args.subjectA;
        if (args.subjectB) data.subjectB = args.subjectB;
        if (args.splitRule) data.splitRule = args.splitRule;

        return await client.post('/emailCampaigns', data);
      },
    },
    {
      name: 'brevo_update_email_campaign',
      description: 'Update an email campaign',
      inputSchema: z.object({
        campaignId: z.number().describe('Campaign ID'),
        name: z.string().optional().describe('Campaign name'),
        subject: z.string().optional().describe('Email subject line'),
        sender: z.object({
          name: z.string().optional(),
          email: z.string().email(),
        }).optional().describe('Sender information'),
        htmlContent: z.string().optional().describe('HTML content'),
        scheduledAt: z.string().optional().describe('Schedule date-time'),
        recipients: z.object({
          listIds: z.array(z.number()).optional(),
          exclusionListIds: z.array(z.number()).optional(),
        }).optional().describe('Recipients'),
        replyTo: z.string().email().optional().describe('Reply-to email'),
        inlineImageActivation: z.boolean().optional().describe('Enable inline images'),
        mirrorActive: z.boolean().optional().describe('Enable mirror link'),
      }),
      execute: async (args: any) => {
        const data: any = {};
        if (args.name) data.name = args.name;
        if (args.subject) data.subject = args.subject;
        if (args.sender) data.sender = args.sender;
        if (args.htmlContent) data.htmlContent = args.htmlContent;
        if (args.scheduledAt) data.scheduledAt = args.scheduledAt;
        if (args.recipients) data.recipients = args.recipients;
        if (args.replyTo) data.replyTo = args.replyTo;
        if (args.inlineImageActivation !== undefined) data.inlineImageActivation = args.inlineImageActivation;
        if (args.mirrorActive !== undefined) data.mirrorActive = args.mirrorActive;

        return await client.put(`/emailCampaigns/${args.campaignId}`, data);
      },
    },
    {
      name: 'brevo_delete_email_campaign',
      description: 'Delete an email campaign',
      inputSchema: z.object({
        campaignId: z.number().describe('Campaign ID'),
      }),
      execute: async (args: any) => {
        return await client.delete(`/emailCampaigns/${args.campaignId}`);
      },
    },
    {
      name: 'brevo_send_email_campaign',
      description: 'Send an email campaign immediately',
      inputSchema: z.object({
        campaignId: z.number().describe('Campaign ID'),
      }),
      execute: async (args: any) => {
        return await client.post(`/emailCampaigns/${args.campaignId}/sendNow`);
      },
    },
    {
      name: 'brevo_schedule_email_campaign',
      description: 'Schedule an email campaign',
      inputSchema: z.object({
        campaignId: z.number().describe('Campaign ID'),
        scheduledAt: z.string().describe('Schedule date-time (ISO 8601)'),
      }),
      execute: async (args: any) => {
        return await client.put(`/emailCampaigns/${args.campaignId}`, {
          scheduledAt: args.scheduledAt,
        });
      },
    },
    {
      name: 'brevo_get_campaign_report',
      description: 'Get detailed report for an email campaign',
      inputSchema: z.object({
        campaignId: z.number().describe('Campaign ID'),
      }),
      execute: async (args: any) => {
        return await client.get<CampaignReport>(`/emailCampaigns/${args.campaignId}/report`);
      },
    },
    {
      name: 'brevo_list_campaign_links',
      description: 'Get all links from an email campaign',
      inputSchema: z.object({
        campaignId: z.number().describe('Campaign ID'),
      }),
      execute: async (args: any) => {
        const report = await client.get<CampaignReport>(`/emailCampaigns/${args.campaignId}/report`);
        return {
          links: Object.keys(report.linksStats || {}),
          linkStats: report.linksStats,
        };
      },
    },
  ];
}
