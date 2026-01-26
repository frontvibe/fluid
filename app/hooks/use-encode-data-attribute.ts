import type {EncodeDataAttributeCallback} from '@sanity/react-loader';

import {createDataAttribute} from '@sanity/react-loader';
import {useMemo} from 'react';

import {useRootLoaderData} from '~/root';

/**
 * Creates an encodeDataAttribute callback for Sanity visual editing overlays.
 * Returns undefined when not in preview mode or when document info is missing.
 *
 * @param document - Object containing _id and _type from a Sanity document
 * @returns EncodeDataAttributeCallback or undefined
 */
export function useEncodeDataAttribute(document: {
  _id?: string | null;
  _type?: string | null;
}): EncodeDataAttributeCallback | undefined {
  const {env, sanityPreviewMode} = useRootLoaderData();

  return useMemo(() => {
    if (!document?._id || !document?._type || !sanityPreviewMode) {
      return undefined;
    }

    const dataAttribute = createDataAttribute({
      baseUrl: '/cms',
      id: document._id,
      type: document._type,
      projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_STUDIO_DATASET,
    });

    return dataAttribute as EncodeDataAttributeCallback;
  }, [document?._id, document?._type, env, sanityPreviewMode]);
}
