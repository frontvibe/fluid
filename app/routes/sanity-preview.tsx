import {redirectDocument} from '@shopify/remix-oxygen';

import type {Route} from './+types/sanity-preview';

import {notFound} from '~/lib/utils';

const ROOT_PATH = '/' as const;

export async function action({context, request}: Route.ActionArgs) {
  const {sanitySession} = context;

  if (!(request.method === 'POST' && sanitySession)) {
    return {message: 'Method not allowed'};
  }

  const body = await request.formData();
  const slug = (body.get('slug') as string) ?? ROOT_PATH;
  const redirectTo = slug;

  return redirectDocument(redirectTo, {
    headers: {
      'Set-Cookie': await sanitySession.destroy(),
    },
  });
}

export async function loader({context, request}: Route.LoaderArgs) {
  const {env, sanitySession} = context;
  const useStega = env.SANITY_STUDIO_USE_PREVIEW_MODE === 'true';

  if (!sanitySession) {
    notFound();
  }

  const {searchParams} = new URL(request.url);
  const slug = searchParams.get('slug') ?? ROOT_PATH;
  const redirectTo = slug;

  sanitySession.set('previewMode', true);

  const headers = {
    'Set-Cookie': useStega ? await sanitySession.commit() : '',
  };

  return redirectDocument(redirectTo, {
    headers,
    status: 307,
  });
}
