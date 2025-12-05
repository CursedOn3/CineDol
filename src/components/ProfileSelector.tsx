'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProfileStore } from '@/store/profileStore';
import { useTranslations } from '@/i18n';
import type { Profile } from '@/types';

interface ProfileSelectorProps {
  profiles: Profile[];
}

const avatarColors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

export function ProfileSelector({ profiles }: ProfileSelectorProps) {
  const router = useRouter();
  const { setCurrentProfile } = useProfileStore();
  const { t } = useTranslations();

  const handleProfileSelect = (profile: Profile) => {
    setCurrentProfile(profile);
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="text-center w-full max-w-6xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 md:mb-12">
          {t('profile.whoIsWatching')}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          {profiles.map((profile, index) => (
            <motion.button
              key={profile.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleProfileSelect(profile)}
              className="flex flex-col items-center gap-4 group"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg ${
                  avatarColors[index % avatarColors.length]
                } flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold group-hover:ring-4 group-hover:ring-white transition-all duration-200`}
              >
                {profile.name[0].toUpperCase()}
              </div>
              <span className="text-sm sm:text-base md:text-lg text-gray-400 group-hover:text-white transition-colors">
                {profile.name}
              </span>
            </motion.button>
          ))}

          {/* Add Profile Button */}
          {profiles.length < 5 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/profiles/add')}
              className="flex flex-col items-center gap-4 group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg bg-netflix-gray flex items-center justify-center group-hover:bg-netflix-lightGray transition-colors">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="text-sm sm:text-base md:text-lg text-gray-400 group-hover:text-white transition-colors">
                {t('profile.addProfile')}
              </span>
            </motion.button>
          )}
        </div>

        <button
          onClick={() => router.push('/profiles/manage')}
          className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors border border-gray-600 hover:border-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded"
        >
          {t('profile.manageProfiles')}
        </button>
      </div>
    </div>
  );
}
