import {Link} from '@remix-run/react';
import {cx} from 'class-variance-authority';

import {useLocalePath} from '~/hooks/useLocalePath';

import type {CartLayouts} from './Cart';

import {Button} from '../ui/Button';

export function CartEmpty({
  hidden = false,
  layout = 'drawer',
  onClose,
}: {
  hidden: boolean;
  layout?: CartLayouts;
  onClose?: () => void;
}) {
  const container = {
    drawer: cx([
      'p-5 content-start gap-4 pb-8 transition flex-1 overflow-y-scroll md:gap-12 md:pb-12',
    ]),
    page: cx([
      !hidden && 'grid',
      `container pb-12 w-full md:items-start gap-4 md:gap-8 lg:gap-12`,
    ]),
  };

  const collectionsPath = useLocalePath({path: '/collections'});

  // Todo => add theme content string
  const label = 'Continue shopping';

  return (
    <div className={container[layout]} hidden={hidden}>
      <section className="grid gap-6">
        <span>
          {/* Todo => add theme content string */}
          Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
          started!
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
      {/* <section className="grid gap-8 pt-16">
        <FeaturedProducts
          count={4}
          heading="Shop Best Sellers"
          layout={layout}
          onClose={onClose}
          sortKey="BEST_SELLING"
        />
      </section> */}
    </div>
  );
}
