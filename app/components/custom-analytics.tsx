import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

import {useIsDev} from '~/hooks/use-is-dev';

export function CustomAnalytics() {
  const {subscribe} = useAnalytics();
  const isDev = useIsDev();

  useEffect(() => {
    if (!isDev) return;

    // Standard events
    subscribe('page_viewed', (data) => {
      // eslint-disable-next-line no-console
      console.log('CustomAnalytics - Page viewed:', data);
    });
    subscribe('product_viewed', (data) => {
      // eslint-disable-next-line no-console
      console.log('CustomAnalytics - Product viewed:', data);
    });
    subscribe('collection_viewed', (data) => {
      // eslint-disable-next-line no-console
      console.log('CustomAnalytics - Collection viewed:', data);
    });
    subscribe('cart_viewed', (data) => {
      // eslint-disable-next-line no-console
      console.log('CustomAnalytics - Cart viewed:', data);
    });
    subscribe('cart_updated', (data) => {
      // eslint-disable-next-line no-console
      console.log('CustomAnalytics - Cart updated:', data);
    });
  }, [subscribe, isDev]);

  return null;
}
