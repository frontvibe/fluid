import type {SeoConfig} from '@shopify/hydrogen';
import type {GetAnnotations} from 'react-router/internal';

import {getSeoMeta} from '@shopify/hydrogen';

type MatchData =
  | (Record<string, unknown> & {
      seo?: SeoConfig;
    })
  | undefined;

export function getSeoMetaFromMatches(
  matches: GetAnnotations<any>['MetaArgs']['matches'],
) {
  const seoData = [
    ...matches
      .filter((match) => typeof (match?.data as MatchData)?.seo !== 'undefined')
      .map((match) => (match?.data as MatchData)?.seo),
  ];
  return getSeoMeta(...seoData) || [];
}
