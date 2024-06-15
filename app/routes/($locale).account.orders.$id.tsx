import type {FulfillmentStatus} from '@shopify/hydrogen/customer-account-api-types';
import type {OrderFragment} from 'customer-accountapi.generated';

import {Link, type MetaFunction, useLoaderData} from '@remix-run/react';
import {Image, Money, flattenConnection} from '@shopify/hydrogen';
import {type LoaderFunctionArgs, json, redirect} from '@shopify/remix-oxygen';

import {Badge} from '~/components/ui/Badge';
import {Button} from '~/components/ui/Button';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/queries';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {statusMessage} from '~/lib/utils';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {customerAccount, locale, session} = context;
  if (!params.id) {
    return redirect(
      locale.default ? '/account' : `${locale.pathPrefix}/account`,
    );
  }

  const queryParams = new URL(request.url).searchParams;
  const orderToken = queryParams.get('key');

  try {
    const orderId = orderToken
      ? `gid://shopify/Order/${params.id}?key=${orderToken}`
      : `gid://shopify/Order/${params.id}`;

    const {data, errors} = await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {orderId},
    });

    if (errors?.length || !data?.order || !data?.order?.lineItems) {
      throw new Error('order information');
    }

    const order: OrderFragment = data.order;
    const lineItems = flattenConnection(order.lineItems);
    const discountApplications = flattenConnection(order.discountApplications);
    const firstDiscount = discountApplications[0]?.value;
    const discountValue =
      firstDiscount?.__typename === 'MoneyV2' && firstDiscount;
    const discountPercentage =
      firstDiscount?.__typename === 'PricingPercentageValue' &&
      firstDiscount?.percentage;
    const fulfillments = flattenConnection(order.fulfillments);
    const fulfillmentStatus =
      fulfillments.length > 0
        ? fulfillments[0].status
        : ('OPEN' as FulfillmentStatus);

    return json(
      {
        discountPercentage,
        discountValue,
        fulfillmentStatus,
        lineItems,
        order,
      },
      {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    );
  } catch (error) {
    throw new Response(error instanceof Error ? error.message : undefined, {
      headers: {
        'Set-Cookie': await session.commit(),
      },
      status: 404,
    });
  }
}

export default function OrderRoute() {
  const {
    discountPercentage,
    discountValue,
    fulfillmentStatus,
    lineItems,
    order,
  } = useLoaderData<typeof loader>();
  const {themeContent} = useSanityThemeContent();
  return (
    <div className="container py-20">
      <div>
        <h1>{themeContent?.account.orderDetail}</h1>
        <Button asChild className="mt-4 px-0" variant="link">
          <Link to="/account">{themeContent?.account.returnToAccount}</Link>
        </Button>
      </div>
      <div className="mt-6 w-full sm:grid-cols-1">
        <div>
          <h3>
            {themeContent?.account.orderNumber} {order.name}
          </h3>
          <p>
            {themeContent?.account.placedOn}{' '}
            {new Date(order.processedAt!).toDateString()}
          </p>
          <div className="grid items-start gap-12 sm:grid-cols-1 sm:divide-y sm:divide-gray-200 md:grid-cols-4 md:gap-16">
            <table className="my-8 min-w-full divide-y divide-gray-300 md:col-span-3">
              <thead>
                <tr className="align-baseline">
                  <th
                    className="pb-4 pl-0 pr-3 text-left font-semibold"
                    scope="col"
                  >
                    {themeContent?.account.product}
                  </th>
                  <th
                    className="hidden px-4 pb-4 text-right font-semibold sm:table-cell md:table-cell"
                    scope="col"
                  >
                    {themeContent?.account.price}
                  </th>
                  <th
                    className="hidden px-4 pb-4 text-right font-semibold sm:table-cell md:table-cell"
                    scope="col"
                  >
                    {themeContent?.account.quantity}
                  </th>
                  <th
                    className="px-4 pb-4 text-right font-semibold"
                    scope="col"
                  >
                    {themeContent?.account.total}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lineItems.map((lineItem) => (
                  <tr key={lineItem.id}>
                    <td className="w-full max-w-0 py-4 pl-0 pr-3 align-top sm:w-auto sm:max-w-none sm:align-middle">
                      <div className="flex gap-6">
                        {lineItem?.image && (
                          <div className="card-image aspect-square w-24">
                            <Image
                              data={lineItem.image}
                              height={96}
                              width={96}
                            />
                          </div>
                        )}
                        <div className="hidden flex-col justify-center lg:flex">
                          <p>{lineItem.title}</p>
                          <p className="mt-1">{lineItem.variantTitle}</p>
                        </div>
                        <dl className="grid">
                          <dt className="sr-only">
                            {themeContent?.account.product}
                          </dt>
                          <dd className="truncate lg:hidden">
                            <h3>{lineItem.title}</h3>
                            <p className="mt-1">{lineItem.variantTitle}</p>
                          </dd>
                          <dt className="sr-only">
                            {themeContent?.account.price}
                          </dt>
                          <dd className="truncate sm:hidden">
                            <p className="mt-4">
                              <Money data={lineItem.price!} />
                            </p>
                          </dd>
                          <dt className="sr-only">
                            {themeContent?.account.quantity}
                          </dt>
                          <dd className="truncate sm:hidden">
                            <p className="mt-1">{lineItem.quantity}</p>
                          </dd>
                        </dl>
                      </div>
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:table-cell sm:align-middle">
                      <Money data={lineItem.price!} />
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:table-cell sm:align-middle">
                      {lineItem.quantity}
                    </td>
                    <td className="px-3 py-4 text-right align-top sm:table-cell sm:align-middle">
                      <Money data={lineItem.totalDiscount!} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {((discountValue && discountValue.amount) ||
                  discountPercentage) && (
                  <tr>
                    <th
                      className="hidden pl-6 pr-3 pt-6 text-right font-normal sm:table-cell md:pl-0"
                      colSpan={3}
                      scope="row"
                    >
                      {themeContent?.account.discounts}
                    </th>
                    <th
                      className="pr-3 pt-6 text-left font-normal sm:hidden"
                      scope="row"
                    >
                      {themeContent?.account.discounts}
                    </th>
                    <td className="pl-3 pr-4 pt-6 text-right font-medium text-green-700 md:pr-3">
                      {discountPercentage ? (
                        <span className="text-sm">
                          {themeContent?.account.discountsOff?.replace(
                            '{discount}',
                            `${discountPercentage}`,
                          )}
                        </span>
                      ) : (
                        discountValue && <Money data={discountValue!} />
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <th
                    className="hidden pl-6 pr-3 pt-6 text-right font-normal sm:table-cell md:pl-0"
                    colSpan={3}
                    scope="row"
                  >
                    {themeContent?.account.subtotal}
                  </th>
                  <th
                    className="pr-3 pt-6 text-left font-normal sm:hidden"
                    scope="row"
                  >
                    {themeContent?.account.subtotal}
                  </th>
                  <td className="pl-3 pr-4 pt-6 text-right md:pr-3">
                    <Money data={order.subtotal!} />
                  </td>
                </tr>
                <tr>
                  <th
                    className="hidden pl-6 pr-3 pt-4 text-right font-normal sm:table-cell md:pl-0"
                    colSpan={3}
                    scope="row"
                  >
                    {themeContent?.account.tax}
                  </th>
                  <th
                    className="pr-3 pt-4 text-left font-normal sm:hidden"
                    scope="row"
                  >
                    {themeContent?.account.tax}
                  </th>
                  <td className="pl-3 pr-4 pt-4 text-right md:pr-3">
                    <Money data={order.totalTax!} />
                  </td>
                </tr>
                <tr>
                  <th
                    className="hidden pl-6 pr-3 pt-4 text-right font-semibold sm:table-cell md:pl-0"
                    colSpan={3}
                    scope="row"
                  >
                    {themeContent?.account.total}
                  </th>
                  <th
                    className="pr-3 pt-4 text-left font-semibold sm:hidden"
                    scope="row"
                  >
                    {themeContent?.account.total}
                  </th>
                  <td className="pl-3 pr-4 pt-4 text-right font-semibold md:pr-3">
                    <Money data={order.totalPrice!} />
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="top-nav sticky border-none md:my-8">
              <h3>{themeContent?.account.shippingAddress}</h3>
              {order?.shippingAddress ? (
                <ul className="mt-6">
                  <li>{order.shippingAddress.name}</li>
                  {order?.shippingAddress?.formatted ? (
                    order.shippingAddress.formatted.map((line: string) => (
                      <li key={line}>{line}</li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
              ) : (
                <p className="mt-3">
                  {themeContent?.account.noShippingAddress}
                </p>
              )}
              <h3 className="mt-8 font-semibold">Status</h3>
              {fulfillmentStatus && (
                <Badge
                  variant={fulfillmentStatus !== 'SUCCESS' ? 'outline' : null}
                >
                  {statusMessage(fulfillmentStatus!, themeContent)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
