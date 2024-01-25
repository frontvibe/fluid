import {useRouteLoaderData} from '@remix-run/react';

import type {loader} from '~/root';

export function useRootLoaderData() {
  const data = useRouteLoaderData<typeof loader>('root');
  return data;
}
