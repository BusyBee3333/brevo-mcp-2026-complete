import { z } from 'zod';
import { BrevoApiClient } from '../types/api-client.js';
import { ContactList } from '../types/index.js';

export function createListsTools(client: BrevoApiClient) {
  return [
    {
      name: 'brevo_list_lists',
      description: 'List all contact lists',
      inputSchema: z.object({
        limit: z.number().optional().describe('Number of lists (default: 50)'),
        offset: z.number().optional().describe('Pagination offset'),
        sort: z.enum(['asc', 'desc']).optional().describe('Sort by creation date'),
      }),
      execute: async (args: any) => {
        const result = await client.getPaginated<ContactList>('/contacts/lists', {
          limit: args.limit || 50,
          offset: args.offset || 0,
          sort: args.sort,
        });
        return {
          lists: result.items,
          total: result.total,
          count: result.items.length,
        };
      },
    },
    {
      name: 'brevo_get_list',
      description: 'Get details of a specific contact list',
      inputSchema: z.object({
        listId: z.number().describe('List ID'),
      }),
      execute: async (args: any) => {
        return await client.get<ContactList>(`/contacts/lists/${args.listId}`);
      },
    },
    {
      name: 'brevo_create_list',
      description: 'Create a new contact list',
      inputSchema: z.object({
        name: z.string().describe('List name'),
        folderId: z.number().optional().describe('Folder ID to place the list in'),
      }),
      execute: async (args: any) => {
        const data: any = { name: args.name };
        if (args.folderId) data.folderId = args.folderId;

        return await client.post('/contacts/lists', data);
      },
    },
    {
      name: 'brevo_update_list',
      description: 'Update a contact list',
      inputSchema: z.object({
        listId: z.number().describe('List ID'),
        name: z.string().optional().describe('New list name'),
        folderId: z.number().optional().describe('New folder ID'),
      }),
      execute: async (args: any) => {
        const data: any = {};
        if (args.name) data.name = args.name;
        if (args.folderId) data.folderId = args.folderId;

        return await client.put(`/contacts/lists/${args.listId}`, data);
      },
    },
    {
      name: 'brevo_delete_list',
      description: 'Delete a contact list',
      inputSchema: z.object({
        listId: z.number().describe('List ID'),
      }),
      execute: async (args: any) => {
        return await client.delete(`/contacts/lists/${args.listId}`);
      },
    },
    {
      name: 'brevo_add_contacts_to_list',
      description: 'Add contacts to a list',
      inputSchema: z.object({
        listId: z.number().describe('List ID'),
        emails: z.array(z.string().email()).describe('Array of contact emails to add'),
      }),
      execute: async (args: any) => {
        return await client.post(`/contacts/lists/${args.listId}/contacts/add`, {
          emails: args.emails,
        });
      },
    },
    {
      name: 'brevo_remove_contacts_from_list',
      description: 'Remove contacts from a list',
      inputSchema: z.object({
        listId: z.number().describe('List ID'),
        emails: z.array(z.string().email()).describe('Array of contact emails to remove'),
      }),
      execute: async (args: any) => {
        return await client.post(`/contacts/lists/${args.listId}/contacts/remove`, {
          emails: args.emails,
        });
      },
    },
  ];
}
