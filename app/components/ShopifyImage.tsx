import type {HydrogenImageProps} from '@shopify/hydrogen-react/Image';
import type {ImageFragmentFragment} from 'storefrontapi.generated';

import {Image} from '@shopify/hydrogen';

import {cn} from '~/lib/utils';

/**
 * `ShopifyImage` is a wrapper around the `Image` component from `@shopify/hydrogen`.
 * It displays a Shopify image with a blur effect preview while the image is loading.
 */
export function ShopifyImage({
  className,
  data,
  ...props
}: {
  className?: string;
  data: ImageFragmentFragment;
} & HydrogenImageProps) {
  // Todo => Global image border-radius setting should apply to the wrapper <span/>
  return (
    <span className="relative block overflow-hidden">
      <Image
        className={cn(['relative z-[1]', className])}
        data={data}
        {...props}
      />
      <Image
        className={cn(['absolute inset-0 overflow-hidden blur-xl', className])}
        data={{
          ...data,
          url: data.thumbnail,
        }}
        {...props}
      />
    </span>
  );
}
