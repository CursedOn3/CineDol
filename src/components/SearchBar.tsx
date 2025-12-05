'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { useTranslations } from '@/i18n';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
}

export function SearchBar({ onSearch, autoFocus = false }: SearchBarProps) {
  const router = useRouter();
  const { t } = useTranslations();
  const [query, setQuery] = useState('');

  // Debounce search with useCallback to prevent re-renders
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchQuery: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (searchQuery.trim()) {
            if (onSearch) {
              onSearch(searchQuery);
            } else {
              router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            }
          }
        }, 300);
      };
    })(),
    [onSearch, router]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={t('search.placeholder')}
          autoFocus={autoFocus}
          className="w-full px-12 py-4 bg-netflix-darkGray border border-netflix-gray rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all duration-200"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
        
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
