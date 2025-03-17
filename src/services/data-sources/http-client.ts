import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * HTTP client for making requests to external APIs
 */
class HttpClient {
  private instance: AxiosInstance;

  constructor(options: {
    baseUrl: string;
    headers?: Record<string, string>;
    timeout?: number;
  }) {
    this.instance = axios.create({
      baseURL: options.baseUrl,
      headers: options.headers,
      timeout: options.timeout || 30000, // Default timeout of 30 seconds
    });
  }

  /**
   * Make a GET request
   */
  async get<T>(
    path: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      params,
      headers: headers,
    };

    try {
      const response: AxiosResponse<T> = await this.instance.get<T>(path, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(
    path: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      headers: headers,
    };

    try {
      const response: AxiosResponse<T> = await this.instance.post<T>(path, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Handle errors from API requests
   */
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`API request failed: ${message}`);
    }
    throw error;
  }
}

export { HttpClient };
