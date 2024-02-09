import {useLoaderData} from '@remix-run/react';
import {MediaFile, flattenConnection} from '@shopify/hydrogen';

import type {loader} from '~/routes/($locale).products.$productHandle';

export function MediaGallery() {
  const {product} = useLoaderData<typeof loader>();
  const medias = product?.media?.nodes.length
    ? flattenConnection(product.media)
    : [];

  return (
    <ul className="grid">
      {medias.map((media) => {
        // Todo => Add section settings to choose the aspect ratio (16/9, 1/1, are the original aspect ratio)
        // Todo => Add useOriginalAspectRatio hook
        return (
          <li key={media.id}>
            <MediaFile
              className="h-auto w-full rounded"
              data={media}
              mediaOptions={{
                image: {
                  loading: 'eager',
                  sizes: '(min-width: 1024px) 50vw, 100vw',
                },
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
