"use client";
import React, { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel, { EmblaCarouselType } from "embla-carousel-react";
import EventCard from "../molecules/event-card";

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

const events = [
  {
    id: "miss-nepal-peace-2024",
    title: "Miss Nepal Peace",
    dateSpan: "19th July to 6th September",
    briefInfo:
      "Miss Nepal Peace is a pageant for honest, celebrating their role in care and peace while empowering them to represent Nepal on global stage.",
    imageSrc: "/events_1.jpg",
    state: "ongoing" as const,
    columnPosition: "left" as const,
    managedBy: "self" as const,
    getTicketLink: "https://example.com/tickets",
    aboutLink: "https://example.com/about",
  },
  {
    id: "fashion-week-2024",
    title: "Nepal Fashion",
    dateSpan: "15th August to 20th August",
    briefInfo:
      "A spectacular showcase of Nepalese fashion talent, bringing together designers, models, and fashion enthusiasts from across the region.",
    imageSrc: "/events_1.jpg",
    state: "completed" as const,
    columnPosition: "left" as const,
    managedBy: "partner" as const,
    getTicketLink: "https://example.com/fashion-tickets",
    aboutLink: "https://example.com/fashion-about",
  },
  {
    id: "miss-nepal-peace-2024-2",
    title: "Miss Nepal Peace",
    dateSpan: "19th July to 6th September",
    briefInfo:
      "Miss Nepal Peace is a pageant for honest, celebrating their role in care and peace while empowering them to represent Nepal on global stage.",
    imageSrc: "/events_1.jpg",
    state: "ongoing" as const,
    columnPosition: "left" as const,
    managedBy: "self" as const,
    getTicketLink: "https://example.com/tickets",
    aboutLink: "https://example.com/about",
  },
  {
    id: "fashion-week-2024-2",
    title: "Nepal Fashion",
    dateSpan: "15th August to 20th August",
    briefInfo:
      "A spectacular showcase of Nepalese fashion talent, bringing together designers, models, and fashion enthusiasts from across the region.",
    imageSrc: "/events_1.jpg",
    state: "completed" as const,
    columnPosition: "left" as const,
    managedBy: "partner" as const,
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

  const tweenNodes = useRef<HTMLElement[]>([]);
  const tweenFactor = useRef(0);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__scale") as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((emblaApi: EmblaCarouselType) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (!slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
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
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);
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
    <section className="w-full bg-background2 py-16 overflow-hidden">
      <div className="w-full">
        <div className="relative w-full">
          <div className="embla px-[10%]" ref={emblaRef}>
            <div className="embla__container flex">
              {events.map((event) => (
                <div
                  className="embla__slide flex items-center justify-center"
                  style={{ flex: "0 0 95%" }}
                  key={event.id}
                >
                  <div className="embla__slide__scale transition-transform duration-300 ease-out">
                    <EventCard {...event} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-center mt-6 gap-4">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventHero;