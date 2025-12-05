import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { RowSlider } from '@/components/RowSlider';
import { Footer } from '@/components/Footer';
import { tmdbService } from '@/lib/tmdb';
import { getTranslation } from '@/i18n';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  // Fetch all data in parallel
  const [trending, popularMovies, topRatedMovies, nowPlaying, popularTV, topRatedTV] =
    await Promise.all([
      tmdbService.getTrending('all', 'week'),
      tmdbService.getPopularMovies(),
      tmdbService.getTopRatedMovies(),
      tmdbService.getNowPlaying(),
      tmdbService.getPopularTVShows(),
      tmdbService.getTopRatedTVShows(),
    ]);

  // Get random trending item for hero banner
  const heroItem = trending.results[Math.floor(Math.random() * Math.min(5, trending.results.length))];
  const heroMediaType = 'title' in heroItem ? 'movie' : 'tv';

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      <main>
        <HeroBanner item={heroItem} mediaType={heroMediaType} />

        <div className="relative -mt-20 sm:-mt-24 md:-mt-32 z-10 space-y-6 sm:space-y-8 pb-12 sm:pb-16">
          <RowSlider
            title="Trending Now"
            items={trending.results}
            mediaType="mixed"
          />

          <RowSlider
            title="Popular Movies"
            items={popularMovies.results}
            mediaType="movie"
          />

          <RowSlider
            title="Top Rated Movies"
            items={topRatedMovies.results}
            mediaType="movie"
          />

          <RowSlider
            title="Now Playing"
            items={nowPlaying.results}
            mediaType="movie"
          />

          <RowSlider
            title="Popular TV Shows"
            items={popularTV.results}
            mediaType="tv"
          />

          <RowSlider
            title="Top Rated TV Shows"
            items={topRatedTV.results}
            mediaType="tv"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
