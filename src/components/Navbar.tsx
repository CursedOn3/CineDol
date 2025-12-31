'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/i18n';
import { useLanguageStore } from '@/store/languageStore';
import { useProfileStore } from '@/store/profileStore';
import { FaSearch, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t, language } = useTranslations();
  const { setLanguage } = useLanguageStore();
  const { currentProfile } = useProfileStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/home', label: t('nav.home') },
    { href: '/movies', label: t('nav.movies') },
    { href: '/tv-shows', label: t('nav.tvShows') },
    { href: '/k-drama', label: t('nav.kDrama') },
    { href: '/c-drama', label: t('nav.cDrama') },
    { href: '/anime', label: t('nav.anime') },
    { href: '/kids', label: t('nav.kids') },
    { href: '/adult', label: t('nav.adult') },
    ...(session ? [
      { href: '/watchlist', label: t('nav.myList') },
      { href: '/continue-watching', label: t('nav.continueWatching') },
    ] : []),
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
    >
      <div className="px-3 sm:px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <Link href="/home" className="text-netflix-red text-xl sm:text-2xl md:text-3xl font-bold">
            CINEDOL
          </Link>

          {/* Nav Links - Desktop */}
          <ul className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm hover:text-gray-300 transition-colors ${pathname === link.href ? 'font-bold' : ''
                    }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {session?.user?.isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className={`text-sm hover:text-gray-300 transition-colors ${pathname.startsWith('/admin') ? 'font-bold' : ''
                    }`}
                >
                  {t('nav.admin')}
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 border border-white/50 rounded hover:border-white transition-colors"
          >
            {language === 'en' ? 'नेपाली' : 'English'}
          </button>

          {/* Search */}
          <Link href="/search" className="hover:text-gray-300 transition-colors">
            <FaSearch className="text-base sm:text-lg md:text-xl" />
          </Link>

          {/* Notifications */}
          <button className="hover:text-gray-300 transition-colors hidden sm:block">
            <FaBell className="text-lg md:text-xl" />
          </button>

          {/* Profile Menu / Auth Buttons */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {currentProfile ? (
                  <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center text-sm font-bold">
                    {currentProfile.name[0].toUpperCase()}
                  </div>
                ) : (
                  <FaUser className="text-xl" />
                )}
              </button>

              {/* Dropdown */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-netflix-darkGray border border-netflix-gray rounded shadow-lg py-2"
                >
                  <Link
                    href="/profiles"
                    className="block px-4 py-2 hover:bg-netflix-gray transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    {t('profile.manageProfiles')}
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/home' });
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-netflix-gray transition-colors flex items-center gap-2"
                  >
                    <FaSignOutAlt />
                    {t('auth.signOut')}
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/login"
                className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm hover:text-gray-300 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-netflix-red hover:bg-red-700 rounded transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Links */}
      <div className="lg:hidden px-3 sm:px-4 pb-2 overflow-x-auto">
        <ul className="flex items-center gap-3 sm:gap-4 scrollbar-hide whitespace-nowrap">
          {navLinks.map((link) => (
            <li key={link.href} className="flex-shrink-0">
              <Link
                href={link.href}
                className={`text-xs sm:text-sm hover:text-gray-300 transition-colors ${pathname === link.href ? 'font-bold' : ''
                  }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
