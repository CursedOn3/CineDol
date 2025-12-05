'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { tmdbService } from '@/lib/tmdb';
import { useProfileStore } from '@/store/profileStore';
import { FaPlay, FaPlus, FaMinus, FaSpinner } from 'react-icons/fa';
import type { TMDBMovie, TMDBTVShow } from '@/types';

interface MovieCardProps {
  item: TMDBMovie | TMDBTVShow;
  mediaType: 'movie' | 'tv';
}

export function MovieCard({ item, mediaType }: MovieCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { currentProfile, setCurrentProfile } = useProfileStore();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [watchlistItemId, setWatchlistItemId] = useState<string | null>(null);

  const title = 'title' in item ? item.title : item.name;
  const posterUrl = tmdbService.getPosterUrl(item.poster_path);
  const id = item.id;

  useEffect(() => {
    const checkWatchlistStatus = async () => {
      if (!session || !currentProfile) {
        // Reset state if no session or profile
        setIsInWatchlist(false);
        setWatchlistItemId(null);
        return;
      }

      try {
        const response = await fetch(`/api/watchlist?profileId=${currentProfile.id}`);
        if (response.ok) {
          const watchlist = await response.json();
          const existingItem = watchlist.find(
            (w: any) => w.tmdbId === id && w.mediaType === mediaType
          );
          if (existingItem) {
            setIsInWatchlist(true);
            setWatchlistItemId(existingItem.id);
          } else {
            // Explicitly set to false if not found
            setIsInWatchlist(false);
            setWatchlistItemId(null);
          }
        }
      } catch (error) {
        console.error('Error checking watchlist:', error);
      }
    };

    checkWatchlistStatus();
  }, [session, currentProfile, id, mediaType]);

  const loadDefaultProfile = async () => {
    try {
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const profiles = await response.json();
        if (profiles.length > 0) {
          setCurrentProfile(profiles[0]);
          return profiles[0];
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
    return null;
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (mediaType === 'movie') {
      router.push(`/watch/movie/${id}`);
    } else {
      router.push(`/watch/tv/${id}/1/1`);
    }
  };

  const handleWatchlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push('/login');
      return;
    }

    let profile = currentProfile;
    if (!profile) {
      profile = await loadDefaultProfile();
      if (!profile) {
        router.push('/profiles');
        return;
      }
    }

    try {
      setIsLoading(true);
      
      if (isInWatchlist && watchlistItemId) {
        // Remove from watchlist
        const response = await fetch('/api/watchlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: watchlistItemId,
            profileId: profile.id,
          }),
        });

        if (response.ok) {
          // Update state immediately after successful deletion
          setIsInWatchlist(() => false);
          setWatchlistItemId(() => null);
        } else {
          console.error('Failed to remove from watchlist');
        }
      } else {
        // Add to watchlist
        const response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileId: profile.id,
            tmdbId: id,
            mediaType,
            title,
            posterPath: item.poster_path || undefined,
            backdropPath: item.backdrop_path || undefined,
            overview: item.overview || undefined,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Update state immediately after successful addition
          setIsInWatchlist(() => true);
          setWatchlistItemId(() => data.id);
        } else {
          console.error('Failed to add to watchlist');
        }
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/${mediaType}/${id}`}>
      <motion.div
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ duration: 0.2 }}
        className="relative flex-shrink-0 w-40 md:w-48 lg:w-56 cursor-pointer group"
      >
        <div className="relative aspect-[2/3] rounded-md overflow-hidden">
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
            <div className="p-3 w-full">
              <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                {title}
              </h3>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs text-gray-300">
                    {item.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayClick}
                  className="flex-1 flex items-center justify-center gap-1 bg-white text-black px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-xs font-semibold"
                >
                  <FaPlay className="text-xs" />
                  <span>Play</span>
                </button>
                
                <button
                  onClick={handleWatchlistClick}
                  disabled={isLoading}
                  className="flex items-center justify-center bg-netflix-darkGray border border-gray-500 p-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                  title={isInWatchlist ? "Remove from list" : "Add to list"}
                >
                  {isLoading ? (
                    <FaSpinner className="text-sm animate-spin" />
                  ) : isInWatchlist ? (
                    <FaMinus className="text-sm" />
                  ) : (
                    <FaPlus className="text-sm" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}