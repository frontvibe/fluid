import {Link} from '@remix-run/react';
import {cx} from 'class-variance-authority';
import {AnimatePresence, m} from 'framer-motion';

import {useLocalePath} from '~/hooks/useLocalePath';
import {cn} from '~/lib/utils';

import type {CartLayouts} from './Cart';

import {Button} from '../ui/Button';

export function CartEmpty({
  layout = 'drawer',
  onClose,
  show,
}: {
  layout?: CartLayouts;
  onClose?: () => void;
  show: boolean;
}) {
  const container = {
    drawer: cx([
      'p-5 content-start gap-4 pb-8 flex-1 flex justify-center items-center md:gap-12 md:pb-12',
    ]),
    page: cx([
      `container pb-12 w-full md:items-start gap-4 md:gap-8 lg:gap-12`,
    ]),
  };

  const collectionsPath = useLocalePath({path: '/collections'});

  // Todo => add theme content string
  const label = 'Continue shopping';

  return (
    <AnimatePresence>
      {show && (
        <m.div
          animate={{
            opacity: 1,
          }}
          className={container[layout]}
          exit={{
            opacity: 0,
          }}
          initial={{
            opacity: 0,
          }}
        >
          <section
            className={cn([
              'grid gap-6',
              layout === 'drawer' && 'justify-center text-center',
            ])}
          >
            <span>
              {/* Todo => add theme content string */}
              Looks like you haven&rsquo;t added anything yet, let&rsquo;s get
              you started!
            </span>
            <div>
              {layout === 'page' ? (
                <Link prefetch="intent" to={collectionsPath}>
                  {label}
                </Link>
              ) : (
                <Button onClick={onClose}>{label}</Button>
              )}
            </div>
          </section>
          {/* Todo => add FeaturedProducts */}
          {/* 
            <section className="grid gap-8 pt-16">
              <FeaturedProducts
                count={4}
                heading="Shop Best Sellers"
                layout={layout}
                onClose={onClose}
                sortKey="BEST_SELLING"
              />
            </section>
          */}
        </m.div>
      )}
    </AnimatePresence>
  );
}
