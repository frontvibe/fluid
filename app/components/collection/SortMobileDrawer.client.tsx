import type {Filter} from '@shopify/hydrogen/storefront-api-types';

import {AnimatePresence, m} from 'framer-motion';
import {useState} from 'react';

import {useOptimisticNavigationData} from '~/hooks/useOptimisticNavigationData';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';

import type {AppliedFilter} from './SortFilterLayout';

import {IconFilters} from '../icons/IconFilters';
import {Button, iconButtonClass} from '../ui/Button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '../ui/Drawer';
import {ScrollArea} from '../ui/ScrollArea';
import {FilterMarkup} from './FilterMarkup';
import {MobileSort} from './Sort';

export function MobileDrawer({
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
                            <FilterMarkup
                              appliedFilters={appliedFilters}
                              filter={filter}
                              option={option}
                            />
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
