import type {
  CustomerDetailsFragment,
  OrderCardFragment,
} from 'customer-accountapi.generated';

import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useMatches,
  useNavigate,
  useOutlet,
} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import {type LoaderFunctionArgs, defer} from '@shopify/remix-oxygen';

import {AccountAddressBook} from '~/components/account/AccountAddressBook';
import {AccountDetails} from '~/components/account/AccountDetails';
import {OrderCard} from '~/components/account/OrderCard';
import {Button} from '~/components/ui/Button';
import {Dialog, DialogContent} from '~/components/ui/Dialog';
import {CACHE_NONE, routeHeaders} from '~/data/cache';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/queries';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';

import {doLogout} from './($locale).account_.logout';

export const headers = routeHeaders;

export async function loader({context}: LoaderFunctionArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY);

  /**
   * If the customer failed to load, we assume their access token is invalid.
   */
  if (errors?.length || !data?.customer) {
    throw await doLogout(context);
  }

  const customer = data?.customer;

  return defer(
    {
      customer,
    },
    {
      headers: {
        'Cache-Control': CACHE_NONE,
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export default function Authenticated() {
  const data = useLoaderData<typeof loader>();
  const outlet = useOutlet();
  const matches = useMatches();

  // routes that export handle { renderInModal: true }
  const renderOutletInModal = matches.some((match) => {
    const handle = match?.handle as {renderInModal?: boolean};
    return handle?.renderInModal;
  });

  if (outlet) {
    if (renderOutletInModal) {
      return <AccountDialog />;
    } else {
      return <Outlet context={{customer: data.customer}} />;
    }
  }

  return <Account {...data} />;
}

function AccountDialog() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleOpenChange = () => {
    navigate('/account', {
      preventScrollReset: true,
    });
  };

  return (
    <>
      <Dialog defaultOpen={true} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-scroll">
          <Outlet context={{customer: data.customer}} />
        </DialogContent>
      </Dialog>
      <Account {...data} />
    </>
  );
}

interface AccountType {
  customer: CustomerDetailsFragment;
}

function Account({customer}: AccountType) {
  const orders = flattenConnection(customer.orders);
  const addresses = flattenConnection(customer.addresses);
  const path = useLocalePath({path: '/account/logout'});
  const {themeContent} = useSanityThemeContent();

  const heading = customer
    ? customer.firstName
      ? themeContent?.account.welcome?.replace(
          '{firstName}',
          customer.firstName,
        )
      : themeContent?.account.welcomeToYourAccount
    : themeContent?.account.accountDetails;

  return (
    <div className="container py-20">
      <h1>{heading}</h1>
      <Form action={path} className="mt-4" method="post">
        <Button className="px-0" type="submit" variant="link">
          {themeContent?.account.signOut}
        </Button>
      </Form>
      {orders && <AccountOrderHistory orders={orders} />}
      <AccountDetails customer={customer} />
      <AccountAddressBook addresses={addresses} customer={customer} />
    </div>
  );
}

type OrderCardsProps = {
  orders: OrderCardFragment[];
};

function AccountOrderHistory({orders}: OrderCardsProps) {
  const {themeContent} = useSanityThemeContent();
  return (
    <div className="mt-6">
      <div className="grid w-full gap-4 py-6 md:gap-8">
        <h2 className="text-lead">{themeContent?.account.orderHistory}</h2>
        {orders?.length ? <Orders orders={orders} /> : <EmptyOrders />}
      </div>
    </div>
  );
}

function EmptyOrders() {
  const path = useLocalePath({path: '/'});
  const {themeContent} = useSanityThemeContent();
  return (
    <div>
      <p>{themeContent?.account.noOrdersMessage}</p>
      <div className="w-48">
        <Button asChild className="mt-2 w-full text-sm" variant="secondary">
          <Link to={path}>{themeContent?.account.startShopping}</Link>
        </Button>
      </div>
    </div>
  );
}

function Orders({orders}: OrderCardsProps) {
  return (
    <ul className="false grid grid-flow-row grid-cols-1 gap-2 gap-y-6 sm:grid-cols-3 md:gap-4 lg:gap-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </ul>
  );
}
