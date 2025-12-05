import { NextRequest, NextResponse } from 'next/server';
import { tmdbService } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1');

    if (!query) {
      return NextResponse.json({ message: 'Query parameter required' }, { status: 400 });
    }

    const results = await tmdbService.search(query, page);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ message: 'Search failed' }, { status: 500 });
  }
}
