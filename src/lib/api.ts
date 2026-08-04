/**
 * Canadian Realtor Platform — Frontend API Service Client (Next.js App Router)
 * ─────────────────────────────────────────────────────────────────────────────
 * AMPRE IDX integration: ALL property data is fetched via Next.js server-side
 * Route Handlers under /api/ampre/. The Bearer token never reaches the browser.
 *
 * There is NO dependency on localhost:5000 or any Express backend.
 * ─────────────────────────────────────────────────────────────────────────────
 */

class ApiService {

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  // ── Auth (these can stay for future use) ────────────────────────────────────

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    }
  }

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const info = localStorage.getItem('user_info');
    return info ? JSON.parse(info) : null;
  }

  // ── AMPRE IDX — All calls go through Next.js server-side Route Handlers ─────
  // ── The Bearer token is injected server-side and NEVER reaches the client. ───

  /**
   * Fetch live MLS® listings from AMPRE OData via secure server-side proxy.
   * Filters: city, maxPrice, bedrooms, top (default 60)
   */
  async getAmpreProperties(params?: {
    city?:     string;
    maxPrice?: number;
    bedrooms?: number;
    top?:      number;
  }) {
    const query = new URLSearchParams();
    if (params?.city)     query.set('city',     params.city);
    if (params?.maxPrice) query.set('maxPrice', String(params.maxPrice));
    if (params?.bedrooms) query.set('bedrooms', String(params.bedrooms));
    if (params?.top)      query.set('top',      String(params.top));

    const qs  = query.toString();
    const url = `/api/ampre/properties${qs ? `?${qs}` : ''}`;
    const res = await fetch(url);
    return res.json();
  }

  /**
   * Fetch a single MLS® property by ListingKey from AMPRE via server-side proxy.
   * Returns normalized AmpreProperty including all Media/images.
   */
  async getAmprePropertyById(listingKey: string) {
    const res = await fetch(
      `/api/ampre/properties/${encodeURIComponent(listingKey)}`
    );
    return res.json();
  }

  // ── Kept for legacy compatibility (search AI sidebar) ───────────────────────
  // These still point to /api/ampre so there is NO localhost:5000 dependency.

  /** Alias for getAmpreProperties — used by pages that haven't been updated */
  async getProperties(params?: {
    city?:        string;
    propertyType?: string;
    minPrice?:    number;
    maxPrice?:    number;
    bedrooms?:    number;
    bathrooms?:   number;
    isFeatured?:  boolean;
    page?:        number;
    limit?:       number;
  }) {
    return this.getAmpreProperties({
      city:     params?.city,
      maxPrice: params?.maxPrice,
      bedrooms: params?.bedrooms,
    });
  }

  /** Alias for getAmprePropertyById */
  async getPropertyById(idOrSlug: string) {
    return this.getAmprePropertyById(idOrSlug);
  }
}

export const apiService = new ApiService();
