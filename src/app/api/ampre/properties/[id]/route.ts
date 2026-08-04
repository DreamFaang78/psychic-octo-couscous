/**
 * GET /api/ampre/properties/[id]
 * Server-side Route Handler — fetches a single MLS® property from AMPRE.
 * Token stays on server. Returns normalized AmpreProperty JSON.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProperty } from '@/services/ampreApi';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Listing ID is required.' },
      { status: 400 }
    );
  }

  try {
    const property = await getProperty(id);
    return NextResponse.json({ success: true, data: property });
  } catch (err: any) {
    const status: number = err.status ?? 503;

    if (status === 401 || status === 403) {
      return NextResponse.json(
        { success: false, message: 'IDX authentication failed.' },
        { status: 502 }
      );
    }
    if (status === 404) {
      return NextResponse.json(
        { success: false, message: 'Listing not found.' },
        { status: 404 }
      );
    }

    console.error(`[AMPRE /properties/${id}] Error:`, err.message);
    return NextResponse.json(
      { success: false, message: 'Could not fetch property details. Please try again later.' },
      { status: 503 }
    );
  }
}
