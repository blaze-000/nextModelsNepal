"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";
import EventCard from "../molecules/event-card";
import { motion } from "framer-motion";
import Axios from "@/lib/axios-instance";
import { formatDate } from "@/lib/utils";

const TWEEN_FACTOR_BASE = 0.52;
const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

const EventHero = () => {
  const [events, setEvents] = useState<TimelineEvent[] | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      duration: 30,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const tweenNodes = useRef<Array<HTMLElement | null>>([]);
  const tweenFactor = useRef<number>(0);

  const setTweenNodes = useCallback((emblaApi?: EmblaCarouselType) => {
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
          if (tweenNode) tweenNode.style.transform = `scale(${scale})`;
        });
      });
  }, []);

  // Fetch events
  useEffect(() => {
    (async () => {
      const res = await Axios.get("/api/events/timeline");
      setEvents(res.data.data);
    })();
  }, []);

  // Update tween after Embla is ready and slides exist
  useEffect(() => {
    if (!emblaApi || !events) return;

    // Wait for DOM to render slides
    requestAnimationFrame(() => {
      setTweenNodes(emblaApi);
      setTweenFactor(emblaApi);
      tweenScale(emblaApi);
      emblaApi.reInit();
    });
  }, [emblaApi, events, setTweenNodes, setTweenFactor, tweenScale]);

  useEffect(() => {
    if (!emblaApi) return;

    const handleScroll = () => tweenScale(emblaApi);
    const handleReInit = () => {
      setTweenNodes(emblaApi);
      setTweenFactor(emblaApi);
      tweenScale(emblaApi);
    };

    emblaApi.on("scroll", handleScroll);
    emblaApi.on("slideFocus", handleScroll);
    emblaApi.on("reInit", handleReInit);

    return () => {
      emblaApi.off("scroll", handleScroll);
      emblaApi.off("slideFocus", handleScroll);
      emblaApi.off("reInit", handleReInit);
    };
  }, [emblaApi, setTweenNodes, setTweenFactor, tweenScale]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(false), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(false), [emblaApi]);

  // Render carousel only after events are loaded
  if (!events) return null;

  return (
    <section className="w-full bg-background2 pt-16 pb-8 md:py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="embla px-[10%]" ref={emblaRef}>
          <div className="embla__container flex">
            {events.map((event) => (
              <div
                className="embla__slide"
                style={{ flex: "0 0 85%" }}
                key={event.eventName}
              >
                <div className="embla__slide__scale transition-transform duration-200 ease-out">
                  <EventCard
                    title={event.eventName}
                    slug={event.season.slug}
                    date={`${formatDate(
                      event.season.startDate
                    )} to ${formatDate(event.season.endDate)}`}
                    overview={event.overview}
                    coverImage={event.coverImage}
                    state={event.season.status}
                    manageBy={event.managedBy}
                    getTicketLink={event.season.getTicketLink}
                    timelinePosition={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="w-full flex justify-center mt-6 gap-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
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
    </section>
  );
};

export default EventHero;
