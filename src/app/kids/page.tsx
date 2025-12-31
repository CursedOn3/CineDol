import { Metadata } from 'next';
import { tmdbService } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TMDBMovie, TMDBTVShow } from '@/types';

export const metadata: Metadata = {
    title: 'Kids - CineDol',
    description: 'Browse kids and family-friendly content',
};

export const revalidate = 3600;

interface KidsPageProps {
    searchParams: { page?: string };
}

export default async function KidsPage({ searchParams }: KidsPageProps) {
    const currentPage = Number(searchParams.page) || 1;

    // Fetch kids content (genre 10762 is Kids, 16 is Animation, 10751 is Family)
    const [kidsMovies, kidsShows] = await Promise.all([
        tmdbService.fetchFromTMDB<{ results: TMDBMovie[]; total_pages: number; page: number }>('/discover/movie', {
            with_genres: '10751,16', // Family and Animation
            certification_country: 'US',
            'certification.lte': 'G',
            page: currentPage,
            sort_by: 'popularity.desc',
        }),
        tmdbService.fetchFromTMDB<{ results: TMDBTVShow[]; total_pages: number; page: number }>('/discover/tv', {
            with_genres: '10762,16', // Kids and Animation
            page: 1,
            sort_by: 'popularity.desc',
        }),
    ]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-netflix-black pt-20 pb-10">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Kids
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Discover family-friendly movies and shows for kids
                        </p>
                    </div>

                    <section className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                            Kids TV Shows
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {kidsShows.results.slice(0, 12).map((show: TMDBTVShow) => (
                                <MovieCard key={show.id} item={show} mediaType="tv" />
                            ))}
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                            Family Movies
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {kidsMovies.results.map((movie: TMDBMovie) => (
                                <MovieCard key={movie.id} item={movie} mediaType="movie" />
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-center items-center gap-4 mt-12">
                        {currentPage > 1 && (
                            <a
                                href={`/kids?page=${currentPage - 1}`}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                            >
                                Previous
                            </a>
                        )}
                        <span className="text-white">
                            Page {currentPage} of {kidsMovies.total_pages}
                        </span>
                        {currentPage < kidsMovies.total_pages && (
                            <a
                                href={`/kids?page=${currentPage + 1}`}
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
