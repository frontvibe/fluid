import type {Cart as CartType} from '@shopify/hydrogen/storefront-api-types';

import {CartForm} from '@shopify/hydrogen';

import {useLocalePath} from '~/hooks/useLocalePath';
import {cn} from '~/lib/utils';

import {IconRemove} from '../icons/IconRemove';
import {Button} from '../ui/Button';
import {Input} from '../ui/Input';

/**
 * Temporary discount UI
 * @param discountCodes the current discount codes applied to the cart
 * @todo rework when a design is ready
 */
export function CartDiscounts({
  discountCodes,
  layout,
}: {
  discountCodes: CartType['discountCodes'];
  layout: 'drawer' | 'page';
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <>
      {/* Have existing discount, display it with a remove option */}
      <dl className={codes && codes.length !== 0 ? 'grid' : 'hidden'}>
        <div className="flex items-center justify-between font-medium">
          {/* Todo => add theme content string */}
          <span>Discount(s)</span>
          <div className="flex items-center justify-between">
            <UpdateDiscountForm>
              <button className="[&>*]:pointer-events-none">
                <IconRemove
                  aria-hidden="true"
                  style={{height: 18, marginRight: 4}}
                />
              </button>
            </UpdateDiscountForm>
            <span>{codes?.join(', ')}</span>
          </div>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div
          className={cn(
            'flex',
            layout === 'page' && 'flex-col lg:flex-row',
            'items-center justify-between gap-4',
          )}
        >
          {/* Todo => add theme content string */}
          <Input
            // data-vaul-no-drag={true}
            name="discountCode"
            placeholder="Discount code"
            type="text"
          />
          <Button
            className={cn(layout === 'page' && 'w-full lg:w-auto')}
            // data-vaul-no-drag={true}
            variant="outline"
          >
            {/* Todo => add theme content string */}
            Apply Discount
          </Button>
        </div>
      </UpdateDiscountForm>
    </>
  );
}

function UpdateDiscountForm({
  children,
  discountCodes,
}: {
  children: React.ReactNode;
  discountCodes?: string[];
}) {
  const cartPath = useLocalePath({path: '/cart'});

  return (
    <CartForm
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
      route={cartPath}
    >
      {children}
    </CartForm>
  );
}
