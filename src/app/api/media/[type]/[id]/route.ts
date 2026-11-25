import { NextRequest, NextResponse } from 'next/server';
import { tmdbService } from '@/lib/tmdb';

export async function GET(
  _request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  const id = parseInt(params.id);
  if (!id || (params.type !== 'movie' && params.type !== 'tv')) {
    return NextResponse.json({ error: 'Invalid media request' }, { status: 400 });
  }

  try {
    const data =
      params.type === 'movie'
        ? await tmdbService.getMovieDetails(id)
        : await tmdbService.getTVDetails(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching media details:', error);
    return NextResponse.json({ error: 'Failed to fetch media details' }, { status: 500 });
  }
}
