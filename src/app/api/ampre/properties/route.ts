/**
 * GET /api/ampre/properties
 * Server-side Route Handler — fetches MLS® listings from AMPRE via ampreApi service.
 * Token stays on server. Client receives clean JSON.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getListings } from '@/services/ampreApi';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  try {
    const result = await getListings({
      city:     searchParams.get('city')     || undefined,
      maxPrice: Number(searchParams.get('maxPrice')) || undefined,
      bedrooms: Number(searchParams.get('bedrooms')) || undefined,
      top:      searchParams.get('top') ? Number(searchParams.get('top')) : 100,
    });

    return NextResponse.json({
      success: true,
      data:    result.properties,
      total:   result.total,
    });
  } catch (err: any) {
    const status: number = err.status ?? 503;

    if (status === 401 || status === 403) {
      return NextResponse.json(
        { success: false, message: 'IDX authentication failed. Please check the AMPRE token.' },
        { status: 502 }
      );
    }
    if (status === 400) {
      return NextResponse.json(
        { success: false, message: 'Invalid query sent to AMPRE API. Please try again.' },
        { status: 502 }
      );
    }

    console.error('[AMPRE /properties] Error:', err.message);
    return NextResponse.json(
      { success: false, message: 'Could not reach the AMPRE listings service. Please try again later.' },
      { status: 503 }
    );
  }
}
