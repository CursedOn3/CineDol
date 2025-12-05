import { Metadata } from 'next';
import { tmdbService } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TMDBTVShow } from '@/types';

export const metadata: Metadata = {
  title: 'TV Shows - CineDol',
  description: 'Browse all TV shows',
};

export const revalidate = 3600;

interface TVShowsPageProps {
  searchParams: { page?: string };
}

export default async function TVShowsPage({ searchParams }: TVShowsPageProps) {
  const currentPage = Number(searchParams.page) || 1;

  const [popularShows, topRatedShows, onTheAirShows] = await Promise.all([
    tmdbService.getPopularTVShows(currentPage),
    tmdbService.getTopRatedTVShows(1),
    tmdbService.getOnTheAir(1),
  ]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-netflix-black pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            TV Shows
          </h1>
          <p className="text-gray-400 text-lg">
            Discover popular TV shows, top-rated series, and currently airing
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            On The Air
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {onTheAirShows.results.slice(0, 12).map((show: TMDBTVShow) => (
              <MovieCard key={show.id} item={show} mediaType="tv" />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Top Rated
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {topRatedShows.results.slice(0, 12).map((show: TMDBTVShow) => (
              <MovieCard key={show.id} item={show} mediaType="tv" />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Popular TV Shows
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {popularShows.results.map((show: TMDBTVShow) => (
              <MovieCard key={show.id} item={show} mediaType="tv" />
            ))}
          </div>
        </section>

        <div className="flex justify-center items-center gap-4 mt-12">
          {currentPage > 1 && (
            <a
              href={`/tv-shows?page=${currentPage - 1}`}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
            >
              Previous
            </a>
          )}
          <span className="text-white">
            Page {currentPage} of {popularShows.total_pages}
          </span>
          {currentPage < popularShows.total_pages && (
            <a
              href={`/tv-shows?page=${currentPage + 1}`}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
            >
              Next
            </a>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
