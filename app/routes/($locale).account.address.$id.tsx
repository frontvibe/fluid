import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import type {ActionFunction} from '@shopify/remix-oxygen';

import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useOutletContext,
  useParams,
} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import {json, redirect} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

import {Button} from '~/components/ui/Button';
import {Checkbox} from '~/components/ui/Checkbox';
import {Input} from '~/components/ui/Input';
import {
  CREATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/mutations';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';

import type {AccountOutletContext} from './($locale).account.edit';

import {doLogout} from './($locale).account_.logout';

interface ActionData {
  formError?: string;
}

export const handle = {
  renderInModal: true,
};

export const action: ActionFunction = async ({context, params, request}) => {
  const {customerAccount} = context;
  const formData = await request.formData();

  // Double-check current user is logged in.
  // Will throw a logout redirect if not.
  if (!(await customerAccount.isLoggedIn())) {
    throw await doLogout(context);
  }

  const addressId = formData.get('addressId');
  invariant(typeof addressId === 'string', 'NoAddressId');

  if (request.method === 'DELETE') {
    try {
      const {data, errors} = await customerAccount.mutate(
        DELETE_ADDRESS_MUTATION,
        {variables: {addressId}},
      );

      invariant(!errors?.length, errors?.[0]?.message);

      invariant(
        !data?.customerAddressDelete?.userErrors?.length,
        data?.customerAddressDelete?.userErrors?.[0]?.message,
      );

      return redirect(
        params?.locale ? `${params?.locale}/account` : '/account',
        {
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    } catch (error: any) {
      return json(
        {formError: error.message},
        {
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
          status: 400,
        },
      );
    }
  }

  const address: CustomerAddressInput = {};

  const keys: (keyof CustomerAddressInput)[] = [
    'lastName',
    'firstName',
    'address1',
    'address2',
    'city',
    'zoneCode',
    'territoryCode',
    'zip',
    'phoneNumber',
    'company',
  ];

  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === 'string') {
      address[key] = value;
    }
  }

  const defaultAddress = formData.has('defaultAddress')
    ? String(formData.get('defaultAddress')) === 'on'
    : false;

  if (addressId === 'add') {
    try {
      const {data, errors} = await customerAccount.mutate(
        CREATE_ADDRESS_MUTATION,
        {variables: {address, defaultAddress}},
      );

      invariant(!errors?.length, errors?.[0]?.message);

      invariant(
        !data?.customerAddressCreate?.userErrors?.length,
        data?.customerAddressCreate?.userErrors?.[0]?.message,
      );

      invariant(
        data?.customerAddressCreate?.customerAddress?.id,
        'AddressCreation',
      );

      return redirect(
        params?.locale ? `${params?.locale}/account` : '/account',
        {
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    } catch (error: any) {
      return json(
        {formError: error.message},
        {
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
          status: 400,
        },
      );
    }
  } else {
    try {
      const {data, errors} = await customerAccount.mutate(
        UPDATE_ADDRESS_MUTATION,
        {
          variables: {
            address,
            addressId,
            defaultAddress,
          },
        },
      );

      invariant(!errors?.length, errors?.[0]?.message);

      invariant(
        !data?.customerAddressUpdate?.userErrors?.length,
        data?.customerAddressUpdate?.userErrors?.[0]?.message,
      );

      return redirect(
        params?.locale ? `${params?.locale}/account` : '/account',
        {
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    } catch (error: any) {
      return json(
        {formError: error.message},
        {
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
          status: 400,
        },
      );
    }
  }
};

export default function EditAddress() {
  const {id: addressId} = useParams();
  const isNewAddress = addressId === 'add';
  const actionData = useActionData<ActionData>();
  const {state} = useNavigation();
  const {customer} = useOutletContext<AccountOutletContext>();
  const addresses = flattenConnection(customer.addresses);
  const defaultAddress = customer.defaultAddress;
  const {themeContent} = useSanityThemeContent();
  /**
   * When a refresh happens (or a user visits this link directly), the URL
   * is actually stale because it contains a special token. This means the data
   * loaded by the parent and passed to the outlet contains a newer, fresher token,
   * and we don't find a match. We update the `find` logic to just perform a match
   * on the first (permanent) part of the ID.
   */
  const normalizedAddress = decodeURIComponent(addressId ?? '').split('?')[0];
  const address = addresses.find((address) =>
    address.id!.startsWith(normalizedAddress),
  );

  const formErrorString = actionData?.formError
    ? actionData.formError === 'NoAddressId'
      ? themeContent?.error?.missingAddressId
      : actionData.formError === 'AddressCreation'
        ? themeContent?.error?.addressCreation
        : actionData.formError
    : null;

  const firstName = themeContent?.account.firstName ?? 'First name';
  const lastName = themeContent?.account.lastName ?? 'Last name';
  const company = themeContent?.account.company ?? 'Company';
  const addressLine1 = themeContent?.account.addressLine1 ?? 'Address line 1';
  const addressLine2 = themeContent?.account.addressLine2 ?? 'Address line 2';
  const city = themeContent?.account.city ?? 'City';
  const stateProvince =
    themeContent?.account.stateProvince ?? 'State / Province';
  const country = themeContent?.account.country ?? 'Country';
  const postalCode = themeContent?.account.postalCode ?? 'Postal code';
  const phoneNumber = themeContent?.account.phoneNumber ?? 'Phone number';

  return (
    <>
      <h3>
        {isNewAddress
          ? themeContent?.account.addAddress
          : themeContent?.account.editAddress}
      </h3>
      <div className="max-w-lg">
        <Form method="post">
          <input
            name="addressId"
            type="hidden"
            value={address?.id ?? addressId}
          />
          {actionData?.formError && (
            <div className="mb-6 flex items-center justify-center rounded bg-red-100">
              <p className="m-4 text-sm text-red-900">{formErrorString}</p>
            </div>
          )}
          <div className="mt-3">
            <Input
              aria-label={firstName}
              autoComplete="given-name"
              defaultValue={address?.firstName ?? ''}
              id="firstName"
              name="firstName"
              placeholder={firstName}
              required
              type="text"
            />
          </div>
          <div className="mt-3">
            <Input
              aria-label={lastName}
              autoComplete="family-name"
              defaultValue={address?.lastName ?? ''}
              id="lastName"
              name="lastName"
              placeholder={lastName}
              required
              type="text"
            />
          </div>
          <div className="mt-3">
            <Input
              aria-label={company}
              autoComplete="organization"
              defaultValue={address?.company ?? ''}
              id="company"
              name="company"
              placeholder={company}
              type="text"
            />
          </div>
          <div className="mt-3">
            <Input
              aria-label={addressLine1}
              autoComplete="address-line1"
              defaultValue={address?.address1 ?? ''}
              id="address1"
              name="address1"
              placeholder={`${addressLine1}*`}
              required
              type="text"
            />
          </div>
          <div className="mt-3">
            <Input
              aria-label={addressLine2}
              autoComplete="address-line2"
              defaultValue={address?.address2 ?? ''}
              id="address2"
              name="address2"
              placeholder={addressLine2}
              type="text"
            />
          </div>
          <div className="mt-3">
            <Input
              aria-label={city}
              autoComplete="address-level2"
              defaultValue={address?.city ?? ''}
              id="city"
              name="city"
              placeholder={city}
              required
              type="text"
            />
          </div>
          <div className="mt-3">
            <Input
              aria-label={stateProvince}
              autoComplete="address-level1"
              defaultValue={address?.zoneCode ?? ''}
              id="zoneCode"
              name="zoneCode"
              placeholder={stateProvince}
              required
              type="text"
            />
          </div>
          <div className="mt-3">
            <Input
              aria-label={postalCode}
              autoComplete="postal-code"
              defaultValue={address?.zip ?? ''}
              id="zip"
              name="zip"
              placeholder={postalCode}
              required
              type="text"
            />
          </div>
          <div className="mt-3">
            <Input
              aria-label={country}
              autoComplete="country"
              defaultValue={address?.territoryCode ?? ''}
              id="territoryCode"
              name="territoryCode"
              placeholder={country}
              required
              type="text"
            />
          </div>
          <div className="mt-3">
            <Input
              aria-label={phoneNumber}
              autoComplete="tel"
              defaultValue={address?.phoneNumber ?? ''}
              id="phone"
              name="phoneNumber"
              placeholder={phoneNumber}
              type="tel"
            />
          </div>
          <div className="mt-4 flex items-center">
            <Checkbox
              defaultChecked={defaultAddress?.id === address?.id}
              id="defaultAddress"
              name="defaultAddress"
            />
            <label
              className="ml-2 inline-block cursor-pointer text-sm"
              htmlFor="defaultAddress"
            >
              {themeContent?.account.defaultAddress}
            </label>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <Button disabled={state !== 'idle'} type="submit">
              {state !== 'idle'
                ? themeContent?.account.saving
                : themeContent?.account.save}
            </Button>
            <Button asChild variant="secondary">
              <Link to="..">{themeContent?.account.cancel}</Link>
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
