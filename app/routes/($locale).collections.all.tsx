import {redirect} from '@shopify/remix-oxygen';

import type {Route} from './+types/($locale).collections.all';

export async function loader({params}: Route.LoaderArgs) {
  return redirect(params?.locale ? `${params.locale}/products` : '/products');
}
