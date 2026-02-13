// Brevo API Types

export interface BrevoConfig {
  apiKey: string;
  baseUrl?: string;
}

// Contacts
export interface Contact {
  id: number;
  email: string;
  emailBlacklisted?: boolean;
  smsBlacklisted?: boolean;
  createdAt?: string;
  modifiedAt?: string;
  attributes?: Record<string, any>;
  listIds?: number[];
  listUnsubscribed?: number[];
}

export interface ContactAttribute {
  name: string;
  category: 'normal' | 'transactional' | 'category' | 'calculated' | 'global';
  type?: 'text' | 'date' | 'float' | 'id' | 'boolean';
  enumeration?: { value: number; label: string }[];
}

export interface ContactList {
  id: number;
  name: string;
  totalBlacklisted?: number;
  totalSubscribers?: number;
  uniqueSubscribers?: number;
  folderId?: number;
  createdAt?: string;
}

export interface Folder {
  id: number;
  name: string;
  totalBlacklisted?: number;
  totalSubscribers?: number;
  uniqueSubscribers?: number;
}

// Campaigns
export interface EmailCampaign {
  id: number;
  name: string;
  subject?: string;
  type: 'classic' | 'trigger' | 'ab';
  status: 'draft' | 'sent' | 'queued' | 'suspended' | 'archive';
  scheduledAt?: string;
  abTesting?: boolean;
  subjectA?: string;
  subjectB?: string;
  splitRule?: number;
  winnerCriteria?: string;
  winnerDelay?: number;
  sendAtBestTime?: boolean;
  htmlContent?: string;
  sender?: { name?: string; email?: string; id?: number };
  replyTo?: string;
  toField?: string;
  recipients?: { listIds?: number[]; exclusionListIds?: number[]; segmentIds?: number[] };
  attachmentUrl?: string;
  inlineImageActivation?: boolean;
  mirrorActive?: boolean;
  recurring?: boolean;
  createdAt?: string;
  modifiedAt?: string;
}

export interface CampaignReport {
  globalStats: {
    uniqueClicks: number;
    clickers: number;
    complaints: number;
    delivered: number;
    sent: number;
    softBounces: number;
    hardBounces: number;
    uniqueViews: number;
    trackableViews: number;
    unsubscriptions: number;
    viewed: number;
    deferred: number;
    returnBounce: number;
  };
  campaignStats: Array<{
    listId: number;
    uniqueClicks: number;
    clickers: number;
    complaints: number;
    delivered: number;
    sent: number;
    softBounces: number;
    hardBounces: number;
    uniqueViews: number;
    unsubscriptions: number;
    viewed: number;
  }>;
  mirrorClick: number;
  remaining: number;
  linksStats: Record<string, number>;
  statsByDomain: {
    [domain: string]: {
      delivered: number;
      softBounces: number;
      hardBounces: number;
      complaints: number;
      opened: number;
      clicked: number;
      unsubscribed: number;
    };
  };
  statsByDevice: {
    [device: string]: {
      viewed: number;
      clicked: number;
    };
  };
  statsByBrowser: Record<string, number>;
}

// Transactional
export interface TransactionalEmail {
  sender: { name?: string; email: string; id?: number };
  to: Array<{ email: string; name?: string }>;
  bcc?: Array<{ email: string; name?: string }>;
  cc?: Array<{ email: string; name?: string }>;
  htmlContent?: string;
  textContent?: string;
  subject?: string;
  replyTo?: { email: string; name?: string };
  attachment?: Array<{ url?: string; content?: string; name?: string }>;
  headers?: Record<string, string>;
  templateId?: number;
  params?: Record<string, any>;
  tags?: string[];
}

export interface TransactionalSMS {
  sender: string;
  recipient: string;
  content: string;
  type?: 'transactional' | 'marketing';
  tag?: string;
  webUrl?: string;
}

// Templates
export interface EmailTemplate {
  id: number;
  name: string;
  subject?: string;
  isActive?: boolean;
  testSent?: boolean;
  sender?: { name?: string; email?: string; id?: number };
  replyTo?: string;
  toField?: string;
  htmlContent?: string;
  createdAt?: string;
  modifiedAt?: string;
  tag?: string;
  attachmentUrl?: string;
}

// Senders
export interface Sender {
  id: number;
  name: string;
  email: string;
  active?: boolean;
  spf?: boolean;
  dkim?: boolean;
}

// Automations/Workflows
export interface Workflow {
  id: number;
  name: string;
  status: 'draft' | 'active' | 'inactive';
  createdAt?: string;
  modifiedAt?: string;
}

export interface WorkflowStats {
  sent: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  hardBounced: number;
  softBounced: number;
  goal: number;
  revenue: number;
}

// SMS Campaigns
export interface SMSCampaign {
  id: number;
  name: string;
  status: 'draft' | 'sent' | 'queued' | 'suspended' | 'inProcess';
  content: string;
  scheduledAt?: string;
  sender: string;
  recipients?: {
    listIds?: number[];
    exclusionListIds?: number[];
  };
  createdAt?: string;
  modifiedAt?: string;
}

// CRM Deals
export interface Deal {
  id: string;
  name: string;
  attributes?: Record<string, any>;
  linkedCompaniesIds?: string[];
  linkedContactsIds?: number[];
}

export interface Pipeline {
  id: string;
  name: string;
}

export interface Stage {
  id: string;
  name: string;
}

// Webhooks
export interface Webhook {
  id: number;
  url: string;
  description?: string;
  events: string[];
  type: 'marketing' | 'transactional';
  createdAt?: string;
  modifiedAt?: string;
  batched?: boolean;
  auth?: {
    type: 'bearer' | 'basic';
    token?: string;
    username?: string;
    password?: string;
  };
}

// API Response Types
export interface PaginatedResponse<T> {
  count?: number;
  contacts?: T[];
  campaigns?: T[];
  lists?: T[];
  folders?: T[];
  templates?: T[];
  senders?: T[];
  workflows?: T[];
  webhooks?: T[];
  deals?: T[];
  pipelines?: T[];
  limit?: number;
  offset?: number;
}

export interface ApiError {
  code: string;
  message: string;
}
