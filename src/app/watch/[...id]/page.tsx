'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Button } from '@/components/ui/Button';
import { FaArrowLeft } from 'react-icons/fa';
import { useProfileStore } from '@/store/profileStore';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { currentProfile } = useProfileStore();
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [tmdbId, setTmdbId] = useState<number>(0);
  const [season, setSeason] = useState<number | undefined>();
  const [episode, setEpisode] = useState<number | undefined>();
  const [mediaDetails, setMediaDetails] = useState<any>(null);
  const [showControls, setShowControls] = useState(false);
  const [hideControlsTimeout, setHideControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Parse params
    const pathParts = params.id as string[];
    
    if (pathParts[0] === 'movie') {
      setMediaType('movie');
      setTmdbId(parseInt(pathParts[1]));
    } else if (pathParts[0] === 'tv') {
      setMediaType('tv');
      setTmdbId(parseInt(pathParts[1]));
      if (pathParts.length >= 4) {
        setSeason(parseInt(pathParts[2]));
        setEpisode(parseInt(pathParts[3]));
      }
    }
  }, [params]);

  useEffect(() => {
    // Fetch media details
    if (tmdbId) {
      fetchMediaDetails();
    }
  }, [tmdbId, mediaType]);

  useEffect(() => {
    // Save to continue watching when user starts watching
    if (session && currentProfile && mediaDetails && tmdbId) {
      saveToContinueWatching();
    }
  }, [session, currentProfile, mediaDetails, tmdbId]);

  const fetchMediaDetails = async () => {
    try {
      const endpoint = mediaType === 'movie' 
        ? `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=2031e307a67da00280bcbb7659383f5d`
        : `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=2031e307a67da00280bcbb7659383f5d`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setMediaDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch media details:', error);
    }
  };

  const saveToContinueWatching = async () => {
    try {
      await fetch('/api/continue-watching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: currentProfile!.id,
          tmdbId,
          mediaType,
          title: mediaType === 'movie' ? mediaDetails.title : mediaDetails.name,
          posterPath: mediaDetails.poster_path,
          backdropPath: mediaDetails.backdrop_path,
          currentTime: 0,
          duration: 0,
          seasonNumber: season,
          episodeNumber: episode,
        }),
      });
    } catch (error) {
      console.error('Failed to save to continue watching:', error);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    // Clear existing timeout
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout);
    }
    
    // Set new timeout to hide controls after 3 seconds
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setHideControlsTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout);
    }
    setShowControls(false);
  };

  useEffect(() => {
    return () => {
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
      }
    };
  }, [hideControlsTimeout]);

  if (!tmdbId) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-netflix-black flex flex-col items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Back Button - Shows on hover */}
      <div 
        className={`absolute top-4 left-4 z-50 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.back()}
          className="text-xs sm:text-sm"
        >
          <FaArrowLeft className="text-xs sm:text-base" />
          <span className="hidden sm:inline">Back</span>
        </Button>
      </div>

      {/* Video Player - Centered for mobile */}
      <div className="w-full max-w-7xl mx-auto px-0 sm:px-4 md:px-6">
        <VideoPlayer
          tmdbId={tmdbId}
          mediaType={mediaType}
          season={season}
          episode={episode}
        />
      </div>
    </div>
  );
}