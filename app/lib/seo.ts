import type {SeoConfig} from '@shopify/hydrogen';
import type {MetaArgs} from '@shopify/remix-oxygen';

import {getSeoMeta} from '@shopify/hydrogen';

type MatchData =
  | ({
      seo?: SeoConfig;
    } & Record<string, unknown>)
  | undefined;

export function getSeoMetaFromMatches(matches: MetaArgs['matches']) {
  const seoData = [
    ...matches
      .filter((match) => typeof (match.data as MatchData)?.seo !== 'undefined')
      .map((match) => (match.data as MatchData)?.seo),
  ];
  return getSeoMeta(...seoData) || [];
}
