import axios, { AxiosInstance, AxiosError } from 'axios';
import { BrevoConfig, ApiError } from './index.js';

export class BrevoApiClient {
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

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          const apiError = error.response.data;
          throw new Error(
            `Brevo API Error (${error.response.status}): ${apiError?.message || error.message}`
          );
        }
        throw error;
      }
    );
  }

  // Generic GET request with pagination support
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  // Generic POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  // Generic PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  // Generic PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(endpoint, data);
    return response.data;
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }

  // Paginated list helper
  async getPaginated<T>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<{ items: T[]; total?: number }> {
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    
    const response = await this.get<any>(endpoint, { ...params, limit, offset });
    
    // Handle different response structures
    const items = 
      response.contacts ||
      response.campaigns ||
      response.lists ||
      response.folders ||
      response.templates ||
      response.senders ||
      response.workflows ||
      response.webhooks ||
      response.deals ||
      response.pipelines ||
      response.stages ||
      [];

    return {
      items,
      total: response.count,
    };
  }
}
