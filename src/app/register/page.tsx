'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslations } from '@/i18n';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslations();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Registration failed');
        setIsLoading(false);
        return;
      }

      // Auto sign in after registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Registration successful but login failed');
      } else {
        router.push('/profiles');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/profiles' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 bg-gradient-to-b from-netflix-black to-netflix-darkGray">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-netflix-red text-3xl sm:text-4xl font-bold mb-2">CINEDOL</h1>
          <h2 className="text-2xl sm:text-3xl font-bold">{t('auth.signUp')}</h2>
        </div>

        <div className="bg-netflix-darkGray/80 p-6 sm:p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label={t('auth.name')}
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="email"
              label={t('auth.email')}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label={t('auth.password')}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={error}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('common.loading') : t('auth.signUp')}
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-600" />
            <span className="px-4 text-gray-400 text-sm">{t('auth.orContinueWith')}</span>
            <div className="flex-1 border-t border-gray-600" />
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <FaGoogle className="text-xl" />
            {t('auth.signUpWithGoogle')}
          </Button>

          <div className="mt-6 text-center text-sm text-gray-400">
            {t('auth.hasAccount')}{' '}
            <Link href="/login" className="text-white hover:underline">
              {t('auth.signIn')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
