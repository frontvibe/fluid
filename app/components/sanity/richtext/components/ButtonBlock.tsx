import type {TypeFromSelection} from 'groqd';

import type {BUTTON_BLOCK_FRAGMENT} from '~/qroq/blocks';

import {Button} from '~/components/ui/Button';

import {SanityInternalLink} from '../../link/SanityInternalLink';

export type ButtonBlockProps = TypeFromSelection<typeof BUTTON_BLOCK_FRAGMENT>;

export function ButtonBlock(props: ButtonBlockProps) {
  return (
    <Button asChild>
      <SanityInternalLink
        data={{
          _key: props._key,
          _type: 'internalLink',
          anchor: props.anchor,
          link: props.link,
          name: null,
        }}
      >
        {props.label}
      </SanityInternalLink>
    </Button>
  );
}
