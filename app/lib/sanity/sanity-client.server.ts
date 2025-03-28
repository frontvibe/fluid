import {createClient} from '@sanity/client';

import type {CreateSanityLoaderOptions} from './sanity.server';

export const getSanityClient = ({
  config,
  preview,
}: {
  config: CreateSanityLoaderOptions['clientConfig'];
  preview: CreateSanityLoaderOptions['preview'];
}) => {
  const {apiVersion, dataset, projectId, useCdn, useStega} = config;

  let client = createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn,
  });

  if (client.config().apiVersion === '1') {
    console.warn(
      'No API version specified, defaulting to `v2022-03-07` which supports perspectives.\nYou can find the latest version in the Sanity changelog: https://www.sanity.io/changelog',
    );
    client = client.withConfig({apiVersion: 'v2022-03-07'});
  }

  if (preview?.enabled && useStega === 'true') {
    if (!preview.token) {
      throw new Error('Enabling preview mode requires a token.');
    }

    const previewClient = client.withConfig({
      useCdn: false,
      perspective: 'drafts' as const,
      stega: {
        ...client.config().stega,
        enabled: useStega === 'true' ? true : false,
        studioUrl: preview.studioUrl,
      },
      token: preview.token,
    });

    return {
      client: previewClient,
    };
  }

  return {
    client,
  };
};
