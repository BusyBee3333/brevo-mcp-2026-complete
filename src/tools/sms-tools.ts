import { z } from 'zod';
import { BrevoApiClient } from '../types/api-client.js';
import { SMSCampaign } from '../types/index.js';

export function createSmsTools(client: BrevoApiClient) {
  return [
    {
      name: 'brevo_list_sms_campaigns',
      description: 'List all SMS campaigns',
      inputSchema: z.object({
        status: z.enum(['draft', 'sent', 'queued', 'suspended', 'inProcess']).optional().describe('Filter by status'),
        limit: z.number().optional().describe('Number of campaigns (default: 50)'),
        offset: z.number().optional().describe('Pagination offset'),
        sort: z.enum(['asc', 'desc']).optional().describe('Sort by creation date'),
      }),
      execute: async (args: any) => {
        const params: any = {
          limit: args.limit || 50,
          offset: args.offset || 0,
        };
        if (args.status) params.status = args.status;
        if (args.sort) params.sort = args.sort;

        const result = await client.getPaginated<SMSCampaign>('/smsCampaigns', params);
        return {
          campaigns: result.items,
          total: result.total,
          count: result.items.length,
        };
      },
    },
    {
      name: 'brevo_get_sms_campaign',
      description: 'Get details of a specific SMS campaign',
      inputSchema: z.object({
        campaignId: z.number().describe('SMS campaign ID'),
      }),
      execute: async (args: any) => {
        return await client.get<SMSCampaign>(`/smsCampaigns/${args.campaignId}`);
      },
    },
    {
      name: 'brevo_create_sms_campaign',
      description: 'Create a new SMS campaign',
      inputSchema: z.object({
        name: z.string().describe('Campaign name'),
        sender: z.string().describe('Sender name or phone number'),
        content: z.string().describe('SMS content'),
        recipients: z.object({
          listIds: z.array(z.number()).optional(),
          exclusionListIds: z.array(z.number()).optional(),
        }).optional().describe('Recipients configuration'),
        scheduledAt: z.string().optional().describe('Schedule date-time (ISO 8601)'),
      }),
      execute: async (args: any) => {
        const data: any = {
          name: args.name,
          sender: args.sender,
          content: args.content,
        };
        if (args.recipients) data.recipients = args.recipients;
        if (args.scheduledAt) data.scheduledAt = args.scheduledAt;

        return await client.post('/smsCampaigns', data);
      },
    },
    {
      name: 'brevo_update_sms_campaign',
      description: 'Update an SMS campaign',
      inputSchema: z.object({
        campaignId: z.number().describe('Campaign ID'),
        name: z.string().optional().describe('Campaign name'),
        sender: z.string().optional().describe('Sender'),
        content: z.string().optional().describe('SMS content'),
        recipients: z.object({
          listIds: z.array(z.number()).optional(),
          exclusionListIds: z.array(z.number()).optional(),
        }).optional().describe('Recipients'),
        scheduledAt: z.string().optional().describe('Schedule date-time'),
      }),
      execute: async (args: any) => {
        const data: any = {};
        if (args.name) data.name = args.name;
        if (args.sender) data.sender = args.sender;
        if (args.content) data.content = args.content;
        if (args.recipients) data.recipients = args.recipients;
        if (args.scheduledAt) data.scheduledAt = args.scheduledAt;

        return await client.put(`/smsCampaigns/${args.campaignId}`, data);
      },
    },
    {
      name: 'brevo_send_sms_campaign',
      description: 'Send an SMS campaign immediately',
      inputSchema: z.object({
        campaignId: z.number().describe('Campaign ID'),
      }),
      execute: async (args: any) => {
        return await client.post(`/smsCampaigns/${args.campaignId}/sendNow`);
      },
    },
    {
      name: 'brevo_get_sms_campaign_report',
      description: 'Get report for an SMS campaign',
      inputSchema: z.object({
        campaignId: z.number().describe('Campaign ID'),
      }),
      execute: async (args: any) => {
        return await client.get(`/smsCampaigns/${args.campaignId}/report`);
      },
    },
  ];
}
