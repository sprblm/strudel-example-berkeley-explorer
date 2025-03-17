import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * HTTP client for making requests to external APIs
 */
class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(options: {
    baseUrl: string;
    headers?: Record<string, string>;
    timeout?: number;
  }) {
    this.baseUrl = options.baseUrl;
    this.defaultHeaders = options.headers || {};
    this.timeout = options.timeout || 30000; // Default timeout of 30 seconds
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
      headers: { ...this.defaultHeaders, ...headers },
      timeout: this.timeout,
    };

    try {
      const response: AxiosResponse<T> = await axios.get<T>(
        `${this.baseUrl}${path}`,
        config
      );
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
      headers: { ...this.defaultHeaders, ...headers },
      timeout: this.timeout,
    };

    try {
      const response: AxiosResponse<T> = await axios.post<T>(
        `${this.baseUrl}${path}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Handle errors from API requests
   */
  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      // Log the error
      console.error(`API Error (${status}): ${message}`);

      // Rethrow with more context
      throw new Error(`API request failed: ${message}`);
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
}

export { HttpClient };
