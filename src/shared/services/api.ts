import axios from 'axios';
import type { AxiosResponse } from 'axios';

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

class GenericsRequests {
  async GetUrl<T = unknown>(url: string, params?: object): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async PostUrl<T = unknown>(url: string, data: object): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async PostUrlWithParams<T = unknown>(
    url: string, 
    data: Record<string, unknown>, 
    params?: Record<string, unknown>
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async PutUrl<T = unknown>(url: string, data: Record<string, unknown>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async DeleteUrl<T = unknown>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async PatchUrl<T = unknown>(url: string, data: Record<string, unknown>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.patch(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'Error desconocido';
      return new Error(`API Error: ${message}`);
    }
    return error instanceof Error ? error : new Error('Error desconocido');
  }
}

const genericRequest = new GenericsRequests();
export default genericRequest;