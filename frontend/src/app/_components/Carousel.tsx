"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface EmblaCarouselProps {
  slides: React.ReactNode[];
}

const EmblaCarousel = ({ slides }: EmblaCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", slidesToScroll: 1 },
    [Autoplay({ delay: 3000 })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="embla overflow-hidden relative" ref={emblaRef}>
      {/* Slides */}
      <div className="embla__container flex">
        {slides.map((slide, index) => (
          <div className="embla__slide flex-[0_0_60%] min-w-0 px-4" key={index}>
            {slide}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        className="embla__prev absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all"
        onClick={() => emblaApi && emblaApi.scrollPrev()}
      >
        ←
      </button>
      <button
        className="embla__next absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all"
        onClick={() => emblaApi && emblaApi.scrollNext()}
      >
        →
      </button>

      {/* Dots */}
      <div className="embla__dots flex justify-center mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`embla__dot w-3 h-3 mx-1 rounded-full transition-all ${
              index === selectedIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default EmblaCarousel;
