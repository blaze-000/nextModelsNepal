'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Partner = {
  name: string;
  image: string;
};

type PartnerScrollerProps = {
  partners: Partner[];
  speed?: number; // px/sec
};

export default function PartnerScroller({ partners, speed = 1000 }: PartnerScrollerProps) {
  const [translateX, setTranslateX] = useState(0);
  const [itemWidth, setItemWidth] = useState(160);
  const itemRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const speedRef = useRef(speed);

  // Keep speedRef in sync with prop
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    if (itemRef.current) {
      const width = itemRef.current.offsetWidth + 32; // 32px = gap-8
      setItemWidth(width);
    }
  }, []);

  const TOTAL_WIDTH = partners.length * itemWidth;

  useEffect(() => {
    const animate = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const newX = (elapsed * speedRef.current) / 1000;

      if (newX >= TOTAL_WIDTH) {
        startTimeRef.current = now;
        setTranslateX(0);
      } else {
        setTranslateX(newX);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [TOTAL_WIDTH]);

  return (
    <div className="relative overflow-hidden mt-12 max-w-7xl mx-auto px-4">
      <div
        className="flex will-change-transform"
        style={{
          transform: `translateX(-${translateX}px)`,
          width: `${itemWidth * partners.length * 2}px`,
        }}
      >
        {[...partners, ...partners].map((partner, idx) => (
          <div
            key={`${partner.name}-${idx}`}
            ref={idx === 0 ? itemRef : null}
            className="h-14 w-40 flex-shrink-0 flex items-center justify-center"
          >
            <Image
              src={partner.image}
              alt={partner.name}
              width={120}
              height={56}
              className="object-contain h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
