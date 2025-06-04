import {redirect} from '@shopify/remix-oxygen';

import type {Route} from './+types/($locale).account_.logout';

export async function doLogout(context: Route.ActionArgs['context']) {
  return context.customerAccount.logout();
}

export async function loader({params}: Route.LoaderArgs) {
  const locale = params.locale;
  return redirect(locale ? `/${locale}` : '/');
}

export const action = async ({context}: Route.ActionArgs) => {
  return doLogout(context);
};
