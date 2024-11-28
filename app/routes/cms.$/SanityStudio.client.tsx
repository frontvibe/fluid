/**
 * To keep the worker bundle size small, only load
 * the Studio and its configuration in the client
 */
import type {SingleWorkspace, StudioProps} from 'sanity';

import {Studio} from 'sanity';

import {defineSanityConfig} from '~/sanity/config';

/**
 * Prevent a consumer from importing into a worker/server bundle.
 */
if (typeof document === 'undefined') {
  throw new Error(
    'Sanity Studio can only run in the browser. Please check that this file is not being imported into a worker or server bundle.',
  );
}

type SanityStudioProps = Omit<StudioProps, 'config'> &
  Pick<SingleWorkspace, 'basePath' | 'dataset' | 'projectId'>;

function SanityStudio(props: SanityStudioProps & {shopifyStoreDomain: string}) {
  const {dataset, projectId, shopifyStoreDomain, ...rest} = props;

  const config = defineSanityConfig({dataset, projectId, shopifyStoreDomain});

  return (
    <div data-ui="StudioLayout" id="sanity">
      <Studio {...rest} config={config} unstable_globalStyles />
    </div>
  );
}

export default SanityStudio;
