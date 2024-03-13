import type {ShopifyPageViewPayload} from '@shopify/hydrogen';

import {useLocation, useMatches} from '@remix-run/react';
import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  useShopifyCookies,
} from '@shopify/hydrogen';
import {DEFAULT_LOCALE} from 'countries';
import {useEffect, useMemo, useRef} from 'react';

export function useAnalytics(hasUserConsent: boolean) {
  useShopifyCookies({hasUserConsent});

  const location = useLocation();
  const lastLocationKey = useRef<string>('');
  const pageAnalytics = usePageAnalytics({hasUserConsent});

  // Page view analytics
  // We want useEffect to execute only when location changes
  // which represents a page view
  useEffect(() => {
    if (lastLocationKey.current === location.key) return;

    lastLocationKey.current = location.key;

    const payload: ShopifyPageViewPayload = {
      ...getClientBrowserParameters(),
      ...pageAnalytics,
    };

    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload,
    });
  }, [location, pageAnalytics]);
}

export function usePageAnalytics({hasUserConsent}: {hasUserConsent: boolean}) {
  const matches = useMatches();

  return useMemo(() => {
    const data: Record<string, unknown> = {};

    matches.forEach((event) => {
      const eventData = event?.data as Record<string, unknown>;
      if (eventData) {
        eventData['analytics'] && Object.assign(data, eventData['analytics']);

        const selectedLocale =
          (eventData['selectedLocale'] as typeof DEFAULT_LOCALE) ||
          DEFAULT_LOCALE;

        Object.assign(data, {
          acceptedLanguage: selectedLocale.language,
          currency: selectedLocale.currency,
        });
      }
    });

    return {
      ...data,
      hasUserConsent,
    } as unknown as ShopifyPageViewPayload;
  }, [matches, hasUserConsent]);
}
