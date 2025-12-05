import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();
    const profileId = params.id;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    // Update profile
    const profile = await prisma.profile.update({
      where: {
        id: profileId,
        userId: session.user.id, // Ensure user owns this profile
      },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profileId = params.id;

    // Check if user has more than one profile
    const profileCount = await prisma.profile.count({
      where: {
        userId: session.user.id,
      },
    });

    if (profileCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete last profile' },
        { status: 400 }
      );
    }

    // Delete profile
    await prisma.profile.delete({
      where: {
        id: profileId,
        userId: session.user.id, // Ensure user owns this profile
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}
