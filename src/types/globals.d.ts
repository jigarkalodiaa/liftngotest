import 'axios';

/**
 * Axios methods return unwrapped data (not AxiosResponse) because the
 * response interceptor strips the Axios envelope automatically.
 */
declare module 'axios' {
  export interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  }
}

declare global {
  /**
   * Standard backend API response envelope.
   * All external API endpoints wrap their response in this shape.
   */
  interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
  }
}

export {};
