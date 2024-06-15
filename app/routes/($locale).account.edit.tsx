import type {
  Customer,
  CustomerUpdateInput,
} from '@shopify/hydrogen/customer-account-api-types';

import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useOutletContext,
} from '@remix-run/react';
import {type ActionFunction, json, redirect} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

import {Button} from '~/components/ui/Button';
import {Input} from '~/components/ui/Input';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/mutations';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';

import {doLogout} from './($locale).account_.logout';

export interface AccountOutletContext {
  customer: Customer;
}

export interface ActionData {
  fieldErrors?: {
    currentPassword?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    newPassword?: string;
    newPassword2?: string;
    phone?: string;
  };
  formError?: string;
  success?: boolean;
}

const formDataHas = (formData: FormData, key: string) => {
  if (!formData.has(key)) return false;

  const value = formData.get(key);
  return typeof value === 'string' && value.length > 0;
};

export const handle = {
  renderInModal: true,
};

export const action: ActionFunction = async ({context, params, request}) => {
  const formData = await request.formData();

  // Double-check current user is logged in.
  // Will throw a logout redirect if not.
  if (!(await context.customerAccount.isLoggedIn())) {
    throw await doLogout(context);
  }

  try {
    const customer: CustomerUpdateInput = {};

    formDataHas(formData, 'firstName') &&
      (customer.firstName = formData.get('firstName') as string);
    formDataHas(formData, 'lastName') &&
      (customer.lastName = formData.get('lastName') as string);

    const {data, errors} = await context.customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
        },
      },
    );

    invariant(!errors?.length, errors?.[0]?.message);

    invariant(
      !data?.customerUpdate?.userErrors?.length,
      data?.customerUpdate?.userErrors?.[0]?.message,
    );

    return redirect(params?.locale ? `${params.locale}/account` : '/account', {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    });
  } catch (error: any) {
    return json(
      {formError: error?.message},
      {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
        status: 400,
      },
    );
  }
};

/**
 * Since this component is nested in `accounts/`, it is rendered in a modal via `<Outlet>` in `account.tsx`.
 *
 * This allows us to:
 * - preserve URL state (`/accounts/edit` when the modal is open)
 * - co-locate the edit action with the edit form (rather than grouped in account.tsx)
 * - use the `useOutletContext` hook to access the customer data from the parent route (no additional data loading)
 * - return a simple `redirect()` from this action to close the modal :mindblown: (no useState/useEffect)
 * - use the presence of outlet data (in `account.tsx`) to open/close the modal (no useState)
 */
export default function AccountDetailsEdit() {
  const actionData = useActionData<ActionData>();
  const {customer} = useOutletContext<AccountOutletContext>();
  const {state} = useNavigation();
  const {themeContent} = useSanityThemeContent();
  const firstName = themeContent?.account.firstName ?? 'First name';
  const lastName = themeContent?.account.lastName ?? 'Last name';

  return (
    <div className="container">
      <h3>{themeContent?.account.updateYourProfile}</h3>
      <Form method="post">
        {actionData?.formError && (
          <div className="mb-6 flex items-center justify-center rounded bg-red-100">
            <p className="m-4 text-sm text-red-900">{actionData.formError}</p>
          </div>
        )}
        <div className="mt-3">
          <Input
            aria-label={firstName}
            autoComplete="given-name"
            defaultValue={customer.firstName ?? ''}
            id="firstName"
            name="firstName"
            placeholder={firstName}
            type="text"
          />
        </div>
        <div className="mt-3">
          <Input
            aria-label={lastName}
            autoComplete="family-name"
            defaultValue={customer.lastName ?? ''}
            id="lastName"
            name="lastName"
            placeholder={lastName}
            type="text"
          />
        </div>
        <div className="mt-6 flex items-center gap-3">
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
  );
}
