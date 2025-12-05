import { Metadata } from 'next';
import { tmdbService } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TMDBMovie } from '@/types';

export const metadata: Metadata = {
  title: 'Movies - CineDol',
  description: 'Browse all movies',
};

export const revalidate = 3600;

interface MoviesPageProps {
  searchParams: { page?: string };
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const currentPage = Number(searchParams.page) || 1;

  const [popularMovies, topRatedMovies, nowPlayingMovies] = await Promise.all([
    tmdbService.getPopularMovies(currentPage),
    tmdbService.getTopRatedMovies(1),
    tmdbService.getNowPlaying(1),
  ]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-netflix-black pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Movies
          </h1>
          <p className="text-gray-400 text-lg">
            Discover popular movies, top-rated films, and now playing
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Now Playing
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {nowPlayingMovies.results.slice(0, 12).map((movie: TMDBMovie) => (
              <MovieCard key={movie.id} item={movie} mediaType="movie" />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Top Rated
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {topRatedMovies.results.slice(0, 12).map((movie: TMDBMovie) => (
              <MovieCard key={movie.id} item={movie} mediaType="movie" />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Popular Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {popularMovies.results.map((movie: TMDBMovie) => (
              <MovieCard key={movie.id} item={movie} mediaType="movie" />
            ))}
          </div>
        </section>

        <div className="flex justify-center items-center gap-4 mt-12">
          {currentPage > 1 && (
            <a
              href={`/movies?page=${currentPage - 1}`}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
            >
              Previous
            </a>
          )}
          <span className="text-white">
            Page {currentPage} of {popularMovies.total_pages}
          </span>
          {currentPage < popularMovies.total_pages && (
            <a
              href={`/movies?page=${currentPage + 1}`}
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
