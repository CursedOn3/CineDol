import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json({ message: 'Profile ID required' }, { status: 400 });
    }

    const watchlist = await prisma.watchlist.findMany({
      where: {
        userId: session.user.id,
        profileId,
      },
      orderBy: {
        addedAt: 'desc',
      },
    });

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error('Watchlist error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { profileId, tmdbId, mediaType, title, posterPath, backdropPath, overview } = body;

    if (!profileId || !tmdbId || !mediaType || !title) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if item already exists
    const existingItem = await prisma.watchlist.findFirst({
      where: {
        userId: session.user.id,
        profileId,
        tmdbId,
        mediaType,
      },
    });

    if (existingItem) {
      // Item already in watchlist, return existing item
      return NextResponse.json(existingItem, { status: 200 });
    }

    // Create new watchlist item
    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: session.user.id,
        profileId,
        tmdbId,
        mediaType,
        title,
        posterPath,
        backdropPath,
        overview,
      },
    });

    return NextResponse.json(watchlistItem, { status: 201 });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Watchlist item ID required' }, { status: 400 });
    }

    await prisma.watchlist.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Removed from watchlist' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
