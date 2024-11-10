import {type LoaderFunctionArgs, redirect} from '@shopify/remix-oxygen';

// fallback wild card for all unauthenticated routes in account section
export async function loader({context}: LoaderFunctionArgs) {
  const {customerAccount, locale} = context;
  await customerAccount.handleAuthStatus();

  return redirect(locale.default ? '/account' : `${locale.pathPrefix}/account`);
}
