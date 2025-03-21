import type {SingleWorkspace} from 'sanity';

import {codeInput} from '@sanity/code-input';
import {languageFilter} from '@sanity/language-filter';
import {visionTool} from '@sanity/vision';
import {getAllLanguages} from 'countries';
import {defineConfig, isDev} from 'sanity';
import {internationalizedArray} from 'sanity-plugin-internationalized-array';
import {media, mediaAssetSource} from 'sanity-plugin-media';
import {presentationTool} from 'sanity/presentation';
import {structureTool} from 'sanity/structure';

import IconPreview from './components/icons/preview-icon';
import {
  SANITY_API_VERSION,
  SANITY_STUDIO_PREVIEW_URL,
  SANITY_STUDIO_URL,
} from './constants';
import {customDocumentActions} from './plugins/custom-document-actions';
import {locations} from './presentation/locations';
import {schemaTypes} from './schema';
import {defaultDocumentNode, structure} from './structure';
import {singletonActions, singletonsTypes} from './structure/singletons';

/**
 * Configuration options that will be passed in
 * from the environment or application
 */
type SanityConfig = Pick<SingleWorkspace, 'dataset' | 'projectId'>;

/**
 * Prevent a consumer from importing into a worker/server bundle.
 */
if (typeof document === 'undefined') {
  throw new Error(
    'Sanity Studio can only run in the browser. Please check that this file is not being imported into a worker or server bundle.',
  );
}

const languages = getAllLanguages();

export function defineSanityConfig(
  config: SanityConfig & {shopifyStoreDomain: string},
) {
  const {dataset} = config;
  const devOnlyPlugins = [
    visionTool({
      defaultApiVersion: SANITY_API_VERSION,
      defaultDataset: dataset,
    }),
  ];

  return defineConfig({
    name: 'default',
    title: 'Fluid',
    basePath: SANITY_STUDIO_URL,
    ...config,
    plugins: [
      codeInput(),
      structureTool({structure, defaultDocumentNode}),
      customDocumentActions({shopifyStoreDomain: config.shopifyStoreDomain}),
      media(),
      presentationTool({
        previewUrl: {previewMode: {enable: SANITY_STUDIO_PREVIEW_URL}},
        resolve: {
          locations,
        },
        icon: IconPreview,
        title: 'Preview',
      }),
      internationalizedArray({
        languages,
        defaultLanguages: [languages[0].id],
        fieldTypes: [
          'string',
          'text',
          'slug',
          'headerNavigation',
          'announcementBar',
          'productRichtext',
          'richtext',
          'bannerRichtext',
        ],
        buttonLocations: ['field'],
      }),
      languageFilter({
        supportedLanguages: languages,
        defaultLanguages: [languages[0].id],
        documentTypes: [
          'page',
          'home',
          'themeContent',
          'header',
          'footer',
          'product',
          'collection',
        ],
      }),
      ...(isDev ? devOnlyPlugins : []),
    ],
    schema: {
      types: schemaTypes,
      // Filter out singleton types from the global “New document” menu options
      templates: (templates) =>
        templates.filter(({schemaType}) => !singletonsTypes.has(schemaType)),
    },
    document: {
      // For singleton types, filter out actions that are not explicitly included
      // in the `singletonActions` list defined above
      actions: (input, context) =>
        singletonsTypes.has(context.schemaType)
          ? input.filter(({action}) => action && singletonActions.has(action))
          : input,
    },
    form: {
      file: {
        assetSources: (previousAssetSources) => {
          return previousAssetSources.filter(
            (assetSource) => assetSource !== mediaAssetSource,
          );
        },
      },
      image: {
        assetSources: (previousAssetSources) => {
          return previousAssetSources.filter(
            (assetSource) => assetSource === mediaAssetSource,
          );
        },
      },
    },
  });
}
