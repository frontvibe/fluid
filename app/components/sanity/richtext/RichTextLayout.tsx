import {stegaClean} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';

import type {contentAlignmentValues} from '~/qroq/sections';

import {contentAlignment} from '~/components/cva/contentAlignment';

type AlignmentValues = (typeof contentAlignmentValues)[number];

export function RichtextLayout(props: {
  children: React.ReactNode;
  contentAligment?: AlignmentValues | null;
  desktopContentPosition?: AlignmentValues | null;
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
        '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-6 [&_blockquote]:italic',
        '[&_ul>li]:mt-2 [&_ul]:list-inside [&_ul]:list-disc',
        '[&_ol>li]:mt-2 [&_ol]:list-inside [&_ol]:list-decimal',
      ])}
      style={style}
    >
      {props.children}
    </div>
  );
}
