import type {
  Filter,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';

import {AnimatePresence, m} from 'framer-motion';
import {useState} from 'react';

import type {CmsSectionSettings} from '~/hooks/useColorsCssVars';

import {useOptimisticNavigationData} from '~/hooks/useOptimisticNavigationData';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';

import {IconFilters} from '../icons/IconFilters';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/Accordion';
import {Button, IconButton, iconButtonClass} from '../ui/Button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '../ui/Drawer';
import {ScrollArea} from '../ui/ScrollArea';
import {DefaultFilter, PriceRangeFilter} from './Filter';
import {DesktopSort, MobileSort} from './Sort';

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
      <div className="hidden w-full touch:hidden lg:flex lg:items-center lg:justify-between">
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
              'hidden touch:hidden lg:block',
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
        <MobileDrawer
          appliedFilters={appliedFilters}
          filters={filters}
          onClearAllFilters={onClearAllFilters}
          productsCount={productsCount}
        />
        <div className="lg:flex-1">{children}</div>
      </div>
    </>
  );
}

function MobileDrawer({
  appliedFilters,
  filters,
  onClearAllFilters,
  productsCount,
}: {
  appliedFilters: AppliedFilter[];
  filters: Filter[];
  onClearAllFilters: () => void;
  productsCount: number;
}) {
  const [open, setOpen] = useState(false);
  const {themeContent} = useSanityThemeContent();
  const heading = themeContent?.collection?.filterAndSort;
  const {pending} = useOptimisticNavigationData<boolean>('clear-all-filters');

  return (
    <div className="touch:block lg:hidden">
      <Drawer onOpenChange={setOpen} open={open}>
        <DrawerTrigger className={cn(iconButtonClass, 'w-auto gap-2 px-2')}>
          <IconFilters />
          <span>{heading}</span>
        </DrawerTrigger>
        <DrawerContent
          className={cn([
            'h-[--dialog-content-height] max-h-screen w-screen bg-background p-0 text-foreground',
            '[--dialog-content-height:calc(100svh_*_.95)] [--dialog-content-max-width:calc(32rem)]',
            'lg:left-auto lg:right-0 lg:max-w-[--dialog-content-max-width] lg:[--dialog-content-height:100svh]',
          ])}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerHeader className="flex items-center justify-center border-b text-xl font-medium">
            {heading}
            <span>({productsCount})</span>
          </DrawerHeader>
          <div className="size-full overflow-hidden">
            <ScrollArea className="size-full px-6">
              <div className="pt-6">
                <MobileSort />
              </div>
              <div className="pr-1">
                {filters.map((filter: Filter) => (
                  <div className="my-8 border-t pt-8" key={filter.id}>
                    <div className="text-xl font-medium">{filter.label}</div>
                    <ul className="mt-3" key={filter.id}>
                      {filter.values?.map((option) => {
                        return (
                          <li className="[&_label]:py-3" key={option.id}>
                            {filterMarkup(filter, option, appliedFilters)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <AnimatePresence>
            {appliedFilters.length > 0 && (
              <div>
                <m.div
                  animate={{
                    height: 'auto',
                  }}
                  className="overflow-hidden"
                  exit={{
                    height: 0,
                  }}
                  initial={{
                    height: 0,
                  }}
                >
                  <DrawerFooter className="grid grid-flow-col grid-cols-2 items-center justify-center gap-5 border-t py-6">
                    <Button
                      className={cn([
                        'flex items-center gap-1',
                        pending &&
                          'pointer-events-none animate-pulse delay-500',
                      ])}
                      onClick={onClearAllFilters}
                      variant="ghost"
                    >
                      <span>{themeContent?.collection?.clear}</span>
                      <span className="tabular-nums">
                        ({appliedFilters.length})
                      </span>
                    </Button>
                    <Button onClick={() => setOpen(false)}>
                      {themeContent?.collection?.apply}
                    </Button>
                  </DrawerFooter>
                </m.div>
              </div>
            )}
          </AnimatePresence>
        </DrawerContent>
      </Drawer>
    </div>
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
        'rounded-[--product-card-border-corner-radius]',
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
                        {filterMarkup(filter, option, appliedFilters)}
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

const filterMarkup = (
  filter: Filter,
  option: Filter['values'][0],
  appliedFilters: AppliedFilter[],
) => {
  switch (filter.type) {
    case 'PRICE_RANGE':
      return <PriceRangeFilter appliedFilters={appliedFilters} />;

    default:
      return <DefaultFilter appliedFilters={appliedFilters} option={option} />;
  }
};
