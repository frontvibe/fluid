import type {TypeFromSelection} from 'groqd';

import Autoplay from 'embla-carousel-autoplay';
import {useInView} from 'framer-motion';
import {useMemo, useRef} from 'react';

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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const plugins = useMemo(() => (autoplay ? [Autoplay()] : []), [autoplay]);
  const imageSizes = slidesPerViewDesktop
    ? `(min-width: 1024px) ${
        100 / slidesPerViewDesktop
      }vw, (min-width: 768px) 50vw, 100vw`
    : '(min-width: 768px) 50vw, 100vw';
  const isActive = slides?.length! > 1;

  return (
    <div className="container" ref={ref}>
      <h2>{title}</h2>
      {slides && slides?.length > 0 && (
        <Carousel
          className="[--slide-spacing:1rem]"
          opts={{
            active: isActive,
            loop: loop || false,
          }}
          plugins={plugins}
          style={
            {
              '--slides-per-view': slidesPerViewDesktop,
            } as React.CSSProperties
          }
        >
          <div className="relative">
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem className="[&>span]:h-full" key={slide._key}>
                  <SanityImage
                    className="size-full object-cover"
                    data={slide.image}
                    loading={inView ? 'eager' : 'lazy'}
                    showBorder={false}
                    showShadow={false}
                    sizes={imageSizes}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {arrows && isActive && (
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
  );
}
