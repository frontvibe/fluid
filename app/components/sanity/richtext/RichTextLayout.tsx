import {vercelStegaCleanAll} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';

import type {simpleContentAlignmentValues} from '~/qroq/sections';

import {
  contentPosition,
  textAlignment,
} from '~/components/cva/contentAlignment';

type AlignmentValues = (typeof simpleContentAlignmentValues)[number];

export function RichtextLayout(props: {
  children: React.ReactNode;
  contentAligment?: AlignmentValues | null;
  desktopContentPosition?: AlignmentValues | null;
  maxWidth?: null | number;
}) {
  const style = {
    '--maxWidth': props.maxWidth ? `${props.maxWidth}px` : 'auto',
  } as React.CSSProperties;

  const cleanContentAlignement = vercelStegaCleanAll(props.contentAligment);
  const cleanContentPosition = vercelStegaCleanAll(
    props.desktopContentPosition,
  );

  return (
    <div
      className={cx([
        textAlignment({
          required: cleanContentAlignement,
        }),
        contentPosition({
          required: cleanContentPosition,
        }),
        'max-w-[var(--maxWidth)] space-y-2 overflow-hidden',
        '[&_blockquote]:border-l-2 [&_blockquote]:pl-6 [&_blockquote]:italic',
        '[&_ul>li]:mt-2 [&_ul]:list-inside [&_ul]:list-disc',
        '[&_ol>li]:mt-2 [&_ol]:list-inside [&_ol]:list-decimal',
      ])}
      style={style}
    >
      {props.children}
    </div>
  );
}
