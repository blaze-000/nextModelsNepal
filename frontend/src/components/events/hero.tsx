"use client";
import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import EventCard from "../molecules/event-card";
import { motion } from "framer-motion";

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

const events:EventType[] = [
  {
    id: "miss-nepal-peace-2024",
    title: "Miss Nepal Peace",
    slug: "miss-nepal-peace-2024",
    startDate: "2024-07-19",
    endDate: "2024-09-06",
    briefInfo:
      "Miss Nepal Peace is a pageant for honest, celebrating their role in care and peace while empowering them to represent Nepal on global stage.",
    imageSrc: "/events_1.jpg",
    state: "ongoing",
    managedBy: "self",
    getTicketLink: "https://example.com/tickets",
    aboutLink: "https://example.com/about",
  },
  {
    id: "fashion-week-2024",
    title: "Nepal Fashion",
    slug: "fashion-week-2024",
    startDate: "2024-08-15",
    endDate: "2024-08-20",
    briefInfo:
      "A spectacular showcase of Nepalese fashion talent, bringing together designers, models, and fashion enthusiasts from across the region.",
    imageSrc: "/events_1.jpg",
    state: "ended",
    managedBy: "partner",
    getTicketLink: "https://example.com/fashion-tickets",
    aboutLink: "https://example.com/fashion-about",
  },
  {
    id: "miss-nepal-peace-2024-2",
    title: "Miss Nepal Peace",
    slug: "miss-nepal-peace-2024-2",
    startDate: "2024-07-19",
    endDate: "2024-09-06",
    briefInfo:
      "Miss Nepal Peace is a pageant for honest, celebrating their role in care and peace while empowering them to represent Nepal on global stage.",
    imageSrc: "/events_1.jpg",
    state: "ongoing",
    managedBy: "self",
    getTicketLink: "https://example.com/tickets",
    aboutLink: "https://example.com/about",
  },
  {
    id: "fashion-week-2024-2",
    title: "Nepal Fashion",
    slug: "fashion-week-2024-2",
    startDate: "2024-08-15",
    endDate: "2024-08-20",
    briefInfo:
      "A spectacular showcase of Nepalese fashion talent, bringing together designers, models, and fashion enthusiasts from across the region.",
    imageSrc: "/events_1.jpg",
    state: "ended",
    managedBy: "partner",
    getTicketLink: "https://example.com/fashion-tickets",
    aboutLink: "https://example.com/fashion-about",
  },
];


const EventHero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    duration: 30,
  });

  const tweenNodes = useRef<Array<HTMLElement | null>>([]);
  const tweenFactor = useRef<number>(0);

  const setTweenNodes = useCallback((emblaApi?: EmblaCarouselType): void => {
    if (!emblaApi) return;
    tweenNodes.current = emblaApi.slideNodes().map((slideNode: Element) => {
      return slideNode.querySelector(
        ".embla__slide__scale"
      ) as HTMLElement | null;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi?: EmblaCarouselType) => {
    if (!emblaApi) return;
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((emblaApi?: EmblaCarouselType) => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();

    emblaApi
      .scrollSnapList()
      .forEach((scrollSnap: number, snapIndex: number) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap: number[] = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex: number) => {
          if (!slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            (engine.slideLooper.loopPoints as LoopPoint[]).forEach(
              (loopItem) => {
                const target = loopItem.target();
                if (slideIndex === loopItem.index && target !== 0) {
                  const sign = Math.sign(target);
                  if (sign === -1)
                    diffToTarget = scrollSnap - (1 + scrollProgress);
                  if (sign === 1)
                    diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            );
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const scale = numberWithinRange(tweenValue, 0.85, 1).toString();
          const tweenNode = tweenNodes.current[slideIndex];
          if (tweenNode) {
            tweenNode.style.transform = `scale(${scale})`;
          }
        });
      });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", () => setTweenNodes(emblaApi))
      .on("reInit", () => setTweenFactor(emblaApi))
      .on("reInit", () => tweenScale(emblaApi))
      .on("scroll", () => tweenScale(emblaApi))
      .on("slideFocus", () => tweenScale(emblaApi));
  }, [emblaApi, setTweenNodes, setTweenFactor, tweenScale]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev(false);
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext(false);
    }
  }, [emblaApi]);

  return (
    <section className="w-full bg-background2 pt-16 pb-8 md:py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}>
        <div className="embla px-[10%]" ref={emblaRef}>
          <div className="embla__container flex">
            {events.map((event) => (
              <div
                className="embla__slide"
                style={{ flex: "0 0 85%" }}
                key={event.id}
              >

                <div className="embla__slide__scale transition-transform duration-200 ease-out"
                >
                  <EventCard {...event} />
                </div>

              </div>
            ))}
          </div>
        </div >
      </motion.div>

      <motion.div className="w-full flex justify-center mt-6 gap-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}>
        <button
          onClick={scrollPrev}
          className="w-12 h-12 rounded-full bg-[#4D4D4D] text-white hover:bg-gray-800 transition-colors text-xl"
          aria-label="Previous slide"
        >
          <i className="ri-arrow-left-line" />
        </button>
        <button
          onClick={scrollNext}
          className="w-12 h-12 rounded-full bg-[#4D4D4D] text-white hover:bg-gray-800 transition-colors text-xl"
          aria-label="Next slide"
        >
          <i className="ri-arrow-right-line" />
        </button>
      </motion.div>

    </section >
  );
};

export default EventHero;
