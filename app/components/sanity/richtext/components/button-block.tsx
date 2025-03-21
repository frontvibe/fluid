import type {SectionOfType} from 'types';

import {Button} from '~/components/ui/button';

import {SanityInternalLink} from '../../link/sanity-internal-link';

export type ButtonBlockProps = NonNullable<
  SectionOfType<'richtextSection'>['richtext']
>[number] & {
  _type: 'button';
};

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
