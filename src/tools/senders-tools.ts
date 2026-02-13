import { z } from 'zod';
import { BrevoApiClient } from '../types/api-client.js';
import { Sender } from '../types/index.js';

export function createSendersTools(client: BrevoApiClient) {
  return [
    {
      name: 'brevo_list_senders',
      description: 'List all senders',
      inputSchema: z.object({
        ip: z.string().optional().describe('Filter by dedicated IP'),
        domain: z.string().optional().describe('Filter by domain'),
      }),
      execute: async (args: any) => {
        const params: any = {};
        if (args.ip) params.ip = args.ip;
        if (args.domain) params.domain = args.domain;

        const result = await client.get<{ senders: Sender[] }>('/senders', params);
        return {
          senders: result.senders || [],
          count: result.senders?.length || 0,
        };
      },
    },
    {
      name: 'brevo_get_sender',
      description: 'Get details of a specific sender',
      inputSchema: z.object({
        senderId: z.number().describe('Sender ID'),
      }),
      execute: async (args: any) => {
        return await client.get<Sender>(`/senders/${args.senderId}`);
      },
    },
    {
      name: 'brevo_create_sender',
      description: 'Create a new sender',
      inputSchema: z.object({
        name: z.string().describe('Sender name'),
        email: z.string().email().describe('Sender email address'),
        ips: z.array(z.object({
          ip: z.string(),
          domain: z.string(),
          weight: z.number().optional(),
        })).optional().describe('IPs configuration'),
      }),
      execute: async (args: any) => {
        const data: any = {
          name: args.name,
          email: args.email,
        };
        if (args.ips) data.ips = args.ips;

        return await client.post('/senders', data);
      },
    },
    {
      name: 'brevo_update_sender',
      description: 'Update a sender',
      inputSchema: z.object({
        senderId: z.number().describe('Sender ID'),
        name: z.string().optional().describe('Sender name'),
        email: z.string().email().optional().describe('Sender email'),
        ips: z.array(z.object({
          ip: z.string(),
          domain: z.string(),
          weight: z.number().optional(),
        })).optional().describe('IPs configuration'),
      }),
      execute: async (args: any) => {
        const data: any = {};
        if (args.name) data.name = args.name;
        if (args.email) data.email = args.email;
        if (args.ips) data.ips = args.ips;

        return await client.put(`/senders/${args.senderId}`, data);
      },
    },
    {
      name: 'brevo_delete_sender',
      description: 'Delete a sender',
      inputSchema: z.object({
        senderId: z.number().describe('Sender ID'),
      }),
      execute: async (args: any) => {
        return await client.delete(`/senders/${args.senderId}`);
      },
    },
    {
      name: 'brevo_validate_sender',
      description: 'Validate sender domain and authentication (SPF/DKIM)',
      inputSchema: z.object({
        senderId: z.number().describe('Sender ID'),
      }),
      execute: async (args: any) => {
        const sender = await client.get<Sender>(`/senders/${args.senderId}`);
        return {
          senderId: args.senderId,
          email: sender.email,
          spf: sender.spf,
          dkim: sender.dkim,
          active: sender.active,
          validated: sender.spf && sender.dkim,
        };
      },
    },
  ];
}
