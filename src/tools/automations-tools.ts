import { z } from 'zod';
import { BrevoApiClient } from '../types/api-client.js';
import { Workflow, WorkflowStats } from '../types/index.js';

export function createAutomationsTools(client: BrevoApiClient) {
  return [
    {
      name: 'brevo_list_workflows',
      description: 'List all marketing automation workflows',
      inputSchema: z.object({
        limit: z.number().optional().describe('Number of workflows (default: 50)'),
        offset: z.number().optional().describe('Pagination offset'),
        sort: z.enum(['asc', 'desc']).optional().describe('Sort by creation date'),
        status: z.enum(['draft', 'active', 'inactive']).optional().describe('Filter by status'),
      }),
      execute: async (args: any) => {
        const params: any = {
          limit: args.limit || 50,
          offset: args.offset || 0,
        };
        if (args.sort) params.sort = args.sort;
        if (args.status) params.status = args.status;

        const result = await client.getPaginated<Workflow>('/automation/workflows', params);
        return {
          workflows: result.items,
          total: result.total,
          count: result.items.length,
        };
      },
    },
    {
      name: 'brevo_get_workflow',
      description: 'Get details of a specific workflow',
      inputSchema: z.object({
        workflowId: z.number().describe('Workflow ID'),
      }),
      execute: async (args: any) => {
        return await client.get<Workflow>(`/automation/workflows/${args.workflowId}`);
      },
    },
    {
      name: 'brevo_activate_workflow',
      description: 'Activate a workflow',
      inputSchema: z.object({
        workflowId: z.number().describe('Workflow ID'),
      }),
      execute: async (args: any) => {
        return await client.patch(`/automation/workflows/${args.workflowId}`, {
          status: 'active',
        });
      },
    },
    {
      name: 'brevo_deactivate_workflow',
      description: 'Deactivate a workflow',
      inputSchema: z.object({
        workflowId: z.number().describe('Workflow ID'),
      }),
      execute: async (args: any) => {
        return await client.patch(`/automation/workflows/${args.workflowId}`, {
          status: 'inactive',
        });
      },
    },
    {
      name: 'brevo_get_workflow_stats',
      description: 'Get statistics for a workflow',
      inputSchema: z.object({
        workflowId: z.number().describe('Workflow ID'),
      }),
      execute: async (args: any) => {
        return await client.get<WorkflowStats>(`/automation/workflows/${args.workflowId}/stats`);
      },
    },
  ];
}
