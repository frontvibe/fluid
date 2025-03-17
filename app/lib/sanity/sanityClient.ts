import {createClient} from '@sanity/client';

// Do not import this into client-side components unless lazy-loaded
export const getSanityClient = (args: {
  apiVersion: string;
  dataset: string;
  projectId: string;
  studioUrl: string;
  token: string;
  useCdn: boolean;
  useStega: string;
}) => {
  const {apiVersion, dataset, projectId, studioUrl, token, useCdn, useStega} =
    args;

  const client = createClient({
    apiVersion: apiVersion || '2023-10-01',
    dataset,
    projectId,
    useCdn,
  });

  const previewClient = client.withConfig({
    perspective: 'previewDrafts' as const,
    stega: {
      ...client.config().stega,
      enabled: useStega === 'true' ? true : false,
      studioUrl,
    },
    token,
  });

  if (useStega === 'true') {
    return {
      client: previewClient,
    };
  }

  return {
    client,
  };
};
