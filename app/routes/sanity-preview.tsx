import {validatePreviewUrl} from '@sanity/preview-url-secret';
import {redirectDocument} from '@shopify/remix-oxygen';

import type {Route} from './+types/sanity-preview';

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
  const {env, sanity, sanitySession} = context;

  if (!sanitySession) {
    throw new Response('Session not found', {status: 500});
  }

  const requestUrl = new URL(request.url);

  // Check if request has a secret parameter (from presentation tool)
  const hasSecret = requestUrl.searchParams.has('sanity-preview-secret');

  let redirectTo: string | undefined | null;

  if (hasSecret) {
    // Validate the preview URL secret
    const clientWithToken = sanity.client.withConfig({
      token: env.SANITY_STUDIO_TOKEN,
    });

    const validationResult = await validatePreviewUrl(
      clientWithToken,
      request.url,
    );

    if (!validationResult.isValid) {
      throw new Response('Invalid preview secret', {status: 401});
    }

    redirectTo = validationResult.redirectTo;
  } else {
    // Fallback: Check if request is from the same origin (embedded Studio)
    // This is less secure but allows the keyboard shortcut to work
    const referer = request.headers.get('referer');
    const origin = requestUrl.origin;

    if (!referer || !referer.startsWith(origin)) {
      throw new Response('Unauthorized: Missing preview secret', {status: 401});
    }

    // Use slug parameter for redirect (legacy behavior)
    redirectTo = requestUrl.searchParams.get('slug');
  }

  sanitySession.set('previewMode', true);

  const useStega = env.SANITY_STUDIO_USE_PREVIEW_MODE === 'true';
  const headers = {
    'Set-Cookie': useStega ? await sanitySession.commit() : '',
  };

  return redirectDocument(redirectTo ?? '/', {
    headers,
    status: 307,
  });
}
