import { Metadata } from 'next';
import { tmdbService } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TMDBTVShow } from '@/types';

export const metadata: Metadata = {
    title: 'Anime - CineDol',
    description: 'Browse anime series and shows',
};

export const revalidate = 3600;

interface AnimePageProps {
    searchParams: { page?: string };
}

export default async function AnimePage({ searchParams }: AnimePageProps) {
    const currentPage = Number(searchParams.page) || 1;

    // Fetch Anime shows (genre 16 is Animation + origin_country JP)
    const animeShows = await tmdbService.fetchFromTMDB<{ results: TMDBTVShow[]; total_pages: number; page: number }>('/discover/tv', {
        with_genres: 16, // Animation genre
        with_origin_country: 'JP',
        page: currentPage,
        sort_by: 'popularity.desc',
    });

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-netflix-black pt-20 pb-10">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Anime
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Discover popular anime series and shows
                        </p>
                    </div>

                    <section className="mb-12">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {animeShows.results.map((show: TMDBTVShow) => (
                                <MovieCard key={show.id} item={show} mediaType="tv" />
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-center items-center gap-4 mt-12">
                        {currentPage > 1 && (
                            <a
                                href={`/anime?page=${currentPage - 1}`}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                            >
                                Previous
                            </a>
                        )}
                        <span className="text-white">
                            Page {currentPage} of {animeShows.total_pages}
                        </span>
                        {currentPage < animeShows.total_pages && (
                            <a
                                href={`/anime?page=${currentPage + 1}`}
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
