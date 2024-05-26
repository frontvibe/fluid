import type {EmblaCarouselType} from 'embla-carousel';

import {useLocation} from '@remix-run/react';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import * as React from 'react';

import {cn} from '~/lib/utils';

import {IconChevron} from '../icons/IconChevron';
import {Button, IconButton} from './Button';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  orientation?: 'horizontal' | 'vertical';
  plugins?: CarouselPlugin;
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  api: ReturnType<typeof useEmblaCarousel>[1];
  canScrollNext: boolean;
  canScrollPrev: boolean;
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  scrollNext: () => void;
  scrollPrev: () => void;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  CarouselProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      children,
      className,
      opts,
      orientation = 'horizontal',
      plugins,
      setApi,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const {pathname} = useLocation();

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      api?.scrollTo(0);
    }, [pathname, api]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on('reInit', onSelect);
      api.on('select', onSelect);

      return () => {
        api?.off('select', onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          api: api,
          canScrollNext,
          canScrollPrev,
          carouselRef,
          opts,
          orientation:
            orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollNext,
          scrollPrev,
        }}
      >
        <div
          aria-roledescription="carousel"
          className={cn(
            'relative',
            '[--slide-size:calc(100%_/_var(--slides-per-view))]',
            className,
          )}
          onKeyDownCapture={handleKeyDown}
          ref={ref}
          role="region"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => {
  const {carouselRef, orientation} = useCarousel();

  return (
    <div className="w-full overflow-hidden" ref={carouselRef}>
      <div
        className={cn(
          'flex touch-pan-y [backface-visibility:hidden]',
          'ml-[calc(var(--slide-spacing)*-1)]',
          orientation === 'vertical' && 'flex-col',
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => {
  return (
    <div
      aria-roledescription="slide"
      className={cn(
        'min-w-0 select-none',
        'flex-[0_0_100%] pl-[--slide-spacing] md:flex-[0_0_var(--slide-size)]',
        className,
      )}
      ref={ref}
      role="group"
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof IconButton>
>(({className, ...props}, ref) => {
  const {canScrollPrev, orientation, scrollPrev} = useCarousel();

  return (
    <IconButton
      className={cn(
        'absolute rounded-full',
        orientation === 'horizontal'
          ? '-left-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      ref={ref}
      {...props}
    >
      <IconChevron className="size-4" direction="left" />
      <span className="sr-only">Previous slide</span>
    </IconButton>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof IconButton>
>(({className, ...props}, ref) => {
  const {canScrollNext, orientation, scrollNext} = useCarousel();

  return (
    <IconButton
      className={cn(
        'absolute rounded-full',
        orientation === 'horizontal'
          ? '-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      ref={ref}
      {...props}
    >
      <IconChevron className="size-4" direction="right" />
      <span className="sr-only">Next slide</span>
    </IconButton>
  );
});
CarouselNext.displayName = 'CarouselNext';

const CarouselPagination = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({className, ...props}, ref) => {
  const {api} = useCarousel();
  const {onDotButtonClick, scrollSnaps, selectedIndex} =
    useCarouselPagination(api);

  return (
    <div className="mt-3 flex justify-center gap-2">
      {scrollSnaps.map((_, index) => (
        <Button
          className={cn(className, 'p-1')}
          key={index}
          onClick={() => onDotButtonClick(index)}
          ref={ref}
          size="primitive"
          variant="primitive"
          {...props}
        >
          <span
            className={cn(
              'aspect-square size-[10px] rounded-full border border-current opacity-85 transition-colors',
              index === selectedIndex && 'bg-current',
            )}
          />
        </Button>
      ))}
    </div>
  );
});
CarouselPagination.displayName = 'CarouselDots';

const CarouselCounter = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({children, className, ...props}, ref) => {
  const {api} = useCarousel();
  const {selectedIndex} = useCarouselPagination(api);

  return (
    <div className="flex items-center gap-1 tabular-nums text-muted-foreground">
      <span className={cn(className)} ref={ref} {...props}>
        {selectedIndex + 1}
      </span>
      <span>/</span>
      {children}
    </div>
  );
});
CarouselCounter.displayName = 'CarouselCounter';

function useCarouselPagination(emblaApi: EmblaCarouselType | undefined): {
  onDotButtonClick: (index: number) => void;
  scrollSnaps: number[];
  selectedIndex: number;
} {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onDotButtonClick = React.useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = React.useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    onDotButtonClick,
    scrollSnaps,
    selectedIndex,
  };
}

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPrevious,
};
