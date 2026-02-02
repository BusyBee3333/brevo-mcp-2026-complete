#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "brevo";
const MCP_VERSION = "1.0.0";
const API_BASE_URL = "https://api.brevo.com/v3";

// ============================================
// API CLIENT - Brevo uses api-key header
// ============================================
class BrevoClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "api-key": this.apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Brevo API error: ${response.status} ${response.statusText} - ${text}`);
    }

    // Some endpoints return 204 No Content
    if (response.status === 204) {
      return { success: true };
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

// ============================================
// TOOL DEFINITIONS
// ============================================
const tools = [
  {
    name: "send_email",
    description: "Send a transactional email",
    inputSchema: {
      type: "object" as const,
      properties: {
        to: { 
          type: "array", 
          description: "Array of recipient objects with email and optional name",
          items: { 
            type: "object",
            properties: {
              email: { type: "string" },
              name: { type: "string" }
            },
            required: ["email"]
          }
        },
        sender: {
          type: "object",
          description: "Sender object with email and optional name",
          properties: {
            email: { type: "string" },
            name: { type: "string" }
          },
          required: ["email"]
        },
        subject: { type: "string", description: "Email subject" },
        htmlContent: { type: "string", description: "HTML content of the email" },
        textContent: { type: "string", description: "Plain text content" },
        templateId: { type: "number", description: "Template ID to use instead of content" },
        params: { type: "object", description: "Template parameters" },
        replyTo: { type: "object", description: "Reply-to address" },
        attachment: { type: "array", description: "Array of attachment objects" },
        tags: { type: "array", items: { type: "string" }, description: "Tags for the email" },
      },
      required: ["to", "sender"],
    },
  },
  {
    name: "list_contacts",
    description: "List contacts with optional filters",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Number of contacts to return (default 50, max 1000)" },
        offset: { type: "number", description: "Pagination offset" },
        modifiedSince: { type: "string", description: "Filter by modification date (YYYY-MM-DD)" },
        sort: { type: "string", description: "Sort order (asc or desc)" },
      },
    },
  },
  {
    name: "add_contact",
    description: "Create a new contact",
    inputSchema: {
      type: "object" as const,
      properties: {
        email: { type: "string", description: "Contact email address" },
        attributes: { type: "object", description: "Contact attributes (FIRSTNAME, LASTNAME, SMS, etc.)" },
        listIds: { type: "array", items: { type: "number" }, description: "List IDs to add contact to" },
        updateEnabled: { type: "boolean", description: "Update contact if already exists" },
        smtpBlacklistSender: { type: "array", items: { type: "string" }, description: "Blacklisted senders" },
      },
      required: ["email"],
    },
  },
  {
    name: "update_contact",
    description: "Update an existing contact",
    inputSchema: {
      type: "object" as const,
      properties: {
        identifier: { type: "string", description: "Email or contact ID" },
        attributes: { type: "object", description: "Contact attributes to update" },
        listIds: { type: "array", items: { type: "number" }, description: "List IDs to add contact to" },
        unlinkListIds: { type: "array", items: { type: "number" }, description: "List IDs to remove contact from" },
        emailBlacklisted: { type: "boolean", description: "Blacklist the contact email" },
        smsBlacklisted: { type: "boolean", description: "Blacklist the contact SMS" },
      },
      required: ["identifier"],
    },
  },
  {
    name: "list_campaigns",
    description: "List email campaigns",
    inputSchema: {
      type: "object" as const,
      properties: {
        type: { type: "string", description: "Campaign type (classic, trigger)" },
        status: { type: "string", description: "Campaign status (suspended, archive, sent, queued, draft, inProcess)" },
        limit: { type: "number", description: "Number of results (default 50, max 1000)" },
        offset: { type: "number", description: "Pagination offset" },
        sort: { type: "string", description: "Sort order (asc or desc)" },
      },
    },
  },
  {
    name: "create_campaign",
    description: "Create a new email campaign",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Campaign name" },
        subject: { type: "string", description: "Email subject" },
        sender: {
          type: "object",
          description: "Sender object with email and name",
          properties: {
            email: { type: "string" },
            name: { type: "string" }
          },
          required: ["email", "name"]
        },
        htmlContent: { type: "string", description: "HTML content" },
        templateId: { type: "number", description: "Template ID to use" },
        recipients: {
          type: "object",
          description: "Recipients configuration",
          properties: {
            listIds: { type: "array", items: { type: "number" } },
            exclusionListIds: { type: "array", items: { type: "number" } }
          }
        },
        scheduledAt: { type: "string", description: "Schedule time (ISO 8601)" },
        replyTo: { type: "string", description: "Reply-to email address" },
        toField: { type: "string", description: "Personalization field for To header" },
        tag: { type: "string", description: "Campaign tag" },
      },
      required: ["name", "subject", "sender"],
    },
  },
  {
    name: "send_sms",
    description: "Send a transactional SMS",
    inputSchema: {
      type: "object" as const,
      properties: {
        sender: { type: "string", description: "Sender name (max 11 chars) or phone number" },
        recipient: { type: "string", description: "Recipient phone number with country code" },
        content: { type: "string", description: "SMS message content (max 160 chars for single SMS)" },
        type: { type: "string", description: "SMS type: transactional or marketing" },
        tag: { type: "string", description: "Tag for the SMS" },
        webUrl: { type: "string", description: "Webhook URL for delivery report" },
      },
      required: ["sender", "recipient", "content"],
    },
  },
  {
    name: "list_templates",
    description: "List email templates",
    inputSchema: {
      type: "object" as const,
      properties: {
        templateStatus: { type: "boolean", description: "Filter by active status" },
        limit: { type: "number", description: "Number of results (default 50, max 1000)" },
        offset: { type: "number", description: "Pagination offset" },
        sort: { type: "string", description: "Sort order (asc or desc)" },
      },
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: BrevoClient, name: string, args: any) {
  switch (name) {
    case "send_email": {
      const payload: any = {
        to: args.to,
        sender: args.sender,
      };
      if (args.subject) payload.subject = args.subject;
      if (args.htmlContent) payload.htmlContent = args.htmlContent;
      if (args.textContent) payload.textContent = args.textContent;
      if (args.templateId) payload.templateId = args.templateId;
      if (args.params) payload.params = args.params;
      if (args.replyTo) payload.replyTo = args.replyTo;
      if (args.attachment) payload.attachment = args.attachment;
      if (args.tags) payload.tags = args.tags;
      return await client.post("/smtp/email", payload);
    }

    case "list_contacts": {
      const params = new URLSearchParams();
      if (args.limit) params.append("limit", String(args.limit));
      if (args.offset) params.append("offset", String(args.offset));
      if (args.modifiedSince) params.append("modifiedSince", args.modifiedSince);
      if (args.sort) params.append("sort", args.sort);
      const query = params.toString();
      return await client.get(`/contacts${query ? `?${query}` : ""}`);
    }

    case "add_contact": {
      const payload: any = {
        email: args.email,
      };
      if (args.attributes) payload.attributes = args.attributes;
      if (args.listIds) payload.listIds = args.listIds;
      if (args.updateEnabled !== undefined) payload.updateEnabled = args.updateEnabled;
      if (args.smtpBlacklistSender) payload.smtpBlacklistSender = args.smtpBlacklistSender;
      return await client.post("/contacts", payload);
    }

    case "update_contact": {
      const payload: any = {};
      if (args.attributes) payload.attributes = args.attributes;
      if (args.listIds) payload.listIds = args.listIds;
      if (args.unlinkListIds) payload.unlinkListIds = args.unlinkListIds;
      if (args.emailBlacklisted !== undefined) payload.emailBlacklisted = args.emailBlacklisted;
      if (args.smsBlacklisted !== undefined) payload.smsBlacklisted = args.smsBlacklisted;
      return await client.put(`/contacts/${encodeURIComponent(args.identifier)}`, payload);
    }

    case "list_campaigns": {
      const params = new URLSearchParams();
      if (args.type) params.append("type", args.type);
      if (args.status) params.append("status", args.status);
      if (args.limit) params.append("limit", String(args.limit));
      if (args.offset) params.append("offset", String(args.offset));
      if (args.sort) params.append("sort", args.sort);
      const query = params.toString();
      return await client.get(`/emailCampaigns${query ? `?${query}` : ""}`);
    }

    case "create_campaign": {
      const payload: any = {
        name: args.name,
        subject: args.subject,
        sender: args.sender,
      };
      if (args.htmlContent) payload.htmlContent = args.htmlContent;
      if (args.templateId) payload.templateId = args.templateId;
      if (args.recipients) payload.recipients = args.recipients;
      if (args.scheduledAt) payload.scheduledAt = args.scheduledAt;
      if (args.replyTo) payload.replyTo = args.replyTo;
      if (args.toField) payload.toField = args.toField;
      if (args.tag) payload.tag = args.tag;
      return await client.post("/emailCampaigns", payload);
    }

    case "send_sms": {
      const payload: any = {
        sender: args.sender,
        recipient: args.recipient,
        content: args.content,
      };
      if (args.type) payload.type = args.type;
      if (args.tag) payload.tag = args.tag;
      if (args.webUrl) payload.webUrl = args.webUrl;
      return await client.post("/transactionalSMS/sms", payload);
    }

    case "list_templates": {
      const params = new URLSearchParams();
      if (args.templateStatus !== undefined) params.append("templateStatus", String(args.templateStatus));
      if (args.limit) params.append("limit", String(args.limit));
      if (args.offset) params.append("offset", String(args.offset));
      if (args.sort) params.append("sort", args.sort);
      const query = params.toString();
      return await client.get(`/smtp/templates${query ? `?${query}` : ""}`);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error("Error: BREVO_API_KEY environment variable required");
    process.exit(1);
  }

  const client = new BrevoClient(apiKey);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
