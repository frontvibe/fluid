import type {TypeFromSelection} from 'groqd';

import {CaretDownIcon} from '@radix-ui/react-icons';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import type {INTERNAL_LINK_FRAGMENT} from '~/qroq/links';

import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {Button} from '../ui/Button';

export function NavigationTrigger(props: {
  children: React.ReactNode;
  link: TypeFromSelection<typeof INTERNAL_LINK_FRAGMENT>['link'];
}) {
  const {link} = props;
  const className = 'flex items-center gap-1';

  return (
    <NavigationMenu.Trigger asChild className="group">
      {link ? (
        <div className={className}>
          <SanityInternalLink
            data={{
              _key: null,
              _type: 'internalLink',
              anchor: null,
              link,
              name: null,
            }}
          >
            {props.children}
          </SanityInternalLink>
          <ChevronButton />
        </div>
      ) : (
        <button className={className}>
          {props.children}
          <ChevronButton />
        </button>
      )}
    </NavigationMenu.Trigger>
  );
}

function ChevronButton() {
  return (
    <Button size="primitive" variant="primitive">
      <CaretDownIcon
        aria-hidden
        className="transition-transform duration-100 ease-in group-data-[state=open]:-rotate-180"
      />
    </Button>
  );
}
