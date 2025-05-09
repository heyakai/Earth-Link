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
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['latitude', 'longitude', 'website', 'siteName'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate data types
    if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
      return NextResponse.json(
        { error: 'Latitude and longitude must be numbers' },
        { status: 400 }
      );
    }

    if (typeof data.website !== 'string' || typeof data.siteName !== 'string') {
      return NextResponse.json(
        { error: 'Website and site name must be strings' },
        { status: 400 }
      );
    }

    // Optional fields validation
    if (data.siteDescription && typeof data.siteDescription !== 'string') {
      return NextResponse.json(
        { error: 'Site description must be a string' },
        { status: 400 }
      );
    }

    if (data.ownerName && typeof data.ownerName !== 'string') {
      return NextResponse.json(
        { error: 'Owner name must be a string' },
        { status: 400 }
      );
    }

    if (data.ownerDescription && typeof data.ownerDescription !== 'string') {
      return NextResponse.json(
        { error: 'Owner description must be a string' },
        { status: 400 }
      );
    }

    if (data.ownerWebsite && typeof data.ownerWebsite !== 'string') {
      return NextResponse.json(
        { error: 'Owner website must be a string' },
        { status: 400 }
      );
    }

    if (data.isAnonymous && typeof data.isAnonymous !== 'boolean') {
      return NextResponse.json(
        { error: 'isAnonymous must be a boolean' },
        { status: 400 }
      );
    }

    try {
      const result = addMarker(data);
      return NextResponse.json(result);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error: ' + (dbError instanceof Error ? dbError.message : 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 