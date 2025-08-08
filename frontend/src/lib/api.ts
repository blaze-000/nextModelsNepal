const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`API Error: ${error}`);
    }
  }

  // Generic CRUD operations
  async get<T>(endpoint: string): Promise<ApiResponse<T[]>> {
    return this.request<T[]>(endpoint);
  }

  async getById<T>(endpoint: string, id: string): Promise<ApiResponse<T>> {
    return this.request<T>(`${endpoint}/${id}`);
  }

  async create<T>(
    endpoint: string,
    data: FormData | object
  ): Promise<ApiResponse<T>> {
    const options: RequestInit = {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    };

    if (!(data instanceof FormData)) {
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    return this.request<T>(endpoint, options);
  }

  async update<T>(
    endpoint: string,
    id: string,
    data: FormData | object
  ): Promise<ApiResponse<T>> {
    const options: RequestInit = {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    };

    if (!(data instanceof FormData)) {
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    return this.request<T>(`${endpoint}/${id}`, options);
  }

  async delete<T>(endpoint: string, id: string): Promise<ApiResponse<T>> {
    return this.request<T>(`${endpoint}/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
