'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllVideoUrls } from '@/lib/video-providers';
import type { VideoProvider } from '@/types';
import { useTranslations } from '@/i18n';
import { usePlaybackStore } from '@/store/playbackStore';
import { Button } from './ui/Button';

interface VideoPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  onTimeUpdate?: (currentTime: number) => void;
}

export function VideoPlayer({
  tmdbId,
  mediaType,
  season,
  episode,
  onTimeUpdate,
}: VideoPlayerProps) {
  const { t } = useTranslations();
  const { currentProvider, setCurrentProvider } = usePlaybackStore();
  const [providers, setProviders] = useState<Array<{ provider: VideoProvider; url: string; name: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProviderMenu, setShowProviderMenu] = useState(false);

  useEffect(() => {
    const allProviders = getAllVideoUrls(tmdbId, mediaType, season, episode);
    setProviders(allProviders);
    
    // Find current provider index or default to 0
    const index = allProviders.findIndex((p) => p.provider === currentProvider);
    setCurrentIndex(index >= 0 ? index : 0);
  }, [tmdbId, mediaType, season, episode, currentProvider]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const handleIframeError = useCallback(() => {
    setError(t('video.providerError'));
    
    // Try next provider after 2 seconds
    setTimeout(() => {
      if (currentIndex < providers.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsLoading(true);
        setError(null);
      } else {
        setError(t('video.allProvidersFailed'));
      }
    }, 2000);
  }, [currentIndex, providers.length, t]);

  const switchProvider = (index: number) => {
    setCurrentIndex(index);
    setCurrentProvider(providers[index].provider);
    setIsLoading(true);
    setError(null);
    setShowProviderMenu(false);
  };

  if (!providers.length) {
    return (
      <div className="flex items-center justify-center h-full bg-netflix-darkGray">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  const currentVideoUrl = providers[currentIndex]?.url;

  return (
    <div className="relative w-full bg-black mx-auto">
      {/* Video Container */}
      <div className="video-container mx-auto">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-netflix-darkGray">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-netflix-red mx-auto mb-4" />
              <p>{t('video.loading')}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-netflix-darkGray">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              {currentIndex < providers.length - 1 && (
                <Button onClick={() => switchProvider(currentIndex + 1)}>
                  {t('common.retry')}
                </Button>
              )}
            </div>
          </div>
        )}

        <iframe
          src={currentVideoUrl}
          className="absolute top-0 left-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {/* Provider Selector - Hidden since only one provider */}
      {providers.length > 1 && (
        <div className="absolute top-4 right-4 z-20">
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowProviderMenu(!showProviderMenu)}
            >
              {providers[currentIndex]?.name}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>

            <AnimatePresence>
              {showProviderMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-netflix-darkGray border border-netflix-gray rounded shadow-lg py-2"
                >
                  {providers.map((provider, index) => (
                    <button
                      key={provider.provider}
                      onClick={() => switchProvider(index)}
                      className={`w-full text-left px-4 py-2 hover:bg-netflix-gray transition-colors ${
                        index === currentIndex ? 'bg-netflix-gray' : ''
                      }`}
                    >
                      {provider.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
