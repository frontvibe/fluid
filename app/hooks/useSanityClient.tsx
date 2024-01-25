import {useMemo} from 'react';

import {getSanityClient} from '~/lib/sanity/client';

import {useEnvironmentVariables} from './useEnvironmentVariables';

export function useSanityClient() {
  const env = useEnvironmentVariables();
  const {client} = useMemo(
    () =>
      getSanityClient({
        apiVersion: env?.SANITY_STUDIO_API_VERSION!,
        dataset: env?.SANITY_STUDIO_DATASET!,
        projectId: env?.SANITY_STUDIO_PROJECT_ID!,
        studioUrl: env?.SANITY_STUDIO_URL!,
        useCdn: env?.NODE_ENV === 'production',
        useStega: env?.SANITY_STUDIO_USE_STEGA!,
      }),
    [env],
  );

  return client;
}
