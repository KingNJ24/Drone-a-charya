import { getApiBaseUrl } from './api-base'

class ApiClient {
  private get token(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('dronehub_token')
  }

  private set token(value: string | null) {
    if (typeof window === 'undefined') return
    if (value) {
      localStorage.setItem('dronehub_token', value)
    } else {
      localStorage.removeItem('dronehub_token')
    }
  }

  private getHeaders(headers: HeadersInit = {}): HeadersInit {
    const authHeader: HeadersInit = this.token
      ? { Authorization: `Bearer ${this.token}` }
      : {}
    return {
      'Content-Type': 'application/json',
      ...authHeader,
      ...headers,
    }
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseUrl = getApiBaseUrl()
    const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`

    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders(options.headers),
    })

    if (response.status === 204) {
      return {} as T
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'An error occurred')
    }

    return data as T
  }

  async get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  async post<T>(path: string, body: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async put<T>(path: string, body: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  async patch<T>(path: string, body: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }

  setToken(token: string) {
    this.token = token
  }

  logout() {
    this.token = null
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

export const apiClient = new ApiClient()
