import type {OrderCardFragment} from 'customer-accountapi.generated';

import {Link} from '@remix-run/react';
import {Image, flattenConnection} from '@shopify/hydrogen';

import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {statusMessage} from '~/lib/utils';

export function OrderCard({order}: {order: OrderCardFragment}) {
  const {themeContent} = useSanityThemeContent();

  if (!order?.id) return null;

  const [legacyOrderId, key] = order!.id!.split('/').pop()!.split('?');
  const lineItems = flattenConnection(order?.lineItems);
  const fulfillmentStatus = flattenConnection(order?.fulfillments)[0]?.status;
  const url = key
    ? `/account/orders/${legacyOrderId}?${key}`
    : `/account/orders/${legacyOrderId}`;

  return (
    <li className="grid rounded border text-center">
      <Link
        className="grid items-center gap-4 p-4 md:grid-cols-2 md:gap-6 md:p-6"
        prefetch="intent"
        to={url}
      >
        {lineItems[0].image && (
          <div className="card-image aspect-square bg-primary/5">
            <Image
              alt={lineItems[0].image?.altText ?? 'Order image'}
              className="fadeIn cover w-full"
              height={168}
              src={lineItems[0].image.url}
              width={168}
            />
          </div>
        )}
        <div
          className={`flex-col justify-center text-left ${
            !lineItems[0].image && 'md:col-span-2'
          }`}
        >
          <div className="text-xl font-semibold">
            {lineItems.length > 1
              ? `${lineItems[0].title} +${lineItems.length - 1} more`
              : lineItems[0].title}
          </div>
          <dl className="grid-gap-1 grid">
            <dt className="sr-only">{themeContent?.account.orderId}</dt>
            <dd>
              <p>
                {themeContent?.account.orderNumber} {order.number}
              </p>
            </dd>
            <dt className="sr-only">{themeContent?.account.orderDate}</dt>
            <dd>
              <p>{new Date(order.processedAt).toDateString()}</p>
            </dd>
            {fulfillmentStatus && (
              <>
                <dt className="sr-only">
                  {themeContent?.account.fulfillmentStatus}
                </dt>
                <dd className="mt-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      fulfillmentStatus === 'SUCCESS'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-primary/5 text-primary/50'
                    }`}
                  >
                    <p>{statusMessage(fulfillmentStatus, themeContent)}</p>
                  </span>
                </dd>
              </>
            )}
          </dl>
        </div>
      </Link>
      <div className="self-end border-t">
        <Link
          className="block w-full p-2 text-center"
          prefetch="intent"
          to={url}
        >
          <p>{themeContent?.account.viewDetails}</p>
        </Link>
      </div>
    </li>
  );
}
