import type {CartQueryDataReturn} from '@shopify/hydrogen';

import {Analytics, CartForm} from '@shopify/hydrogen';
import {redirectDocument, data as remixData} from '@shopify/remix-oxygen';

import type {Route} from './+types/($locale).cart';

import {Cart} from '~/components/cart';
import {isLocalPath} from '~/lib/utils';

export async function action({context, request}: Route.ActionArgs) {
  const {cart} = context;

  const [formData] = await Promise.all([request.formData()]);

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  const status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate:
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(cartId) : new Headers();

  const redirectTo = formData.get('redirectTo') ?? null;

  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    return redirectDocument(redirectTo, 303);
  }

  const {cart: cartResult, errors, warnings} = result;

  headers.append('Set-Cookie', await context.session.commit());

  return remixData(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {headers, status},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const cart = await context.cart.get();

  return {cart};
}

export default function CartRoute({loaderData}: Route.ComponentProps) {
  const {cart} = loaderData;

  return (
    <div className="cart grow bg-background text-foreground">
      <Cart cart={cart} layout="page" />
      <Analytics.CartView />
    </div>
  );
}
