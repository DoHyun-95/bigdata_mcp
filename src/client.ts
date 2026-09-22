import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class BigdataApiClient {
  private client: AxiosInstance;
  private token: string;

  constructor(baseURL?: string, token?: string) {
    this.token = token || process.env.BIGDATA_MCP_TOKEN || '';
    const resolvedBaseURL = baseURL || process.env.BIGDATA_API_BASE_URL || 'http://localhost/api/v1';

    this.client = axios.create({
      baseURL: resolvedBaseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const activeToken = this.token || process.env.BIGDATA_MCP_TOKEN;
      if (activeToken) {
        config.headers['Authorization'] = `Bearer ${activeToken}`;
      }
      return config;
    });
  }

  public setToken(token: string) {
    this.token = token;
  }

  async get<T = any>(endpoint: string, params?: any): Promise<T> {
    try {
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async post<T = any>(endpoint: string, data?: any, idempotencyKey?: string): Promise<T> {
    try {
      const config: AxiosRequestConfig = {};
      if (idempotencyKey) {
        config.headers = { 'Idempotency-Key': idempotencyKey };
      }
      const response = await this.client.post(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.response?.data?.error) {
      const err = error.response.data.error;
      const detailsStr = err.details ? ` Details: ${JSON.stringify(err.details)}` : '';
      throw new Error(`[${err.code}] ${err.message}${detailsStr}`);
    }
    if (error.response) {
      throw new Error(`BIGDATA API Error: HTTP ${error.response.status} - ${error.response.statusText}`);
    }
    throw new Error(`BIGDATA Connection Error: ${error.message}`);
  }
}
