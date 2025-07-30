'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getAllBrands } from '@/api/brand';
import { getImageUrl } from '@/lib/imageUtils';
import SkeletonLoader from '../common/skeletonloader';

interface Brand {
  id: number;
  name: string;
  image: string;
}

type BrandCarouselProps = {
  title?: string;
  titleClassName?: string;
};

export default function BrandCarousel({
  title = 'Shop by brands',
  titleClassName = '',
}: BrandCarouselProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [brandWidth, setBrandWidth] = useState(208);
  const animationRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const startTimeRef = useRef<number | undefined>(undefined);
  const pausedTimeRef = useRef<number>(0);
  const SCROLL_SPEED = 35;

  // Fetch brands from backend and remove duplicates
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllBrands();
        const brandsData = response.data || [];
        
        // Remove duplicate brands based on name and id
        const uniqueBrands = brandsData.filter((brand: Brand, index: number, self: Brand[]) => 
          index === self.findIndex((b) => b.id === brand.id && b.name === brand.name)
        );
        
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
        setError("Failed to load brands");
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (cardRef.current && brands.length > 0) {
      const width = cardRef.current.offsetWidth + 32; // gap-8 = 32px
      setBrandWidth(width);
    }
  }, [brands]);

  const TOTAL_WIDTH = brands.length * brandWidth;

  useEffect(() => {
    if (!isPaused && brands.length > 0) {
      const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = currentTime - pausedTimeRef.current;
        }
        const elapsed = currentTime - startTimeRef.current;
        const newTranslateX = (elapsed * SCROLL_SPEED) / 1000;

        if (newTranslateX >= TOTAL_WIDTH) {
          startTimeRef.current = currentTime;
          pausedTimeRef.current = 0;
          setTranslateX(0);
        } else {
          setTranslateX(newTranslateX);
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
        pausedTimeRef.current = ((translateX / TOTAL_WIDTH) * (TOTAL_WIDTH * 1000)) / SCROLL_SPEED;
        startTimeRef.current = undefined;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, translateX, TOTAL_WIDTH, brands.length]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

 if (loading) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className={`text-2xl font-semibold text-gray-900 mb-8 ${titleClassName}`}>
        {title}
      </h2>
      <div className="flex gap-8 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <SkeletonLoader key={i} type="brand" />
        ))}
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className={`text-2xl font-semibold text-gray-900 mb-8 ${titleClassName}`}>
          {title}
        </h2>
        <div className="text-center py-16 text-gray-500">
          {error}
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className={`text-2xl font-semibold text-gray-900 mb-8 ${titleClassName}`}>
          {title}
        </h2>
        <div className="text-center py-16 text-gray-500">
          No brands available
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className={`text-2xl font-semibold text-gray-900 mb-8 ${titleClassName}`}>
        {title}
      </h2>

      <div className="relative overflow-hidden">
        <div
          ref={containerRef}
          className="flex gap-8 transition-transform duration-100 ease-out"
          style={{
            transform: `translateX(-${translateX}px)`,
            width: `${brandWidth * brands.length}px`,
          }}
        >
          {brands.map((brand, index) => (
            <Link
              key={`${brand.id}-${brand.name}`}
              href={`/brand/${brand.name.toLowerCase()}`}
              ref={index === 0 ? cardRef : null}
              className="relative flex-shrink-0 group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label={`Shop by brand ${brand.name}`}
            >
              <div className="w-36 h-24 sm:w-40 sm:h-28 bg-transparent rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 p-2 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={getImageUrl(brand.image)}
                    alt={brand.name}
                    fill
                    className="object-contain transition-all duration-300 group-hover:opacity-80"
                    sizes="(max-width: 640px) 160px, 192px"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}