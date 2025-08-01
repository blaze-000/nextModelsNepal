'use client';
import { Spinner } from '@geist-ui/react';
import { Button } from '../ui/button';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

const NewsLetterBox: React.FC<NewsletterSubscriptionProps> = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // await onSubmit(email);
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gold-900 lg:rounded-none rounded-3xl px-6 py-6 sm:px-16 sm:py-10 shadow-lg w-full mx-auto"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Newsletter Title */}
        <div className="w-full lg:flex-shrink-0 lg:w-auto">
          <h2 className="text-white text-2xl sm:text-3xl lg:text-3xl font-newsreader font-normal text-center lg:text-left">
            Subscribe to our{' '}
            <span className="text-gold-500">NewsLetter</span>
          </h2>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-stretch sm:items-start gap-4 flex-1 lg:max-w-2xl">
          <div className="flex-1 min-w-0">
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={handleInputChange}
              placeholder="e.g johndoe@example.com"
              className={`w-full px-6 py-4 rounded-full bg-white text-gray-800 placeholder-gray-500 outline-none focus:ring-2 transition-all duration-200 text-base ${
                error ? 'focus:ring-red-500' : 'focus:ring-gold-400'
              }`}
              disabled={isSubmitting}
              aria-label="Email address"
              aria-invalid={!!error}
            />
            {error && (
              <p className="text-red-400 text-sm mt-2 px-2" role="alert">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full sm:w-auto sm:px-6 sm:py-4 min-w-[120px] group"
            aria-label={isSubmitting ? 'Submitting subscription' : 'Submit subscription'}
          >
            {isSubmitting ? (
              <>
                <Spinner scale={0.5} color="white" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit</span>
                <i className="ri-arrow-right-up-line transition-transform group-hover:scale-110" />
              </>
            )}
          </Button>
        </div>

        {/* 📱 Mobile Layout */}
        <div className="flex flex-col gap-2 w-full sm:hidden">
          <div className="relative">
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={handleInputChange}
              placeholder="e.g johndoe@example.com"
              className={`w-full px-5 py-5 pr-16 rounded-full bg-white text-gray-800 placeholder-gray-500 outline-none focus:ring-2 transition-all duration-200 text-base ${
                error ? 'focus:ring-red-500' : 'focus:ring-gold-400'
              }`}
              disabled={isSubmitting}
              aria-label="Email address"
              aria-invalid={!!error}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-0 top-0 w-16 h-16 rounded-full bg-gold-500 hover:bg-gold-400 text-white flex items-center justify-center transition-colors duration-200"
              aria-label={isSubmitting ? 'Submitting subscription' : 'Submit subscription'}
            >
              {isSubmitting ? (
                <Spinner scale={0.5} color="white" />
              ) : (
                <i className="ri-arrow-right-up-line text-lg" />
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm px-2" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default NewsLetterBox;