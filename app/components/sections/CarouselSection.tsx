import type {TypeFromSelection} from 'groqd';

import Autoplay from 'embla-carousel-autoplay';
import {useMemo} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {CAROUSEL_SECTION_FRAGMENT} from '~/qroq/sections';

import {SanityImage} from '../sanity/SanityImage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPrevious,
} from '../ui/Carousel';

type CarouselSectionProps = TypeFromSelection<typeof CAROUSEL_SECTION_FRAGMENT>;

export function CarouselSection(
  props: SectionDefaultProps & {data: CarouselSectionProps},
) {
  const {data} = props;
  const {
    arrows,
    autoplay,
    loop,
    pagination,
    slides,
    slidesPerViewDesktop,
    title,
  } = data;

  const slidesPerView = slidesPerViewDesktop ? 100 / slidesPerViewDesktop : 100;
  const plugins = useMemo(() => (autoplay ? [Autoplay()] : []), [autoplay]);
  const imageSizes = slidesPerViewDesktop
    ? `(min-width: 1024px) ${
        100 / slidesPerViewDesktop
      }vw, (min-width: 768px) 50vw, 100vw`
    : '(min-width: 768px) 50vw, 100vw';

  return (
    <div className="container">
      <h2>{title}</h2>
      <div
        style={
          {
            '--slidesPerView': `${slidesPerView}%`,
          } as React.CSSProperties
        }
      >
        {slides && slides?.length > 0 && (
          <Carousel
            opts={{
              loop: loop || false,
            }}
            plugins={plugins}
          >
            <div className="relative">
              <CarouselContent>
                {slides.map((slide) => (
                  <CarouselItem
                    className="p-0 md:basis-1/2 md:pl-4 lg:basis-[var(--slidesPerView)]"
                    key={slide._key}
                  >
                    <SanityImage data={slide.image} sizes={imageSizes} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {arrows && (
                <div className="hidden md:block">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              )}
            </div>
            {pagination && <CarouselPagination />}
          </Carousel>
        )}
      </div>
    </div>
  );
}
