/**
 * Canadian Realtor Platform - Frontend API Service Client for Next.js App Router
 * Handles HTTP requests, JWT authentication tokens, and backend communication.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiService {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Ping backend health endpoint to check connection
   */
  async checkBackendHealth(): Promise<{ isConnected: boolean; message: string }> {
    try {
      const res = await fetch('/health').catch(() => fetch('http://localhost:5000/health'));
      if (!res || !res.ok) throw new Error(res ? `HTTP ${res.status}` : 'Offline');
      const data = await res.json();
      return { isConnected: data.success === true, message: data.message || 'Connected to Canadian Realtor Backend API' };
    } catch (err: any) {
      return { isConnected: false, message: 'Backend server offline (Mock/Local Mode)' };
    }
  }

  /**
   * Authenticate user (Login)
   */
  async login(email: string, passwordHash: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password: passwordHash })
    });
    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.data.accessToken);
        localStorage.setItem('user_info', JSON.stringify(data.data.user || data.data));
      }
    }
    return data;
  }

  /**
   * Register new user (Signup)
   */
  async signup(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'BUYER' | 'SELLER' | 'AGENT' | 'ADMIN';
  }) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    return await res.json();
  }

  /**
   * Logout user
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    }
  }

  /**
   * Get current user info from token/localStorage
   */
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const info = localStorage.getItem('user_info');
    return info ? JSON.parse(info) : null;
  }

  /**
   * Fetch listing properties from backend
   */
  async getProperties(params?: {
    city?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          queryParams.append(key, String(val));
        }
      });
    }
    const url = `${API_BASE_URL}/properties?${queryParams.toString()}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    return await res.json();
  }

  /**
   * Get single property details by ID or Slug
   */
  async getPropertyById(idOrSlug: string) {
    const res = await fetch(`${API_BASE_URL}/properties/${idOrSlug}`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }

  /**
   * Full-text search
   */
  async searchProperties(query: string) {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }

  /**
   * Create an appointment (Schedule viewing)
   */
  async createAppointment(appointmentData: {
    propertyId: string;
    appointmentDate: string;
    notes?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(appointmentData)
    });
    return await res.json();
  }

  /**
   * Home valuation request (Seller experience)
   */
  async requestHomeValuation(valuationData: {
    address: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    notes?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/seller/valuation`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(valuationData)
    });
    return await res.json();
  }

  /**
   * AI Real Estate Assistant prompt parsing / Q&A
   */
  async queryAIAssistant(prompt: string) {
    const res = await fetch(`${API_BASE_URL}/ai/assistant`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ prompt })
    });
    return await res.json();
  }

  /**
   * Parse natural language search into structured query
   */
  async parseAISearch(prompt: string) {
    const res = await fetch(`${API_BASE_URL}/ai/search-parse`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ prompt })
    });
    return await res.json();
  }

  /**
   * Fetch market statistics
   */
  async getMarketStats(region = 'GTA') {
    const res = await fetch(`${API_BASE_URL}/analytics/market?region=${encodeURIComponent(region)}`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }

  /**
   * Buyer saved properties list
   */
  async getSavedProperties() {
    const res = await fetch(`${API_BASE_URL}/buyer/saved-properties`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }

  /**
   * Save a property
   */
  async saveProperty(propertyId: string) {
    const res = await fetch(`${API_BASE_URL}/buyer/saved-properties`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ propertyId })
    });
    return await res.json();
  }

  /**
   * Unsave a property
   */
  async unsaveProperty(propertyId: string) {
    const res = await fetch(`${API_BASE_URL}/buyer/saved-properties/${propertyId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return await res.json();
  }

  /**
   * Buyer appointments list
   */
  async getAppointments() {
    const res = await fetch(`${API_BASE_URL}/buyer/appointments`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }

  /**
   * Admin sync logs
   */
  async getAdminSyncLogs() {
    const res = await fetch(`${API_BASE_URL}/admin/sync/logs`, {
      headers: this.getHeaders()
    });
    return await res.json();
  }

  /**
   * Trigger TRREB/MLS sync job manually
   */
  async triggerAdminSync() {
    const res = await fetch(`${API_BASE_URL}/admin/sync/trigger`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return await res.json();
  }
}

export const apiService = new ApiService();
