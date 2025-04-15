import type {
  Filter,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';

import {AnimatePresence, m} from 'motion/react';
import {Suspense, useState} from 'react';

import type {CmsSectionSettings} from '~/hooks/use-colors-css-vars';

import {useOptimisticNavigationData} from '~/hooks/use-optimistic-navigation-data';
import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';
import {cn} from '~/lib/utils';

import {ClientOnly} from '../client-only';
import {IconFilters} from '../icons/icon-filters';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import {Button, IconButton} from '../ui/button';
import {ScrollArea} from '../ui/scroll-area';
import {DesktopSort} from './collection-sort';
import {FilterMarkup} from './filter-markup';
import {MobileDrawer} from './sort-mobile-drawer.client';
export type AppliedFilter = {
  filter: ProductFilter;
  label: string;
};

export type SortParam =
  | 'best-selling'
  | 'featured'
  | 'newest'
  | 'price-high-low'
  | 'price-low-high';

type Props = {
  appliedFilters?: AppliedFilter[];
  children: React.ReactNode;
  filters: Filter[];
  onClearAllFilters: () => void;
  productsCount: number;
  sectionSettings?: CmsSectionSettings;
};

export const FILTER_URL_PREFIX = 'filter.';

export function SortFilter({
  appliedFilters = [],
  children,
  filters,
  onClearAllFilters,
  productsCount,
  sectionSettings,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {optimisticData, pending} =
    useOptimisticNavigationData<boolean>('clear-all-filters');
  const {themeContent} = useSanityThemeContent();

  // Here we can optimistically clear all filters and close DrawerFooter
  if (optimisticData) {
    appliedFilters = [];
  }

  return (
    <>
      {/* Desktop layout */}
      <div className="touch:hidden hidden w-full lg:flex lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <IconButton onClick={() => setIsOpen(!isOpen)}>
            <span className="sr-only">
              {themeContent?.collection?.filterAndSort}
            </span>
            <IconFilters className="size-4" />
          </IconButton>
          <AnimatePresence>
            {appliedFilters.length > 0 && (
              <m.div
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                initial={{opacity: 0}}
              >
                <Button
                  className={cn([
                    'flex items-center gap-1',
                    pending && 'pointer-events-none animate-pulse delay-500',
                  ])}
                  onClick={onClearAllFilters}
                  variant="ghost"
                >
                  <span>{themeContent?.collection?.clearFilters}</span>
                  <span className="tabular-nums">
                    ({appliedFilters.length})
                  </span>
                </Button>
              </m.div>
            )}
          </AnimatePresence>
        </div>
        <DesktopSort sectionSettings={sectionSettings} />
      </div>
      <div className="relative lg:flex lg:flex-row lg:flex-wrap">
        <div className="mt-6">
          <div
            className={cn([
              'touch:hidden hidden lg:block',
              'transition-all duration-200',
              isOpen
                ? 'sticky top-[calc(var(--desktopHeaderHeight)_+_1rem)] opacity-100 md:w-[240px] md:min-w-[240px] md:pr-8'
                : 'max-h-0 pr-0 opacity-0 md:max-h-full md:w-[0px] md:min-w-[0px]',
            ])}
          >
            <DesktopFiltersDrawer
              appliedFilters={appliedFilters}
              filters={filters}
            />
          </div>
        </div>
        <ClientOnly fallback={null}>
          {() => (
            <Suspense>
              <MobileDrawer
                appliedFilters={appliedFilters}
                filters={filters}
                onClearAllFilters={onClearAllFilters}
                productsCount={productsCount}
              />
            </Suspense>
          )}
        </ClientOnly>
        <div className="lg:flex-1">{children}</div>
      </div>
    </>
  );
}

export function DesktopFiltersDrawer({
  appliedFilters = [],
  filters = [],
}: Omit<Props, 'children' | 'onClearAllFilters' | 'productsCount'>) {
  return (
    <ScrollArea
      className={cn(
        'h-[calc(100svh_-_var(--desktopHeaderHeight)_-2rem)] w-full px-4 transition-all',
        'rounded-(--product-card-border-corner-radius)',
        'border border-[rgb(var(--border))]',
      )}
    >
      <nav>
        <Accordion
          // Open filters by default
          defaultValue={filters.map((filter) => filter.id)}
          type="multiple"
        >
          {filters.map((filter: Filter) => (
            <AccordionItem
              className="last:border-b-0"
              key={filter.id}
              value={filter.id}
            >
              <AccordionTrigger>{filter.label}</AccordionTrigger>
              <AccordionContent>
                <ul className="py-2" key={filter.id}>
                  {filter.values?.map((option) => {
                    return (
                      <li className="pb-4" key={option.id}>
                        <FilterMarkup
                          appliedFilters={appliedFilters}
                          filter={filter}
                          option={option}
                        />
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
    </ScrollArea>
  );
}
