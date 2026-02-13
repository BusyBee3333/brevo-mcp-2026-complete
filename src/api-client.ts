/**
 * Brevo API Client
 * API v3: https://api.brevo.com/v3/
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  BrevoConfig,
  Contact,
  CreateContactParams,
  UpdateContactParams,
  ContactList,
  EmailCampaign,
  CreateEmailCampaignParams,
  SendSmtpEmail,
  SendSmtpEmailResponse,
  SendTransacSms,
  SendTransacSmsResponse,
  SmsCampaign,
  CreateSmsCampaignParams,
  EmailTemplate,
  CreateEmailTemplateParams,
  Sender,
  CreateSenderParams,
  Automation,
  Deal,
  CreateDealParams,
  Company,
  CreateCompanyParams,
  Task,
  CreateTaskParams,
  Webhook,
  CreateWebhookParams,
  AccountInfo,
  EmailEventReport,
  Folder,
  CreateFolderParams,
  Process,
  CreateDoiContactParams,
  PaginationParams,
  DateRangeParams,
} from './types/index.js';

export class BrevoAPIClient {
  private client: AxiosInstance;

  constructor(config: BrevoConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.brevo.com/v3',
      headers: {
        'api-key': config.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const errorMessage = error.response?.data 
          ? JSON.stringify(error.response.data) 
          : error.message;
        throw new Error(`Brevo API Error: ${errorMessage}`);
      }
    );
  }

  // ============================================================================
  // CONTACTS
  // ============================================================================

  async getContact(identifier: string): Promise<Contact> {
    const { data } = await this.client.get(`/contacts/${encodeURIComponent(identifier)}`);
    return data;
  }

  async createContact(params: CreateContactParams): Promise<{ id: number }> {
    const { data } = await this.client.post('/contacts', params);
    return data;
  }

  async updateContact(identifier: string, params: UpdateContactParams): Promise<void> {
    await this.client.put(`/contacts/${encodeURIComponent(identifier)}`, params);
  }

  async deleteContact(identifier: string): Promise<void> {
    await this.client.delete(`/contacts/${encodeURIComponent(identifier)}`);
  }

  async getContacts(params?: PaginationParams & { modifiedSince?: string; listIds?: number[]; sort?: string }): Promise<{ contacts: Contact[]; count: number }> {
    const { data } = await this.client.get('/contacts', { params });
    return data;
  }

  async importContacts(params: {
    fileBody?: string;
    fileUrl?: string;
    listIds?: number[];
    notifyUrl?: string;
    newList?: { listName: string; folderId?: number };
    emailBlacklist?: boolean;
    smsBlacklist?: boolean;
    updateExistingContacts?: boolean;
    emptyContactsAttributes?: boolean;
  }): Promise<{ processId: number }> {
    const { data } = await this.client.post('/contacts/import', params);
    return data;
  }

  async exportContacts(params: {
    exportAttributes?: string[];
    filter?: Record<string, any>;
    notifyUrl?: string;
  }): Promise<{ exportId: string }> {
    const { data } = await this.client.post('/contacts/export', params);
    return data;
  }

  async addContactToList(listId: number, contactEmails: string[]): Promise<{ contacts: { success: string[]; failure: string[] } }> {
    const { data } = await this.client.post(`/contacts/lists/${listId}/contacts/add`, { emails: contactEmails });
    return data;
  }

  async removeContactFromList(listId: number, contactEmails: string[]): Promise<{ contacts: { success: string[]; failure: string[] } }> {
    const { data } = await this.client.post(`/contacts/lists/${listId}/contacts/remove`, { emails: contactEmails });
    return data;
  }

  async getContactStats(identifier: string): Promise<any> {
    const { data } = await this.client.get(`/contacts/${encodeURIComponent(identifier)}/campaignStats`);
    return data;
  }

  async getContactAttributes(): Promise<{ attributes: any[] }> {
    const { data } = await this.client.get('/contacts/attributes');
    return data;
  }

  async createAttribute(params: {
    value?: string;
    enumeration?: { value: number; label: string }[];
    type?: 'text' | 'date' | 'float' | 'boolean' | 'id';
    isRecurring?: boolean;
    category?: 'normal' | 'transactional' | 'category' | 'calculated' | 'global';
  }): Promise<void> {
    await this.client.post('/contacts/attributes/normal', params);
  }

  async createDoiContact(params: CreateDoiContactParams): Promise<void> {
    await this.client.post('/contacts/doubleOptinConfirmation', params);
  }

  // ============================================================================
  // LISTS
  // ============================================================================

  async getLists(params?: PaginationParams & { sort?: string }): Promise<{ lists: ContactList[]; count: number }> {
    const { data } = await this.client.get('/contacts/lists', { params });
    return data;
  }

  async getList(listId: number): Promise<ContactList> {
    const { data } = await this.client.get(`/contacts/lists/${listId}`);
    return data;
  }

  async createList(params: { name: string; folderId?: number }): Promise<{ id: number }> {
    const { data } = await this.client.post('/contacts/lists', params);
    return data;
  }

  async updateList(listId: number, params: { name?: string; folderId?: number }): Promise<void> {
    await this.client.put(`/contacts/lists/${listId}`, params);
  }

  async deleteList(listId: number): Promise<void> {
    await this.client.delete(`/contacts/lists/${listId}`);
  }

  async getContactsFromList(listId: number, params?: PaginationParams & { modifiedSince?: string; sort?: string }): Promise<{ contacts: Contact[]; count: number }> {
    const { data } = await this.client.get(`/contacts/lists/${listId}/contacts`, { params });
    return data;
  }

  // ============================================================================
  // FOLDERS
  // ============================================================================

  async getFolders(params?: { limit?: number; offset?: number }): Promise<{ folders: Folder[]; count: number }> {
    const { data } = await this.client.get('/contacts/folders', { params });
    return data;
  }

  async getFolder(folderId: number): Promise<Folder> {
    const { data } = await this.client.get(`/contacts/folders/${folderId}`);
    return data;
  }

  async createFolder(params: CreateFolderParams): Promise<{ id: number }> {
    const { data } = await this.client.post('/contacts/folders', params);
    return data;
  }

  async updateFolder(folderId: number, params: { name: string }): Promise<void> {
    await this.client.put(`/contacts/folders/${folderId}`, params);
  }

  async deleteFolder(folderId: number): Promise<void> {
    await this.client.delete(`/contacts/folders/${folderId}`);
  }

  async getListsInFolder(folderId: number, params?: PaginationParams & { sort?: string }): Promise<{ lists: ContactList[]; count: number }> {
    const { data } = await this.client.get(`/contacts/folders/${folderId}/lists`, { params });
    return data;
  }

  // ============================================================================
  // EMAIL CAMPAIGNS
  // ============================================================================

  async getEmailCampaigns(params?: {
    type?: 'classic' | 'trigger';
    status?: 'draft' | 'sent' | 'queued' | 'suspended' | 'archive';
    limit?: number;
    offset?: number;
    sort?: string;
    excludeHtmlContent?: boolean;
  }): Promise<{ campaigns: EmailCampaign[]; count: number }> {
    const { data } = await this.client.get('/emailCampaigns', { params });
    return data;
  }

  async getEmailCampaign(campaignId: number): Promise<EmailCampaign> {
    const { data } = await this.client.get(`/emailCampaigns/${campaignId}`);
    return data;
  }

  async createEmailCampaign(params: CreateEmailCampaignParams): Promise<{ id: number }> {
    const { data } = await this.client.post('/emailCampaigns', params);
    return data;
  }

  async updateEmailCampaign(campaignId: number, params: Partial<CreateEmailCampaignParams>): Promise<void> {
    await this.client.put(`/emailCampaigns/${campaignId}`, params);
  }

  async deleteEmailCampaign(campaignId: number): Promise<void> {
    await this.client.delete(`/emailCampaigns/${campaignId}`);
  }

  async sendEmailCampaignNow(campaignId: number): Promise<void> {
    await this.client.post(`/emailCampaigns/${campaignId}/sendNow`);
  }

  async sendTestEmail(campaignId: number, emailTo: string[]): Promise<void> {
    await this.client.post(`/emailCampaigns/${campaignId}/sendTest`, { emailTo });
  }

  async updateEmailCampaignStatus(campaignId: number, status: 'draft' | 'suspended' | 'archive'): Promise<void> {
    await this.client.put(`/emailCampaigns/${campaignId}/status`, { status });
  }

  async getEmailCampaignReport(campaignId: number, params?: DateRangeParams): Promise<any> {
    const { data } = await this.client.get(`/emailCampaigns/${campaignId}/report`, { params });
    return data;
  }

  async exportEmailCampaignRecipients(campaignId: number, params?: {
    notifyURL?: string;
    recipientsType?: 'all' | 'nonClickers' | 'nonOpeners' | 'clickers' | 'openers' | 'softBounces' | 'hardBounces' | 'unsubscribed';
  }): Promise<{ exportId: string }> {
    const { data } = await this.client.post(`/emailCampaigns/${campaignId}/exportRecipients`, params);
    return data;
  }

  // ============================================================================
  // TRANSACTIONAL EMAILS (SMTP)
  // ============================================================================

  async sendTransacEmail(params: SendSmtpEmail): Promise<SendSmtpEmailResponse> {
    const { data } = await this.client.post('/smtp/email', params);
    return data;
  }

  async getTransacEmailContent(uuid: string): Promise<any> {
    const { data } = await this.client.get(`/smtp/emails/${uuid}`);
    return data;
  }

  async deleteScheduledEmail(identifier: string): Promise<void> {
    await this.client.delete(`/smtp/email/${identifier}`);
  }

  async getTransacEmailEvents(params?: {
    limit?: number;
    offset?: number;
    email?: string;
    templateId?: number;
    messageId?: string;
    tags?: string;
    event?: string;
    days?: number;
    sort?: string;
  } & DateRangeParams): Promise<EmailEventReport> {
    const { data } = await this.client.get('/smtp/statistics/events', { params });
    return data;
  }

  async getTransacEmailStats(params?: DateRangeParams & { days?: number; tag?: string }): Promise<any> {
    const { data } = await this.client.get('/smtp/statistics/aggregatedReport', { params });
    return data;
  }

  async getTransacEmailReports(params?: DateRangeParams & { days?: number; tag?: string; sort?: string }): Promise<any> {
    const { data } = await this.client.get('/smtp/statistics/reports', { params });
    return data;
  }

  async getBlockedDomains(): Promise<{ domains: string[] }> {
    const { data } = await this.client.get('/smtp/blockedDomains');
    return data;
  }

  async blockDomain(domain: string): Promise<void> {
    await this.client.post('/smtp/blockedDomains', { domain });
  }

  async unblockDomain(domain: string): Promise<void> {
    await this.client.delete(`/smtp/blockedDomains/${domain}`);
  }

  async getBlockedEmails(): Promise<{ emails: any[] }> {
    const { data } = await this.client.get('/smtp/blockedContacts');
    return data;
  }

  async blockEmail(params: { emails: string[] }): Promise<void> {
    await this.client.post('/smtp/blockedContacts', params);
  }

  async unblockEmail(email: string): Promise<void> {
    await this.client.delete(`/smtp/blockedContacts/${email}`);
  }

  async getEmailActivityLog(messageId: string): Promise<any> {
    const { data } = await this.client.get(`/smtp/emails/${messageId}/activity`);
    return data;
  }

  // ============================================================================
  // EMAIL TEMPLATES
  // ============================================================================

  async getEmailTemplates(params?: { templateStatus?: boolean; limit?: number; offset?: number; sort?: string }): Promise<{ templates: EmailTemplate[]; count: number }> {
    const { data } = await this.client.get('/smtp/templates', { params });
    return data;
  }

  async getEmailTemplate(templateId: number): Promise<EmailTemplate> {
    const { data } = await this.client.get(`/smtp/templates/${templateId}`);
    return data;
  }

  async createEmailTemplate(params: CreateEmailTemplateParams): Promise<{ id: number }> {
    const { data } = await this.client.post('/smtp/templates', params);
    return data;
  }

  async updateEmailTemplate(templateId: number, params: Partial<CreateEmailTemplateParams>): Promise<void> {
    await this.client.put(`/smtp/templates/${templateId}`, params);
  }

  async deleteEmailTemplate(templateId: number): Promise<void> {
    await this.client.delete(`/smtp/templates/${templateId}`);
  }

  async sendTestEmailTemplate(templateId: number, params: { emailTo: string[] }): Promise<void> {
    await this.client.post(`/smtp/templates/${templateId}/sendTest`, params);
  }

  // ============================================================================
  // SENDERS
  // ============================================================================

  async getSenders(params?: { ip?: string; domain?: string }): Promise<{ senders: Sender[] }> {
    const { data } = await this.client.get('/senders', { params });
    return data;
  }

  async getSender(senderId: number): Promise<Sender> {
    const { data } = await this.client.get(`/senders/${senderId}`);
    return data;
  }

  async createSender(params: CreateSenderParams): Promise<{ id: number }> {
    const { data } = await this.client.post('/senders', params);
    return data;
  }

  async updateSender(senderId: number, params: { name?: string; email?: string; ips?: { ip: string; domain: string }[] }): Promise<void> {
    await this.client.put(`/senders/${senderId}`, params);
  }

  async deleteSender(senderId: number): Promise<void> {
    await this.client.delete(`/senders/${senderId}`);
  }

  async validateSenderDomain(domain: string): Promise<any> {
    const { data } = await this.client.get(`/senders/domains/${domain}/validate`);
    return data;
  }

  async authenticateSenderDomain(domain: string): Promise<any> {
    const { data } = await this.client.put(`/senders/domains/${domain}/authenticate`);
    return data;
  }

  // ============================================================================
  // SMS
  // ============================================================================

  async sendTransacSms(params: SendTransacSms): Promise<SendTransacSmsResponse> {
    const { data } = await this.client.post('/transactionalSMS/sms', params);
    return data;
  }

  async getTransacSmsEvents(params?: {
    limit?: number;
    offset?: number;
    phoneNumber?: string;
    event?: string;
    tags?: string;
    sort?: string;
    days?: number;
  } & DateRangeParams): Promise<any> {
    const { data } = await this.client.get('/transactionalSMS/statistics/events', { params });
    return data;
  }

  async getTransacSmsReports(params?: DateRangeParams & { days?: number; tag?: string; sort?: string }): Promise<any> {
    const { data } = await this.client.get('/transactionalSMS/statistics/reports', { params });
    return data;
  }

  async getTransacSmsStats(params?: DateRangeParams & { days?: number; tag?: string }): Promise<any> {
    const { data } = await this.client.get('/transactionalSMS/statistics/aggregatedReport', { params });
    return data;
  }

  async getSmsCampaigns(params?: {
    status?: 'draft' | 'sent' | 'queued' | 'suspended' | 'inProgress';
    limit?: number;
    offset?: number;
    sort?: string;
  } & DateRangeParams): Promise<{ campaigns: SmsCampaign[]; count: number }> {
    const { data } = await this.client.get('/smsCampaigns', { params });
    return data;
  }

  async getSmsCampaign(campaignId: number): Promise<SmsCampaign> {
    const { data } = await this.client.get(`/smsCampaigns/${campaignId}`);
    return data;
  }

  async createSmsCampaign(params: CreateSmsCampaignParams): Promise<{ id: number }> {
    const { data } = await this.client.post('/smsCampaigns', params);
    return data;
  }

  async updateSmsCampaign(campaignId: number, params: Partial<CreateSmsCampaignParams>): Promise<void> {
    await this.client.put(`/smsCampaigns/${campaignId}`, params);
  }

  async deleteSmsCampaign(campaignId: number): Promise<void> {
    await this.client.delete(`/smsCampaigns/${campaignId}`);
  }

  async sendSmsCampaignNow(campaignId: number): Promise<void> {
    await this.client.post(`/smsCampaigns/${campaignId}/sendNow`);
  }

  async sendTestSms(campaignId: number, phoneNumber: string): Promise<void> {
    await this.client.post(`/smsCampaigns/${campaignId}/sendTest`, { phoneNumber });
  }

  async updateSmsCampaignStatus(campaignId: number, status: 'draft' | 'suspended' | 'archive'): Promise<void> {
    await this.client.put(`/smsCampaigns/${campaignId}/status`, { status });
  }

  async requestSmsSender(senderName: string): Promise<void> {
    await this.client.post('/senders/sms', { senderName });
  }

  async getSmsSenders(params?: { limit?: number; offset?: number }): Promise<{ senders: any[] }> {
    const { data } = await this.client.get('/senders/sms', { params });
    return data;
  }

  // ============================================================================
  // AUTOMATIONS (WORKFLOWS)
  // ============================================================================

  async getAutomations(params?: { limit?: number; offset?: number; sort?: string }): Promise<{ automations: Automation[] }> {
    const { data } = await this.client.get('/automation/workflows', { params });
    return data;
  }

  async getAutomation(workflowId: number): Promise<Automation> {
    const { data } = await this.client.get(`/automation/workflows/${workflowId}`);
    return data;
  }

  async deleteAutomation(workflowId: number): Promise<void> {
    await this.client.delete(`/automation/workflows/${workflowId}`);
  }

  // ============================================================================
  // CRM - DEALS
  // ============================================================================

  async getDeals(params?: {
    'filters[attributes.deal_name]'?: string;
    'filters[attributes.deal_stage]'?: string;
    'filters[linkedContactsIds]'?: number;
    'filters[linkedCompaniesIds]'?: string;
    limit?: number;
    offset?: number;
    sort?: string;
  }): Promise<{ items: Deal[] }> {
    const { data } = await this.client.get('/crm/deals', { params });
    return data;
  }

  async getDeal(dealId: string): Promise<Deal> {
    const { data } = await this.client.get(`/crm/deals/${dealId}`);
    return data;
  }

  async createDeal(params: CreateDealParams): Promise<{ id: string }> {
    const { data } = await this.client.post('/crm/deals', params);
    return data;
  }

  async updateDeal(dealId: string, params: Partial<CreateDealParams>): Promise<void> {
    await this.client.patch(`/crm/deals/${dealId}`, params);
  }

  async deleteDeal(dealId: string): Promise<void> {
    await this.client.delete(`/crm/deals/${dealId}`);
  }

  async linkDealWithContact(dealId: string, contactId: number): Promise<void> {
    await this.client.patch(`/crm/deals/link-unlink/${dealId}`, {
      linkContactIds: [contactId],
    });
  }

  async unlinkDealFromContact(dealId: string, contactId: number): Promise<void> {
    await this.client.patch(`/crm/deals/link-unlink/${dealId}`, {
      unlinkContactIds: [contactId],
    });
  }

  async getDealsPipeline(): Promise<any> {
    const { data } = await this.client.get('/crm/pipeline/details');
    return data;
  }

  async getDealAttributes(): Promise<{ attributes: any[] }> {
    const { data } = await this.client.get('/crm/deals/attributes');
    return data;
  }

  // ============================================================================
  // CRM - COMPANIES
  // ============================================================================

  async getCompanies(params?: {
    'filters[attributes.name]'?: string;
    'filters[linkedContactsIds]'?: number;
    'filters[linkedDealsIds]'?: string;
    limit?: number;
    offset?: number;
    sort?: string;
  }): Promise<{ items: Company[] }> {
    const { data } = await this.client.get('/crm/companies', { params });
    return data;
  }

  async getCompany(companyId: string): Promise<Company> {
    const { data } = await this.client.get(`/crm/companies/${companyId}`);
    return data;
  }

  async createCompany(params: CreateCompanyParams): Promise<{ id: string }> {
    const { data } = await this.client.post('/crm/companies', params);
    return data;
  }

  async updateCompany(companyId: string, params: Partial<CreateCompanyParams>): Promise<void> {
    await this.client.patch(`/crm/companies/${companyId}`, params);
  }

  async deleteCompany(companyId: string): Promise<void> {
    await this.client.delete(`/crm/companies/${companyId}`);
  }

  async linkCompanyWithContact(companyId: string, contactId: number): Promise<void> {
    await this.client.patch(`/crm/companies/link-unlink/${companyId}`, {
      linkContactIds: [contactId],
    });
  }

  async unlinkCompanyFromContact(companyId: string, contactId: number): Promise<void> {
    await this.client.patch(`/crm/companies/link-unlink/${companyId}`, {
      unlinkContactIds: [contactId],
    });
  }

  async getCompanyAttributes(): Promise<{ attributes: any[] }> {
    const { data } = await this.client.get('/crm/companies/attributes');
    return data;
  }

  // ============================================================================
  // CRM - TASKS
  // ============================================================================

  async getTasks(params?: {
    'filterType'?: 'contacts' | 'companies' | 'deals';
    'filterId'?: string;
    'dateFrom'?: string;
    'dateTo'?: string;
    limit?: number;
    offset?: number;
    sort?: string;
  }): Promise<{ items: Task[] }> {
    const { data } = await this.client.get('/crm/tasks', { params });
    return data;
  }

  async getTask(taskId: string): Promise<Task> {
    const { data } = await this.client.get(`/crm/tasks/${taskId}`);
    return data;
  }

  async createTask(params: CreateTaskParams): Promise<{ id: string }> {
    const { data } = await this.client.post('/crm/tasks', params);
    return data;
  }

  async updateTask(taskId: string, params: Partial<CreateTaskParams>): Promise<void> {
    await this.client.patch(`/crm/tasks/${taskId}`, params);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.client.delete(`/crm/tasks/${taskId}`);
  }

  async getTaskTypes(): Promise<{ taskTypes: any[] }> {
    const { data } = await this.client.get('/crm/tasktypes');
    return data;
  }

  // ============================================================================
  // CRM - NOTES
  // ============================================================================

  async getNotes(params?: {
    entity?: 'companies' | 'deals' | 'contacts';
    entityIds?: string;
    dateFrom?: number;
    dateTo?: number;
    limit?: number;
    offset?: number;
    sort?: string;
  }): Promise<{ items: any[] }> {
    const { data } = await this.client.get('/crm/notes', { params });
    return data;
  }

  async getNote(noteId: string): Promise<any> {
    const { data } = await this.client.get(`/crm/notes/${noteId}`);
    return data;
  }

  async createNote(params: {
    text: string;
    contactIds?: number[];
    dealIds?: string[];
    companyIds?: string[];
  }): Promise<{ id: string }> {
    const { data } = await this.client.post('/crm/notes', params);
    return data;
  }

  async updateNote(noteId: string, params: { text: string }): Promise<void> {
    await this.client.patch(`/crm/notes/${noteId}`, params);
  }

  async deleteNote(noteId: string): Promise<void> {
    await this.client.delete(`/crm/notes/${noteId}`);
  }

  // ============================================================================
  // WEBHOOKS
  // ============================================================================

  async getWebhooks(params?: { type?: 'marketing' | 'transactional' | 'inbound'; sort?: string }): Promise<{ webhooks: Webhook[] }> {
    const { data } = await this.client.get('/webhooks', { params });
    return data;
  }

  async getWebhook(webhookId: number): Promise<Webhook> {
    const { data } = await this.client.get(`/webhooks/${webhookId}`);
    return data;
  }

  async createWebhook(params: CreateWebhookParams): Promise<{ id: number }> {
    const { data } = await this.client.post('/webhooks', params);
    return data;
  }

  async updateWebhook(webhookId: number, params: Partial<CreateWebhookParams>): Promise<void> {
    await this.client.put(`/webhooks/${webhookId}`, params);
  }

  async deleteWebhook(webhookId: number): Promise<void> {
    await this.client.delete(`/webhooks/${webhookId}`);
  }

  async exportWebhookEvents(webhookId: number, params?: {
    startDate?: string;
    endDate?: string;
    days?: number;
    messageId?: string;
    email?: string;
    event?: string;
    notifyURL?: string;
  }): Promise<{ exportId: string }> {
    const { data } = await this.client.post(`/webhooks/${webhookId}/export`, params);
    return data;
  }

  // ============================================================================
  // ACCOUNT
  // ============================================================================

  async getAccount(): Promise<AccountInfo> {
    const { data } = await this.client.get('/account');
    return data;
  }

  // ============================================================================
  // PROCESSES
  // ============================================================================

  async getProcess(processId: number): Promise<Process> {
    const { data } = await this.client.get(`/processes/${processId}`);
    return data;
  }

  async getProcesses(params?: { limit?: number; offset?: number; sort?: string }): Promise<{ processes: Process[] }> {
    const { data } = await this.client.get('/processes', { params });
    return data;
  }

  // ============================================================================
  // INBOUND PARSING
  // ============================================================================

  async getInboundEmailEvents(params?: {
    sender?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
    sort?: string;
  }): Promise<{ events: any[] }> {
    const { data } = await this.client.get('/inbound/events', { params });
    return data;
  }

  async getInboundEmailAttachment(downloadToken: string): Promise<any> {
    const { data } = await this.client.get(`/inbound/attachments/${downloadToken}`);
    return data;
  }
}
