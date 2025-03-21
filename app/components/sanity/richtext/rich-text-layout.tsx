import type {ContentAlignment} from 'types/sanity/sanity.generated';

import {stegaClean} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';

import {contentAlignment} from '~/components/cva/content-alignment';

export function RichtextLayout(props: {
  children: React.ReactNode;
  contentAligment?: ContentAlignment | null;
  desktopContentPosition?: ContentAlignment | null;
  maxWidth?: null | number;
}) {
  const style = {
    '--maxWidth': props.maxWidth ? `${props.maxWidth}px` : 'auto',
  } as React.CSSProperties;

  const cleanContentAlignement = stegaClean(props.contentAligment);
  const cleanContentPosition = stegaClean(props.desktopContentPosition);

  return (
    <div
      className={cx([
        contentAlignment({
          required: cleanContentAlignement,
        }),
        cleanContentPosition === 'left' && 'mr-auto',
        cleanContentPosition === 'right' && 'ml-auto',
        cleanContentPosition === 'center' && 'mx-auto',
        'max-w-[var(--maxWidth)] space-y-2',
        '[&_blockquote]:border-border [&_blockquote]:border-l-2 [&_blockquote]:pl-6 [&_blockquote]:italic',
        '[&_ul]:list-inside [&_ul]:list-disc [&_ul>li]:mt-2',
        '[&_ol]:list-inside [&_ol]:list-decimal [&_ol>li]:mt-2',
      ])}
      style={style}
    >
      {props.children}
    </div>
  );
}
