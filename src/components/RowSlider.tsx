'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from './MovieCard';
import type { TMDBMovie, TMDBTVShow } from '@/types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface RowSliderProps {
  title: string;
  items: Array<TMDBMovie | TMDBTVShow>;
  mediaType: 'movie' | 'tv' | 'mixed';
}

export function RowSlider({ title, items, mediaType }: RowSliderProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6 sm:mb-8 group/row">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-3 sm:px-4 md:px-8">
        {title}
      </h2>
      
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-0 bottom-0 z-10 w-10 lg:w-12 bg-black/50 hover:bg-black/70 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 items-center justify-center"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-xl lg:text-2xl" />
        </button>

        {/* Slider */}
        <div
          ref={rowRef}
          className="flex gap-1.5 sm:gap-2 overflow-x-scroll scrollbar-hide px-3 sm:px-4 md:px-8 snap-x"
        >
          {items.map((item) => {
            // Detect media type for mixed content
            const itemMediaType = mediaType === 'mixed' 
              ? ('title' in item ? 'movie' : 'tv')
              : mediaType;
            
            return (
              <div key={item.id} className="snap-start">
                <MovieCard item={item} mediaType={itemMediaType} />
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-0 bottom-0 z-10 w-10 lg:w-12 bg-black/50 hover:bg-black/70 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 items-center justify-center"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-xl lg:text-2xl" />
        </button>
      </div>
    </div>
  );
}
