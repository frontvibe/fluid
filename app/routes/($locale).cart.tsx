import type {CartQueryDataReturn} from '@shopify/hydrogen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

import {useLoaderData} from '@remix-run/react';
import {Analytics, CartForm} from '@shopify/hydrogen';
import {json, redirectDocument} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

import {Cart} from '~/components/cart/Cart';
import {isLocalPath} from '~/lib/utils';

export async function action({context, request}: ActionFunctionArgs) {
  const {cart} = context;

  const [formData] = await Promise.all([request.formData()]);

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  const status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
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
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  const headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    return redirectDocument(redirectTo, 303);
  }

  const {cart: cartResult, errors} = result;

  headers.append('Set-Cookie', await context.session.commit());

  return json(
    {
      cart: cartResult,
      errors,
    },
    {headers, status},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const cart = (await context.cart.get()) as CartApiQueryFragment;

  return json({cart});
}

export default function CartRoute() {
  const {cart} = useLoaderData<typeof loader>();

  return (
    <div className="cart flex-grow bg-background text-foreground">
      <Cart cart={cart} layout="page" />
      <Analytics.CartView />
    </div>
  );
}
