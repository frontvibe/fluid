import type {CartQueryData} from '@shopify/hydrogen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {useLoaderData} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {defer, json} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

import {Cart} from '~/components/cart/Cart';
import {isLocalPath} from '~/lib/utils';

export async function action({context, request}: ActionFunctionArgs) {
  const {cart, session} = context;

  const [formData, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('customerAccessToken'),
  ]);

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  let status = 200;
  let result: CartQueryData;

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
    // Todo => Add support for updating buyer identity
    // case CartForm.ACTIONS.BuyerIdentityUpdate:
    //   result = await cart.updateBuyerIdentity({
    //     ...inputs.buyerIdentity,
    //     customerAccessToken,
    //   });
    //   break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, errors} = result;
  return json(
    {
      analytics: {
        cartId,
      },
      cart: cartResult,
      errors,
    },
    {headers, status},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const cart = await context.cart.get();

  return defer({cart});
}

export default function CartRoute() {
  const {cart} = useLoaderData<typeof loader>();

  return <Cart cart={cart} layout="page" />;
}
