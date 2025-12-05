'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTranslations } from '@/i18n';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import type { Profile } from '@/types';

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

export default function ManageProfilesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useTranslations();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchProfiles();
  }, [session]);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data);
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setNewName(profile.name);
  };

  const handleSave = async () => {
    if (!editingProfile || !newName.trim()) return;

    try {
      const response = await fetch(`/api/profiles/${editingProfile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (response.ok) {
        await fetchProfiles();
        setEditingProfile(null);
        setNewName('');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleDelete = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProfiles();
      }
    } catch (error) {
      console.error('Failed to delete profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-netflix-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {t('profile.manageProfiles')}
          </h1>
          <Button
            variant="secondary"
            onClick={() => router.push('/profiles')}
            className="text-xs sm:text-sm"
          >
            <FaArrowLeft className="mr-1 sm:mr-2" />
            {t('common.back')}
          </Button>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center"
            >
              {editingProfile?.id === profile.id ? (
                <div className="w-full space-y-3">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg ${
                      avatarColors[index % avatarColors.length]
                    } flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold mx-auto`}
                  >
                    {newName[0]?.toUpperCase() || profile.name[0].toUpperCase()}
                  </div>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Profile name"
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSave}
                      className="flex-1 text-xs"
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingProfile(null);
                        setNewName('');
                      }}
                      className="flex-1 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg ${
                      avatarColors[index % avatarColors.length]
                    } flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold mx-auto`}
                  >
                    {profile.name[0].toUpperCase()}
                  </div>
                  <p className="text-sm sm:text-base text-center text-gray-400 truncate">
                    {profile.name}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(profile)}
                      className="p-2 bg-netflix-gray hover:bg-netflix-lightGray rounded transition-colors"
                      title="Edit"
                    >
                      <FaEdit className="text-sm sm:text-base" />
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="p-2 bg-netflix-gray hover:bg-red-600 rounded transition-colors"
                      title="Delete"
                      disabled={profiles.length === 1}
                    >
                      <FaTrash className="text-sm sm:text-base" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Add New Profile */}
          {profiles.length < 5 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push('/profiles/add')}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg bg-netflix-gray hover:bg-netflix-lightGray flex items-center justify-center transition-colors mx-auto">
                <FaPlus className="text-2xl sm:text-3xl md:text-4xl text-gray-500" />
              </div>
              <p className="text-sm sm:text-base text-gray-400 mt-3">
                {t('profile.addProfile')}
              </p>
            </motion.button>
          )}
        </div>

        {/* Done Button */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/profiles')}
            className="text-sm sm:text-base"
          >
            {t('common.done')}
          </Button>
        </div>
      </div>
    </div>
  );
}
