'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { tmdbService } from '@/lib/tmdb';
import { useTranslations } from '@/i18n';
import { Button } from './ui/Button';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import type { TMDBMovie, TMDBTVShow } from '@/types';

interface HeroBannerProps {
  item: TMDBMovie | TMDBTVShow;
  mediaType: 'movie' | 'tv';
}

export function HeroBanner({ item, mediaType }: HeroBannerProps) {
  const { t } = useTranslations();
  const [isLoaded, setIsLoaded] = useState(false);

  const title = 'title' in item ? item.title : item.name;
  const backdropUrl = tmdbService.getBackdropUrl(item.backdrop_path);

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={title}
          fill
          priority
          quality={90}
          className={`object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoadingComplete={() => setIsLoaded(true)}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl w-full"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 line-clamp-2">
            {title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
            {item.overview || t('content.noOverview')}
          </p>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold">{item.vote_average.toFixed(1)}</span>
            </div>

            {('release_date' in item) && item.release_date && (
              <span className="text-gray-400">
                {new Date(item.release_date).getFullYear()}
              </span>
            )}
            {('first_air_date' in item) && item.first_air_date && (
              <span className="text-gray-400">
                {new Date(item.first_air_date).getFullYear()}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
            <Link href={`/watch/${mediaType}/${item.id}`}>
              <Button variant="primary" size="lg" className="text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3">
                <FaPlay className="text-sm sm:text-base md:text-lg" />
                {t('content.play')}
              </Button>
            </Link>

            <Link href={`/${mediaType}/${item.id}`}>
              <Button variant="secondary" size="lg" className="text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3">
                <FaInfoCircle className="text-sm sm:text-base md:text-lg" />
                {t('content.moreInfo')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
