import { z } from 'zod';
import { BrevoApiClient } from '../types/api-client.js';
import { Contact, ContactAttribute, ContactList, Folder } from '../types/index.js';

export function createContactsTools(client: BrevoApiClient) {
  return [
    {
      name: 'brevo_list_contacts',
      description: 'List all contacts with optional filters and pagination',
      inputSchema: z.object({
        limit: z.number().optional().describe('Number of contacts to return (default: 50)'),
        offset: z.number().optional().describe('Index of the first contact (default: 0)'),
        modifiedSince: z.string().optional().describe('Filter contacts modified since date (ISO 8601)'),
        listIds: z.array(z.number()).optional().describe('Filter by list IDs'),
        sort: z.enum(['asc', 'desc']).optional().describe('Sort by creation date'),
      }),
      execute: async (args: any) => {
        const params: any = {
          limit: args.limit || 50,
          offset: args.offset || 0,
        };
        if (args.modifiedSince) params.modifiedSince = args.modifiedSince;
        if (args.listIds) params.listIds = args.listIds;
        if (args.sort) params.sort = args.sort;

        const result = await client.getPaginated<Contact>('/contacts', params);
        return {
          contacts: result.items,
          total: result.total,
          count: result.items.length,
        };
      },
    },
    {
      name: 'brevo_get_contact',
      description: 'Get details of a specific contact by email or ID',
      inputSchema: z.object({
        identifier: z.string().describe('Contact email address or ID'),
      }),
      execute: async (args: any) => {
        return await client.get<Contact>(`/contacts/${encodeURIComponent(args.identifier)}`);
      },
    },
    {
      name: 'brevo_create_contact',
      description: 'Create a new contact',
      inputSchema: z.object({
        email: z.string().email().describe('Contact email address'),
        attributes: z.record(z.any()).optional().describe('Contact attributes (e.g., FIRSTNAME, LASTNAME)'),
        emailBlacklisted: z.boolean().optional().describe('Whether contact is blacklisted for emails'),
        smsBlacklisted: z.boolean().optional().describe('Whether contact is blacklisted for SMS'),
        listIds: z.array(z.number()).optional().describe('List IDs to add the contact to'),
        updateEnabled: z.boolean().optional().describe('Update contact if already exists'),
        smtpBlacklistSender: z.array(z.string()).optional().describe('SMTP blacklist sender emails'),
      }),
      execute: async (args: any) => {
        const data: any = { email: args.email };
        if (args.attributes) data.attributes = args.attributes;
        if (args.emailBlacklisted !== undefined) data.emailBlacklisted = args.emailBlacklisted;
        if (args.smsBlacklisted !== undefined) data.smsBlacklisted = args.smsBlacklisted;
        if (args.listIds) data.listIds = args.listIds;
        if (args.updateEnabled !== undefined) data.updateEnabled = args.updateEnabled;
        if (args.smtpBlacklistSender) data.smtpBlacklistSender = args.smtpBlacklistSender;

        return await client.post('/contacts', data);
      },
    },
    {
      name: 'brevo_update_contact',
      description: 'Update an existing contact',
      inputSchema: z.object({
        identifier: z.string().describe('Contact email address or ID'),
        attributes: z.record(z.any()).optional().describe('Contact attributes to update'),
        emailBlacklisted: z.boolean().optional().describe('Whether contact is blacklisted for emails'),
        smsBlacklisted: z.boolean().optional().describe('Whether contact is blacklisted for SMS'),
        listIds: z.array(z.number()).optional().describe('List IDs to add the contact to'),
        unlinkListIds: z.array(z.number()).optional().describe('List IDs to remove the contact from'),
        smtpBlacklistSender: z.array(z.string()).optional().describe('SMTP blacklist sender emails'),
      }),
      execute: async (args: any) => {
        const data: any = {};
        if (args.attributes) data.attributes = args.attributes;
        if (args.emailBlacklisted !== undefined) data.emailBlacklisted = args.emailBlacklisted;
        if (args.smsBlacklisted !== undefined) data.smsBlacklisted = args.smsBlacklisted;
        if (args.listIds) data.listIds = args.listIds;
        if (args.unlinkListIds) data.unlinkListIds = args.unlinkListIds;
        if (args.smtpBlacklistSender) data.smtpBlacklistSender = args.smtpBlacklistSender;

        return await client.put(`/contacts/${encodeURIComponent(args.identifier)}`, data);
      },
    },
    {
      name: 'brevo_delete_contact',
      description: 'Delete a contact',
      inputSchema: z.object({
        identifier: z.string().describe('Contact email address or ID'),
      }),
      execute: async (args: any) => {
        return await client.delete(`/contacts/${encodeURIComponent(args.identifier)}`);
      },
    },
    {
      name: 'brevo_search_contacts',
      description: 'Search contacts using advanced filters',
      inputSchema: z.object({
        email: z.string().optional().describe('Email to search for'),
        modifiedSince: z.string().optional().describe('Filter contacts modified since date'),
        listIds: z.array(z.number()).optional().describe('Filter by list IDs'),
        limit: z.number().optional().describe('Number of results (default: 50)'),
        offset: z.number().optional().describe('Pagination offset'),
      }),
      execute: async (args: any) => {
        const params: any = { limit: args.limit || 50, offset: args.offset || 0 };
        if (args.email) params.email = args.email;
        if (args.modifiedSince) params.modifiedSince = args.modifiedSince;
        if (args.listIds) params.listIds = args.listIds;

        const result = await client.getPaginated<Contact>('/contacts', params);
        return {
          contacts: result.items,
          total: result.total,
          count: result.items.length,
        };
      },
    },
    {
      name: 'brevo_import_contacts',
      description: 'Import contacts from a file URL',
      inputSchema: z.object({
        fileUrl: z.string().url().describe('URL of the file to import (CSV)'),
        listIds: z.array(z.number()).optional().describe('List IDs to add contacts to'),
        emailBlacklist: z.boolean().optional().describe('Blacklist emails'),
        smsBlacklist: z.boolean().optional().describe('Blacklist SMS'),
        updateExistingContacts: z.boolean().optional().describe('Update existing contacts'),
        emptyContactsAttributes: z.boolean().optional().describe('Empty contact attributes'),
      }),
      execute: async (args: any) => {
        const data: any = { fileUrl: args.fileUrl };
        if (args.listIds) data.listIds = args.listIds;
        if (args.emailBlacklist !== undefined) data.emailBlacklist = args.emailBlacklist;
        if (args.smsBlacklist !== undefined) data.smsBlacklist = args.smsBlacklist;
        if (args.updateExistingContacts !== undefined) data.updateExistingContacts = args.updateExistingContacts;
        if (args.emptyContactsAttributes !== undefined) data.emptyContactsAttributes = args.emptyContactsAttributes;

        return await client.post('/contacts/import', data);
      },
    },
    {
      name: 'brevo_export_contacts',
      description: 'Export contacts to a file',
      inputSchema: z.object({
        exportAttributes: z.array(z.string()).optional().describe('Attributes to export'),
        filter: z.object({
          listIds: z.array(z.number()).optional(),
          excludedListIds: z.array(z.number()).optional(),
          modifiedSince: z.string().optional(),
        }).optional().describe('Filter criteria for export'),
        notifyUrl: z.string().url().optional().describe('Webhook URL to notify when export is ready'),
      }),
      execute: async (args: any) => {
        const data: any = {};
        if (args.exportAttributes) data.exportAttributes = args.exportAttributes;
        if (args.filter) data.filter = args.filter;
        if (args.notifyUrl) data.notifyUrl = args.notifyUrl;

        return await client.post('/contacts/export', data);
      },
    },
    {
      name: 'brevo_list_contact_attributes',
      description: 'List all contact attributes',
      inputSchema: z.object({}),
      execute: async () => {
        return await client.get<{ attributes: ContactAttribute[] }>('/contacts/attributes');
      },
    },
    {
      name: 'brevo_create_contact_attribute',
      description: 'Create a new contact attribute',
      inputSchema: z.object({
        name: z.string().describe('Attribute name (e.g., CUSTOM_FIELD)'),
        category: z.enum(['normal', 'transactional', 'category', 'calculated', 'global']).describe('Attribute category'),
        type: z.enum(['text', 'date', 'float', 'id', 'boolean']).optional().describe('Attribute type'),
        enumeration: z.array(z.object({
          value: z.number(),
          label: z.string(),
        })).optional().describe('Enumeration values for category type'),
      }),
      execute: async (args: any) => {
        const data: any = {
          name: args.name,
          category: args.category,
        };
        if (args.type) data.type = args.type;
        if (args.enumeration) data.enumeration = args.enumeration;

        return await client.post('/contacts/attributes/normal/' + args.name, data);
      },
    },
    {
      name: 'brevo_list_contact_folders',
      description: 'List all contact folders',
      inputSchema: z.object({
        limit: z.number().optional().describe('Number of folders (default: 50)'),
        offset: z.number().optional().describe('Pagination offset'),
      }),
      execute: async (args: any) => {
        const result = await client.getPaginated<Folder>('/contacts/folders', {
          limit: args.limit || 50,
          offset: args.offset || 0,
        });
        return {
          folders: result.items,
          total: result.total,
          count: result.items.length,
        };
      },
    },
    {
      name: 'brevo_list_contact_lists',
      description: 'List all contact lists',
      inputSchema: z.object({
        limit: z.number().optional().describe('Number of lists (default: 50)'),
        offset: z.number().optional().describe('Pagination offset'),
      }),
      execute: async (args: any) => {
        const result = await client.getPaginated<ContactList>('/contacts/lists', {
          limit: args.limit || 50,
          offset: args.offset || 0,
        });
        return {
          lists: result.items,
          total: result.total,
          count: result.items.length,
        };
      },
    },
  ];
}
