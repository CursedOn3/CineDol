import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { AddToWatchlistButton } from '@/components/AddToWatchlistButton';
import { CastList } from '@/components/CastList';
import { GenreBadges } from '@/components/GenreBadges';
import { RowSlider } from '@/components/RowSlider';
import { SeasonList } from '@/components/SeasonList';
import { tmdbService } from '@/lib/tmdb';
import { FaPlay, FaPlus } from 'react-icons/fa';
import type { Metadata } from 'next';

interface TVPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: TVPageProps): Promise<Metadata> {
  try {
    const tv = await tmdbService.getTVDetails(parseInt(params.id));
    
    return {
      title: `${tv.name} - ConeDol`,
      description: tv.overview,
      openGraph: {
        title: tv.name,
        description: tv.overview,
        images: [tmdbService.getBackdropUrl(tv.backdrop_path)],
      },
    };
  } catch {
    return {
      title: 'TV Show Not Found - ConeDol',
    };
  }
}

export default async function TVPage({ params }: TVPageProps) {
  try {
    const tv = await tmdbService.getTVDetails(parseInt(params.id));
    const similar = await tmdbService.getSimilarTVShows(parseInt(params.id));
    
    const backdropUrl = tmdbService.getBackdropUrl(tv.backdrop_path);
    const posterUrl = tmdbService.getPosterUrl(tv.poster_path);

    const trailer = tv.videos?.results.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    );

    return (
      <div className="min-h-screen bg-netflix-black">
        <Navbar />

        {/* Hero Section */}
        <div className="relative w-full h-[80vh]">
          <Image
            src={backdropUrl}
            alt={tv.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-12 lg:p-16">
            <div className="max-w-4xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">{tv.name}</h1>

              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xl font-semibold">{tv.vote_average.toFixed(1)}</span>
                </div>
                <span>{new Date(tv.first_air_date).getFullYear()}</span>
                <span>{tv.number_of_seasons} Seasons</span>
              </div>

              <div className="flex gap-4 mb-6">
                <Link href={`/watch/tv/${tv.id}/1/1`}>
                  <Button variant="primary" size="lg">
                    <FaPlay />
                    Play S1 E1
                  </Button>
                </Link>
                <AddToWatchlistButton
                  tmdbId={tv.id}
                  mediaType="tv"
                  title={tv.name}
                  posterPath={tv.poster_path || undefined}
                  backdropPath={tv.backdrop_path || undefined}
                  overview={tv.overview || undefined}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-8 md:px-16 py-12 space-y-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-gray-300 text-lg leading-relaxed">{tv.overview}</p>
              </div>

              {tv.genres && tv.genres.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Genres</h3>
                  <GenreBadges genres={tv.genres} mediaType="tv" />
                </div>
              )}

              {tv.seasons && tv.seasons.length > 0 && (
                <SeasonList tvId={parseInt(params.id)} seasons={tv.seasons} />
              )}

              {tv.credits?.cast && tv.credits.cast.length > 0 && (
                <CastList cast={tv.credits.cast} limit={10} />
              )}
            </div>

            <div>
              <Image
                src={posterUrl}
                alt={tv.name}
                width={300}
                height={450}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {trailer && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Trailer</h2>
              <div className="aspect-video">
                <iframe
                  src={tmdbService.getYouTubeEmbedUrl(trailer.key)}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          )}

          {similar.results.length > 0 && (
            <RowSlider
              title="Similar Shows"
              items={similar.results}
              mediaType="tv"
            />
          )}
        </div>

        <Footer />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
