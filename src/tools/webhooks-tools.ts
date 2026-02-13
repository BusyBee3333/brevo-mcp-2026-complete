import { z } from 'zod';
import { BrevoApiClient } from '../types/api-client.js';
import { Webhook } from '../types/index.js';

export function createWebhooksTools(client: BrevoApiClient) {
  return [
    {
      name: 'brevo_list_webhooks',
      description: 'List all webhooks',
      inputSchema: z.object({
        type: z.enum(['marketing', 'transactional']).optional().describe('Filter by webhook type'),
        sort: z.enum(['asc', 'desc']).optional().describe('Sort by creation date'),
      }),
      execute: async (args: any) => {
        const params: any = {};
        if (args.type) params.type = args.type;
        if (args.sort) params.sort = args.sort;

        const result = await client.get<{ webhooks: Webhook[] }>('/webhooks', params);
        return {
          webhooks: result.webhooks || [],
          count: result.webhooks?.length || 0,
        };
      },
    },
    {
      name: 'brevo_get_webhook',
      description: 'Get details of a specific webhook',
      inputSchema: z.object({
        webhookId: z.number().describe('Webhook ID'),
      }),
      execute: async (args: any) => {
        return await client.get<Webhook>(`/webhooks/${args.webhookId}`);
      },
    },
    {
      name: 'brevo_create_webhook',
      description: 'Create a new webhook',
      inputSchema: z.object({
        url: z.string().url().describe('Webhook URL'),
        description: z.string().optional().describe('Webhook description'),
        events: z.array(z.string()).describe('Events to subscribe to (e.g., delivered, opened, clicked)'),
        type: z.enum(['marketing', 'transactional']).describe('Webhook type'),
        batched: z.boolean().optional().describe('Enable batched events'),
        auth: z.object({
          type: z.enum(['bearer', 'basic']),
          token: z.string().optional(),
          username: z.string().optional(),
          password: z.string().optional(),
        }).optional().describe('Authentication configuration'),
      }),
      execute: async (args: any) => {
        const data: any = {
          url: args.url,
          events: args.events,
          type: args.type,
        };
        if (args.description) data.description = args.description;
        if (args.batched !== undefined) data.batched = args.batched;
        if (args.auth) data.auth = args.auth;

        return await client.post('/webhooks', data);
      },
    },
    {
      name: 'brevo_update_webhook',
      description: 'Update a webhook',
      inputSchema: z.object({
        webhookId: z.number().describe('Webhook ID'),
        url: z.string().url().optional().describe('Webhook URL'),
        description: z.string().optional().describe('Description'),
        events: z.array(z.string()).optional().describe('Events'),
        batched: z.boolean().optional().describe('Batched events'),
        auth: z.object({
          type: z.enum(['bearer', 'basic']),
          token: z.string().optional(),
          username: z.string().optional(),
          password: z.string().optional(),
        }).optional().describe('Authentication'),
      }),
      execute: async (args: any) => {
        const data: any = {};
        if (args.url) data.url = args.url;
        if (args.description) data.description = args.description;
        if (args.events) data.events = args.events;
        if (args.batched !== undefined) data.batched = args.batched;
        if (args.auth) data.auth = args.auth;

        return await client.put(`/webhooks/${args.webhookId}`, data);
      },
    },
    {
      name: 'brevo_delete_webhook',
      description: 'Delete a webhook',
      inputSchema: z.object({
        webhookId: z.number().describe('Webhook ID'),
      }),
      execute: async (args: any) => {
        return await client.delete(`/webhooks/${args.webhookId}`);
      },
    },
  ];
}
