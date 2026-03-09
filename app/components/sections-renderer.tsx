import type {EncodeDataAttributeCallback} from '@sanity/react-loader';
import type {SanityDocument} from '@sanity/client';
import type {SectionDataType} from 'types';

import {createDataAttribute, useOptimistic} from '@sanity/visual-editing/react';
import {useMemo} from 'react';

import {CmsSection} from './cms-section';
import {useRootLoaderData} from '~/root';
import {SANITY_STUDIO_PATH} from '~/sanity/constants';

type SectionsRendererProps = {
  documentId: string;
  documentType: string;
  encodeDataAttribute?: EncodeDataAttributeCallback;
  sections: SectionDataType[];
};

export function SectionsRenderer(props: SectionsRendererProps) {
  const {documentId, documentType, encodeDataAttribute, sections} = props;
  const {env, sanityPreviewMode} = useRootLoaderData();

  const optimisticSections = useOptimistic<
    SectionDataType[],
    SanityDocument<{sections: SectionDataType[]}>
  >(sections, (currentSections, action) => {
    if (action.type === 'mutate' && action.id === documentId) {
      return action.document?.sections ?? currentSections;
    }
    return currentSections;
  });

  const baseDataAttribute = useMemo(
    () =>
      sanityPreviewMode
        ? createDataAttribute({
            baseUrl: SANITY_STUDIO_PATH,
            id: documentId,
            type: documentType,
            projectId: env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
            dataset: env.PUBLIC_SANITY_STUDIO_DATASET,
          })
        : undefined,
    [
      documentId,
      documentType,
      env.PUBLIC_SANITY_STUDIO_DATASET,
      env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
      sanityPreviewMode,
    ],
  );

  if (!optimisticSections || optimisticSections.length === 0) return null;

  return (
    <div
      className="contents"
      data-sanity={baseDataAttribute?.scope('sections').toString()}
    >
      {optimisticSections.map((section, index) => (
        <CmsSection
          data={section}
          dataSanity={baseDataAttribute
            ?.scope(`sections[_key=="${section._key}"]`)
            .toString()}
          encodeDataAttribute={encodeDataAttribute}
          index={index}
          key={section._key}
        />
      ))}
    </div>
  );
}
