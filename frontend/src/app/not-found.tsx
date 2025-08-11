'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back(); // Go to the last visited page
    } else {
      router.push('/'); // Fallback to homepage
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
    bg-[radial-gradient(circle_at_center,var(--primary)_0%,var(--gold-900)_40%)] text-background text-center px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! Page not found.</p>
      <p className="mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button variant="default"
        onClick={handleGoBack}
        className="inline-flex items-center gap-2 bg-black text-primary font-semibold px-5 py-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
      >
        <i className='ri-arrow-left-line' />
        Go Back
      </Button>
    </div>
  );
};