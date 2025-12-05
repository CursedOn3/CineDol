'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchBar } from '@/components/SearchBar';
import { MovieCard } from '@/components/MovieCard';
import { tmdbService } from '@/lib/tmdb';
import { useTranslations } from '@/i18n';
import type { TMDBMovie, TMDBTVShow } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { t } = useTranslations();
  
  const [results, setResults] = useState<Array<TMDBMovie | TMDBTVShow>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery && !hasSearched) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    // Prevent duplicate searches
    if (query === searchQuery && hasSearched) {
      return;
    }

    setIsLoading(true);
    setQuery(searchQuery);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      
      if (data && data.results) {
        const filteredResults = data.results.filter(
          (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
        );
        setResults(filteredResults);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} autoFocus />
          </div>

          {isLoading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-netflix-red mx-auto mb-4" />
              <p>{t('search.searching')}</p>
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">
                {t('search.noResults')} &quot;{query}&quot;
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {t('search.results')} ({results.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {results.map((item: any) => (
                  <MovieCard
                    key={item.id}
                    item={item}
                    mediaType={item.media_type || ('title' in item ? 'movie' : 'tv')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-netflix-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-netflix-red" />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
