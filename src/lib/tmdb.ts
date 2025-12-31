import axios from 'axios';
import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBResponse,
  SearchResponse,
} from '@/types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const TMDB_ACCESS_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN!;

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Cache helper functions
function getCacheKey(endpoint: string, params?: Record<string, any>): string {
  return `${endpoint}:${JSON.stringify(params || {})}`;
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Generic fetch function with caching
async function fetchFromTMDB<T>(
  endpoint: string,
  params?: Record<string, any>,
  useCache = true
): Promise<T> {
  const cacheKey = getCacheKey(endpoint, params);

  if (useCache) {
    const cached = getFromCache<T>(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await tmdbClient.get<T>(endpoint, { params });
    if (useCache) {
      setCache(cacheKey, response.data);
    }
    return response.data;
  } catch (error) {
    console.error(`TMDB API Error (${endpoint}):`, error);
    throw new Error(`Failed to fetch from TMDB: ${endpoint}`);
  }
}

// Public API Functions
export const tmdbService = {
  // Get trending movies/tv shows
  async getTrending(
    mediaType: 'movie' | 'tv' | 'all' = 'all',
    timeWindow: 'day' | 'week' = 'week'
  ): Promise<TMDBResponse<TMDBMovie | TMDBTVShow>> {
    return fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`);
  },

  // Get popular movies
  async getPopularMovies(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return fetchFromTMDB('/movie/popular', { page });
  },

  // Get top rated movies
  async getTopRatedMovies(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return fetchFromTMDB('/movie/top_rated', { page });
  },

  // Get now playing movies
  async getNowPlaying(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return fetchFromTMDB('/movie/now_playing', { page });
  },

  // Get upcoming movies
  async getUpcoming(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return fetchFromTMDB('/movie/upcoming', { page });
  },

  // Get popular TV shows
  async getPopularTVShows(page = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return fetchFromTMDB('/tv/popular', { page });
  },

  // Get top rated TV shows
  async getTopRatedTVShows(page = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return fetchFromTMDB('/tv/top_rated', { page });
  },

  // Get airing today TV shows
  async getAiringToday(page = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return fetchFromTMDB('/tv/airing_today', { page });
  },

  // Get on the air TV shows
  async getOnTheAir(page = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return fetchFromTMDB('/tv/on_the_air', { page });
  },

  // Get movie details
  async getMovieDetails(id: number): Promise<TMDBMovieDetails> {
    return fetchFromTMDB(`/movie/${id}`, {
      append_to_response: 'videos,credits,similar,recommendations',
    });
  },

  // Get TV show details
  async getTVDetails(id: number): Promise<TMDBTVDetails> {
    return fetchFromTMDB(`/tv/${id}`, {
      append_to_response: 'videos,credits,similar,recommendations',
    });
  },

  // Get season details with episodes
  async getSeasonDetails(tvId: number, seasonNumber: number) {
    return fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`);
  },

  // Get movie credits
  async getMovieCredits(id: number) {
    return fetchFromTMDB(`/movie/${id}/credits`);
  },

  // Get TV credits
  async getTVCredits(id: number) {
    return fetchFromTMDB(`/tv/${id}/credits`);
  },

  // Search multi (movies, tv shows, people)
  async search(query: string, page = 1): Promise<SearchResponse> {
    return fetchFromTMDB('/search/multi', { query, page }, false);
  },

  // Search movies
  async searchMovies(query: string, page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return fetchFromTMDB('/search/movie', { query, page }, false);
  },

  // Search TV shows
  async searchTVShows(query: string, page = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return fetchFromTMDB('/search/tv', { query, page }, false);
  },

  // Get movies by genre
  async getMoviesByGenre(genreId: number, page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return fetchFromTMDB('/discover/movie', {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc',
    });
  },

  // Get TV shows by genre
  async getTVShowsByGenre(genreId: number, page = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return fetchFromTMDB('/discover/tv', {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc',
    });
  },

  // Get movie genres
  async getMovieGenres() {
    return fetchFromTMDB('/genre/movie/list');
  },

  // Get TV genres
  async getTVGenres() {
    return fetchFromTMDB('/genre/tv/list');
  },

  // Get similar movies
  async getSimilarMovies(id: number, page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return fetchFromTMDB(`/movie/${id}/similar`, { page });
  },

  // Get similar TV shows
  async getSimilarTVShows(id: number, page = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return fetchFromTMDB(`/tv/${id}/similar`, { page });
  },

  // Get movie recommendations
  async getMovieRecommendations(id: number, page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return fetchFromTMDB(`/movie/${id}/recommendations`, { page });
  },

  // Get TV recommendations
  async getTVRecommendations(id: number, page = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return fetchFromTMDB(`/tv/${id}/recommendations`, { page });
  },

  // Helper: Get poster URL
  getPosterUrl(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '/images/no-poster.png';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  // Helper: Get backdrop URL
  getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'original'): string {
    if (!path) return '/images/no-backdrop.png';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  // Helper: Get profile URL
  getProfileUrl(path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string {
    if (!path) return '/images/no-profile.png';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  // Helper: Get YouTube trailer URL
  getYouTubeUrl(key: string): string {
    return `https://www.youtube.com/watch?v=${key}`;
  },

  // Helper: Get YouTube embed URL
  getYouTubeEmbedUrl(key: string): string {
    return `https://www.youtube.com/embed/${key}`;
  },

  // Clear cache (useful for admin updates)
  clearCache(): void {
    cache.clear();
  },

  // Generic fetch function for custom queries
  fetchFromTMDB,
};
