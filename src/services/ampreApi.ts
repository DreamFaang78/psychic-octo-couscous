/**
 * services/ampreApi.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable AMPRE IDX OData service — SERVER-SIDE ONLY.
 * Never import this file from client components or pages marked "use client".
 * The AMPRE_IDX_TOKEN is read only from process.env here — never exposed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const AMPRE_BASE = 'https://query.ampre.ca/odata';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AmpreMedia {
  MediaKey:      string;
  MediaURL:      string;
  MediaCategory: string;
  Order:         number;
  LongDescription?: string;
}

export interface AmpreProperty {
  id:           string;
  mlsNumber:    string;
  price:        number;
  address:      string;
  city:         string;
  province:     string;
  postalCode:   string;
  bedrooms:     number;
  bathrooms:    number;
  squareFeet:   number | null;
  propertyType: string;
  status:       string;
  description:  string;
  image:        string;          // primary image URL
  images:       { url: string; caption?: string }[];
  garage:       number | null;
  yearBuilt:    number | null;
  lotSize:      number | null;
  lotSizeUnits: string;
  transactionType: string;
}

export interface AmpreListResult {
  properties: AmpreProperty[];
  total:      number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getToken(): string {
  const token = process.env.AMPRE_IDX_TOKEN;
  if (!token) throw new Error('AMPRE_IDX_TOKEN is not set in environment variables.');
  return token;
}

function authHeaders() {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Accept':        'application/json',
    'OData-Version': '4.0',
  };
}

/** Filter and deduplicate photos from AMPRE Media array */
function sortMedia(media: any[]): AmpreMedia[] {
  if (!Array.isArray(media) || media.length === 0) return [];

  // 1. Filter out non-photo items (Documents, PDFs, virtual tours, non-images)
  const photoItems = media.filter((m: any) => {
    if (!m || !m.MediaURL) return false;
    const cat = (m.MediaCategory || m.MediaObjectType || '').toLowerCase();
    if (cat && cat !== 'photo' && cat !== 'property photo') return false;

    const url = m.MediaURL.toLowerCase();
    if (url.includes('.pdf') || url.includes('lnpkzg') || url.includes('/d/')) return false;

    return true;
  });

  // 2. Group by base MediaKey or photo ID (stripping variant suffixes like -l, -m, -nw, -t, -s)
  const groups = new Map<string, any[]>();
  for (const item of photoItems) {
    const key = item.MediaKey
      ? item.MediaKey.replace(/-(l|m|nw|t|s)$/i, '')
      : (item.MediaURL.split('/').pop() || item.Order?.toString() || Math.random().toString());
    
    const groupKey = `${item.Order ?? 0}_${key}`;
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(item);
  }

  // 3. From each group of size variants for the same photo, select the optimal resolution variant
  const uniquePhotos: any[] = [];
  for (const variants of groups.values()) {
    let best = variants.find((v: any) => (v.MediaKey && /-l$/i.test(v.MediaKey)) || v.MediaURL.includes('1920:1920'));
    if (!best) {
      best = variants.find((v: any) => (v.MediaKey && /-m$/i.test(v.MediaKey)) || v.MediaURL.includes('960:960'));
    }
    if (!best) {
      best = variants.find((v: any) => v.MediaKey && !/-(t|s)$/i.test(v.MediaKey));
    }
    if (!best) {
      best = variants[0];
    }
    uniquePhotos.push(best);
  }

  // 4. Sort by MLS Order
  uniquePhotos.sort((a, b) => (a.Order ?? 999) - (b.Order ?? 999));

  return uniquePhotos.map((m: any) => ({
    MediaKey: m.MediaKey || '',
    MediaURL: m.MediaURL || '',
    MediaCategory: m.MediaCategory || 'Photo',
    Order: m.Order ?? 0,
    LongDescription: m.LongDescription || m.ShortDescription || '',
  }));
}

/** Normalize a raw AMPRE OData Property object to our AmpreProperty shape */
export function normalizeProperty(raw: any): AmpreProperty {
  const sorted = sortMedia(raw.Media ?? []);
  const primaryImage = sorted[0]?.MediaURL ?? '';

  return {
    id:           raw.ListingKey        ?? raw.ListingId   ?? '',
    mlsNumber:    raw.ListingId         ?? raw.ListingKey  ?? '',
    price:        raw.ListPrice         ?? 0,
    address:      raw.UnparsedAddress   ?? '',
    city:         raw.City              ?? '',
    province:     raw.StateOrProvince   ?? 'ON',
    postalCode:   raw.PostalCode        ?? '',
    bedrooms:     raw.BedroomsTotal     ?? raw.BedroomsAboveGrade ?? 0,
    bathrooms:    raw.BathroomsTotalInteger ?? 0,
    squareFeet:   raw.LivingArea        ?? null,
    propertyType: raw.PropertySubType   ?? raw.PropertyType ?? '',
    status:       raw.StandardStatus    ?? raw.MlsStatus   ?? '',
    description:  raw.PublicRemarks     ?? '',
    image:        primaryImage,
    images:       sorted.map((m: any) => ({
      url:     m.MediaURL,
      caption: m.LongDescription ?? '',
    })),
    garage:       raw.GarageSpaces      ?? null,
    yearBuilt:    raw.YearBuilt         ?? null,
    lotSize:      raw.LotSizeArea       ?? null,
    lotSizeUnits: raw.LotSizeAreaUnits  ?? raw.LotSizeUnits ?? '',
    transactionType: raw.TransactionType ?? raw.ListPriceUnit ?? '',
  };
}

// ─── API Methods ──────────────────────────────────────────────────────────────

/**
 * Fetch a list of active MLS® properties with optional filters.
 * Automatically follows @odata.nextLink pagination until the target limit (~100 items) is reached.
 * Keeps Frontend intact (1 request to /api/ampre/properties).
 */
export async function getListings(params?: {
  city?:     string;
  maxPrice?: number;
  bedrooms?: number;
  top?:      number;
}): Promise<AmpreListResult> {
  const targetCount = params?.top ?? 100;
  const pageSize    = Math.min(targetCount, 60);

  // Build initial $filter
  const filterParts = ["StandardStatus eq 'Active'"];
  if (params?.city?.trim()) {
    const safe = params.city.trim().toLowerCase().replace(/'/g, "''");
    filterParts.push(`tolower(City) eq '${safe}'`);
  }
  if (params?.maxPrice && params.maxPrice > 0) {
    filterParts.push(`ListPrice le ${params.maxPrice}`);
  }
  if (params?.bedrooms && params.bedrooms > 0) {
    filterParts.push(`BedroomsTotal ge ${params.bedrooms}`);
  }

  const filter   = filterParts.join(' and ');
  let nextUrl: string | null = [
    `${AMPRE_BASE}/Property`,
    `?$top=${pageSize}`,
    `&$expand=Media`,
    `&$filter=${encodeURIComponent(filter)}`,
    `&$orderby=ListPrice%20desc`,
  ].join('');

  const rawList: any[] = [];

  // Follow @odata.nextLink until targetCount (~100) is accumulated or no nextLink exists
  while (nextUrl && rawList.length < targetCount) {
    const resp: Response = await fetch(nextUrl, {
      headers: authHeaders(),
      cache:   'no-store',
    });

    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      throw Object.assign(new Error(`AMPRE listings API error ${resp.status}`), {
        status: resp.status,
        body,
      });
    }

    const json: any = await resp.json();
    const pageItems = json?.value ?? [];
    rawList.push(...pageItems);

    // Follow @odata.nextLink for continuation pages
    nextUrl = json?.['@odata.nextLink'] ?? null;
  }

  // Trim to exact target count if exceeded, then normalize
  const sliced     = rawList.slice(0, targetCount);
  const properties = sliced.map(normalizeProperty);

  return { properties, total: properties.length };
}

/**
 * Fetch a single property by its ListingKey.
 * Uses the canonical AMPRE OData key syntax: Property('KEY')?$expand=Media
 */
export async function getProperty(listingKey: string): Promise<AmpreProperty> {
  const safe     = encodeURIComponent(listingKey);
  const odataUrl = `${AMPRE_BASE}/Property('${safe}')?$expand=Media`;

  const resp = await fetch(odataUrl, {
    headers: authHeaders(),
    cache:   'no-store',
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw Object.assign(new Error(`AMPRE property API error ${resp.status}`), {
      status: resp.status,
      body,
    });
  }

  const raw = await resp.json();
  return normalizeProperty(raw);
}

/**
 * Fetch only the Media array for a given ListingKey.
 * Uses $select to minimise payload.
 */
export async function getMedia(listingKey: string): Promise<AmpreMedia[]> {
  const safe     = encodeURIComponent(listingKey);
  const odataUrl = `${AMPRE_BASE}/Property('${safe}')?$select=ListingKey&$expand=Media`;

  const resp = await fetch(odataUrl, {
    headers: authHeaders(),
    cache:   'no-store',
  });

  if (!resp.ok) {
    throw Object.assign(new Error(`AMPRE media API error ${resp.status}`), {
      status: resp.status,
    });
  }

  const raw = await resp.json();
  return sortMedia(raw?.Media ?? []);
}
