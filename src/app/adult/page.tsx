import { Metadata } from 'next';
import { tmdbService } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TMDBMovie, TMDBTVShow } from '@/types';

export const metadata: Metadata = {
    title: '18+ - CineDol',
    description: 'Browse mature content for adults',
};

export const revalidate = 3600;

interface AdultPageProps {
    searchParams: { page?: string };
}

export default async function AdultPage({ searchParams }: AdultPageProps) {
    const currentPage = Number(searchParams.page) || 1;

    // Fetch adult content (adult flag = true)
    const [adultMovies, adultShows] = await Promise.all([
        tmdbService.fetchFromTMDB<{ results: TMDBMovie[]; total_pages: number; page: number }>('/discover/movie', {
            include_adult: true,
            certification_country: 'US',
            'certification.gte': 'R',
            page: currentPage,
            sort_by: 'popularity.desc',
        }),
        tmdbService.fetchFromTMDB<{ results: TMDBTVShow[]; total_pages: number; page: number }>('/discover/tv', {
            include_adult: true,
            page: 1,
            sort_by: 'popularity.desc',
            with_genres: '18,80,9648', // Drama, Crime, Mystery - mature themes
        }),
    ]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-netflix-black pt-20 pb-10">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            18+ Content
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Mature content for adult audiences
                        </p>
                        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded">
                            <p className="text-red-400 text-sm">
                                ⚠️ This section contains mature content intended for viewers 18 years and older.
                            </p>
                        </div>
                    </div>

                    <section className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                            Mature TV Shows
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {adultShows.results.slice(0, 12).map((show: TMDBTVShow) => (
                                <MovieCard key={show.id} item={show} mediaType="tv" />
                            ))}
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                            Mature Movies
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {adultMovies.results.map((movie: TMDBMovie) => (
                                <MovieCard key={movie.id} item={movie} mediaType="movie" />
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-center items-center gap-4 mt-12">
                        {currentPage > 1 && (
                            <a
                                href={`/adult?page=${currentPage - 1}`}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                            >
                                Previous
                            </a>
                        )}
                        <span className="text-white">
                            Page {currentPage} of {adultMovies.total_pages}
                        </span>
                        {currentPage < adultMovies.total_pages && (
                            <a
                                href={`/adult?page=${currentPage + 1}`}
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
