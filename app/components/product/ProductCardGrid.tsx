import type {CSSProperties} from 'react';
import type {ProductCardFragment} from 'storefrontapi.generated';

import {cx} from 'class-variance-authority';

import {ProductCard} from './ProductCard';

export function ProductCardGrid(props: {
  columns?: {
    desktop?: null | number;
    mobile?: null | number;
  };
  products?: ProductCardFragment[];
  skeleton?: {
    cardsNumber?: number;
  };
}) {
  const {products, skeleton} = props;
  const columnsVar = {
    '--columns': props.columns?.desktop ?? 3,
    '--mobileColumns': props.columns?.mobile ?? 1,
  } as CSSProperties;

  return (
    <ul
      className={cx([
        'grid gap-x-[--grid-horizontal-space] gap-y-[--grid-vertical-space]',
        'grid-cols-[repeat(var(--mobileColumns),_minmax(0,_1fr))]',
        'sm:grid-cols-2',
        'lg:grid-cols-[repeat(var(--columns),_minmax(0,_1fr))]',
      ])}
      style={columnsVar}
    >
      {!skeleton && products && products.length > 0
        ? products.map((product) => (
            <li key={product.id}>
              <ProductCard
                columns={{
                  desktop: props.columns?.desktop,
                  mobile: props.columns?.mobile,
                }}
                product={product}
              />
            </li>
          ))
        : skeleton
          ? [...Array(skeleton.cardsNumber ?? 3)].map((_, i) => (
              <li key={i}>
                <ProductCard
                  columns={{
                    desktop: props.columns?.desktop,
                    mobile: props.columns?.mobile,
                  }}
                  skeleton={{
                    cardsNumber: skeleton.cardsNumber,
                  }}
                />
              </li>
            ))
          : null}
    </ul>
  );
}
