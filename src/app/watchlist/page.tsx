'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MovieCard } from '@/components/MovieCard';
import { useProfileStore } from '@/store/profileStore';
import { useTranslations } from '@/i18n';
import type { WatchlistItem } from '@/types';

export default function WatchlistPage() {
  const { t } = useTranslations();
  const { currentProfile } = useProfileStore();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentProfile) {
      fetchWatchlist();
    }
  }, [currentProfile]);

  const fetchWatchlist = async () => {
    if (!currentProfile) return;

    try {
      const response = await fetch(`/api/watchlist?profileId=${currentProfile.id}`);
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data);
      }
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />

      <div className="pt-20 sm:pt-24 px-3 sm:px-4 md:px-8 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">{t('watchlist.title')}</h1>

          {isLoading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-netflix-red mx-auto mb-4" />
              <p>{t('common.loading')}</p>
            </div>
          )}

          {!isLoading && watchlist.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400 mb-2">{t('watchlist.empty')}</p>
              <p className="text-gray-500">{t('watchlist.emptyDescription')}</p>
            </div>
          )}

          {!isLoading && watchlist.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {watchlist.map((item) => (
                <MovieCard
                  key={item.id}
                  item={{
                    id: item.tmdbId,
                    title: item.title,
                    name: item.title,
                    poster_path: item.posterPath,
                    backdrop_path: item.backdropPath,
                    overview: item.overview || '',
                    vote_average: 0,
                    vote_count: 0,
                    popularity: 0,
                    genre_ids: [],
                    original_language: 'en',
                  } as any}
                  mediaType={item.mediaType as 'movie' | 'tv'}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
