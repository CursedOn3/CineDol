const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...\n');
    
    const userCount = await prisma.user.count();
    console.log(`👥 Users: ${userCount}`);
    
    const profileCount = await prisma.profile.count();
    console.log(`👤 Profiles: ${profileCount}`);
    
    const watchlistCount = await prisma.watchlist.count();
    console.log(`📋 Watchlist items: ${watchlistCount}`);
    
    const continueWatchingCount = await prisma.continueWatching.count();
    console.log(`▶️  Continue watching items: ${continueWatchingCount}`);
    
    const customContentCount = await prisma.customContent.count();
    console.log(`🎬 Custom content items: ${customContentCount}`);
    
    if (userCount > 0) {
      console.log('\n📊 Sample Users:');
      const users = await prisma.user.findMany({
        take: 5,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        }
      });
      console.table(users);
    }
    
    if (watchlistCount > 0) {
      console.log('\n📋 Sample Watchlist:');
      const watchlist = await prisma.watchlist.findMany({
        take: 5,
        select: {
          title: true,
          mediaType: true,
          addedAt: true,
        }
      });
      console.table(watchlist);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
