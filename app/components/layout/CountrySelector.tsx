import {DropdownMenuTrigger} from '@radix-ui/react-dropdown-menu';
import {useLocation} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {getAllLocales} from 'countries';
import {useMemo} from 'react';

import type {I18nLocale} from '~/lib/type';

import {useLocale} from '~/hooks/useLocale';
import {useLocalePath} from '~/hooks/useLocalePath';

import {IconArrow} from '../icons/IconArrow';
import {IconCheck} from '../icons/IconCheck';
import {Button} from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/DropdownMenu';

export function CountrySelector() {
  const locales = getAllLocales();
  const currentLocale = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex max-w-fit gap-2" variant="outline">
          {currentLocale?.label}
          <IconArrow className="size-3" direction="down" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((locale) => (
          <DropdownMenuItem
            className="flex [&>*]:flex-grow"
            key={locale.country}
            onSelect={(e) => e.preventDefault()}
          >
            <ChangeLocaleForm locale={locale} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ChangeLocaleForm(props: {locale: I18nLocale}) {
  const currentLocale = useLocale();
  const location = useLocation();
  const isActive = currentLocale?.country === props.locale.country;

  const redirectTo = useMemo(() => {
    let newPathname = `${props.locale?.pathPrefix}${location.pathname}`;

    if (!currentLocale) return props.locale?.pathPrefix || '/';

    if (!currentLocale?.default) {
      newPathname = location.pathname.replace(
        currentLocale?.pathPrefix,
        props.locale?.pathPrefix || '',
      );
    }

    return newPathname || '/';
  }, [props.locale, currentLocale, location.pathname]);

  const cartPath = useLocalePath({path: '/cart'});

  return (
    <CartForm
      action={CartForm.ACTIONS.BuyerIdentityUpdate}
      inputs={{
        buyerIdentity: {countryCode: props.locale.country},
      }}
      route={cartPath}
    >
      {(fetcher) => (
        <>
          <input name="redirectTo" type="hidden" value={redirectTo} />
          <button
            className={cx([
              'flex w-full items-center gap-2 py-1',
              isActive && 'pointer-events-none font-bold',
              fetcher.state !== 'idle' && 'animate-pulse',
            ])}
            type="submit"
          >
            <span className={cx(isActive ? 'opacity-100' : 'opacity-0')}>
              <IconCheck className="size-3" />
            </span>
            {props.locale.label}
          </button>
        </>
      )}
    </CartForm>
  );
}
