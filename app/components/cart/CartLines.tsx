import type {
  CartApiQueryFragment,
  CartLineFragment,
} from 'storefrontapi.generated';

import {flattenConnection, useOptimisticData} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import type {CartLayouts} from './Cart';

import {ScrollArea} from '../ui/ScrollArea';
import {CartLineItem} from './CartLineItem';

export function CartLines({
  layout = 'drawer',
  lines: cartLines,
  onClose,
}: {
  layout: CartLayouts;
  lines?: CartApiQueryFragment['lines'];
  onClose?: () => void;
}) {
  let currentLines = cartLines?.nodes.length
    ? flattenConnection(cartLines)
    : [];

  const optimisticData = useOptimisticData<{
    action?: string;
    line?: CartLineFragment;
  }>('cart-line-item');

  if (optimisticData?.action === 'add' && optimisticData.line) {
    const index = currentLines.findIndex(
      (line) => line?.merchandise.id === optimisticData.line?.id,
    );

    if (index === -1) {
      // If the line doesn't exist, add it to the beginning of the array
      currentLines = [optimisticData.line, ...currentLines];
    }
  }

  const className = cx([
    layout === 'page'
      ? 'flex-grow md:translate-y-4'
      : 'overflow-auto transition',
  ]);

  return (
    <Layout layout={layout}>
      <section aria-labelledby="cart-contents" className={className}>
        <ul className="grid">
          {currentLines.map((line) => (
            <li key={line.id}>
              <CartLineItem layout={layout} line={line} onClose={onClose} />
            </li>
          ))}
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
