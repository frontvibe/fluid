import type {CartReturn, OptimisticCart} from '@shopify/hydrogen';
import type {CartLayouts} from '.';

import {cx} from 'class-variance-authority';

import {ScrollArea} from '../ui/scroll-area';
import {CartLineItem} from './cart-line-item';
import {AnimatePresence} from 'motion/react';

export function CartLines({
  layout = 'drawer',
  lines,
  onClose,
}: {
  layout: CartLayouts;
  lines?: OptimisticCart<CartReturn>['lines'];
  onClose?: () => void;
}) {
  const className = cx([
    layout === 'page' ? 'grow md:translate-y-4' : 'overflow-auto transition',
  ]);

  return (
    <Layout layout={layout}>
      <section aria-labelledby="cart-contents" className={className}>
        <ul className="grid">
          <AnimatePresence>
            {lines?.nodes.map((line) => (
              <li key={line.id}>
                <CartLineItem layout={layout} line={line} onClose={onClose} />
              </li>
            ))}
          </AnimatePresence>
        </ul>
      </section>
    </Layout>
  );
}

function Layout(props: {children: React.ReactNode; layout: CartLayouts}) {
  if (props.layout === 'drawer') {
    return (
      <ScrollArea className="size-full flex-1 pr-2">
        {props.children}
      </ScrollArea>
    );
  }

  return <>{props.children}</>;
}
