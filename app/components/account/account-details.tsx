import type {CustomerDetailsFragment} from 'types/shopify/customeraccountapi.generated';

import {Link} from '@remix-run/react';

import {useSanityThemeContent} from '~/hooks/use-sanity-theme-content';

export function AccountDetails({
  customer,
}: {
  customer: CustomerDetailsFragment;
}) {
  const {emailAddress, firstName, lastName, phoneNumber} = customer;
  const {themeContent} = useSanityThemeContent();

  return (
    <div className="mt-10 grid w-full gap-4 md:gap-8">
      <h3>{themeContent?.account?.accountDetails}</h3>
      <div className="border-border/30 rounded-sm border p-6 lg:p-8">
        <div className="flex">
          <h4 className="flex-1">{themeContent?.account?.profile}</h4>
          <Link
            className="text-sm font-normal underline"
            prefetch="intent"
            preventScrollReset
            to="/account/edit"
          >
            {themeContent?.account?.edit}
          </Link>
        </div>
        <div className="text-primary/50 mt-4 text-sm">Name</div>
        <p className="mt-1">
          {firstName || lastName
            ? (firstName ? firstName + ' ' : '') + (lastName ?? '')
            : themeContent?.account?.addName}{' '}
        </p>

        <div className="text-primary/50 mt-4 text-sm">
          {themeContent?.account?.phoneNumber}
        </div>
        <p className="mt-1">{phoneNumber?.phoneNumber ?? 'N/A'}</p>

        <div className="text-primary/50 mt-4 text-sm">
          {themeContent?.account?.emailAddress}
        </div>
        <p className="mt-1">{emailAddress?.emailAddress ?? 'N/A'}</p>
      </div>
    </div>
  );
}
