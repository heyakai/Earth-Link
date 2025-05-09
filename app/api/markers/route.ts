import { NextResponse } from 'next/server';
import { addMarker, getMarkers } from '../../../lib/db';

export async function GET() {
  try {
    const markers = getMarkers();
    return NextResponse.json(markers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch markers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { latitude, longitude, website } = await request.json();
    
    if (!latitude || !longitude || !website) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = addMarker(latitude, longitude, website);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add marker' },
      { status: 500 }
    );
  }
} 