import { z } from 'zod';
import { BrevoApiClient } from '../types/api-client.js';
import { Deal, Pipeline, Stage } from '../types/index.js';

export function createDealsTools(client: BrevoApiClient) {
  return [
    {
      name: 'brevo_list_deals',
      description: 'List all CRM deals',
      inputSchema: z.object({
        limit: z.number().optional().describe('Number of deals (default: 50)'),
        offset: z.number().optional().describe('Pagination offset'),
        sort: z.enum(['asc', 'desc']).optional().describe('Sort by creation date'),
        filters: z.object({
          'attributes.pipeline': z.string().optional(),
          'attributes.deal_stage': z.string().optional(),
        }).optional().describe('Filter by pipeline or stage'),
      }),
      execute: async (args: any) => {
        const params: any = {
          limit: args.limit || 50,
          offset: args.offset || 0,
        };
        if (args.sort) params.sort = args.sort;
        if (args.filters) {
          params.filters = JSON.stringify(args.filters);
        }

        const result = await client.getPaginated<Deal>('/crm/deals', params);
        return {
          deals: result.items,
          total: result.total,
          count: result.items.length,
        };
      },
    },
    {
      name: 'brevo_get_deal',
      description: 'Get details of a specific deal',
      inputSchema: z.object({
        dealId: z.string().describe('Deal ID'),
      }),
      execute: async (args: any) => {
        return await client.get<Deal>(`/crm/deals/${args.dealId}`);
      },
    },
    {
      name: 'brevo_create_deal',
      description: 'Create a new deal',
      inputSchema: z.object({
        name: z.string().describe('Deal name'),
        attributes: z.record(z.any()).optional().describe('Deal attributes (pipeline, stage, amount, etc.)'),
        linkedContactsIds: z.array(z.number()).optional().describe('Contact IDs to link'),
        linkedCompaniesIds: z.array(z.string()).optional().describe('Company IDs to link'),
      }),
      execute: async (args: any) => {
        const data: any = { name: args.name };
        if (args.attributes) data.attributes = args.attributes;
        if (args.linkedContactsIds) data.linkedContactsIds = args.linkedContactsIds;
        if (args.linkedCompaniesIds) data.linkedCompaniesIds = args.linkedCompaniesIds;

        return await client.post('/crm/deals', data);
      },
    },
    {
      name: 'brevo_update_deal',
      description: 'Update a deal',
      inputSchema: z.object({
        dealId: z.string().describe('Deal ID'),
        name: z.string().optional().describe('Deal name'),
        attributes: z.record(z.any()).optional().describe('Deal attributes'),
        linkedContactsIds: z.array(z.number()).optional().describe('Contact IDs'),
        linkedCompaniesIds: z.array(z.string()).optional().describe('Company IDs'),
      }),
      execute: async (args: any) => {
        const data: any = {};
        if (args.name) data.name = args.name;
        if (args.attributes) data.attributes = args.attributes;
        if (args.linkedContactsIds) data.linkedContactsIds = args.linkedContactsIds;
        if (args.linkedCompaniesIds) data.linkedCompaniesIds = args.linkedCompaniesIds;

        return await client.patch(`/crm/deals/${args.dealId}`, data);
      },
    },
    {
      name: 'brevo_delete_deal',
      description: 'Delete a deal',
      inputSchema: z.object({
        dealId: z.string().describe('Deal ID'),
      }),
      execute: async (args: any) => {
        return await client.delete(`/crm/deals/${args.dealId}`);
      },
    },
    {
      name: 'brevo_list_pipelines',
      description: 'List all CRM pipelines',
      inputSchema: z.object({}),
      execute: async () => {
        const result = await client.get<{ pipelines: Pipeline[] }>('/crm/pipeline/details/all');
        return {
          pipelines: result.pipelines || [],
          count: result.pipelines?.length || 0,
        };
      },
    },
    {
      name: 'brevo_list_deal_stages',
      description: 'List all stages for a specific pipeline',
      inputSchema: z.object({
        pipelineId: z.string().describe('Pipeline ID'),
      }),
      execute: async (args: any) => {
        const result = await client.get<Pipeline>(`/crm/pipeline/details/${args.pipelineId}`);
        return {
          pipelineId: args.pipelineId,
          stages: result || [],
        };
      },
    },
  ];
}
