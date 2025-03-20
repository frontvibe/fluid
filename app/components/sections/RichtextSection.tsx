import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {SectionDefaultProps, SectionOfType} from 'types';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import {ButtonBlock} from '../sanity/richtext/components/ButtonBlock';
import {ExternalLinkAnnotation} from '../sanity/richtext/components/ExternalLinkAnnotation';
import {ImageBlock} from '../sanity/richtext/components/ImageBlock';
import {InternalLinkAnnotation} from '../sanity/richtext/components/InternalLinkAnnotation';
import {RichtextLayout} from '../sanity/richtext/RichTextLayout';

type RichtextSectionProps = SectionOfType<'richtextSection'>;

export function RichtextSection(
  props: SectionDefaultProps & {data: RichtextSectionProps},
) {
  const {data} = props;
  const containerMaxWidth = data.maxWidth;

  const components = useMemo(
    () => ({
      marks: {
        externalLink: (props: {
          children: React.ReactNode;
          value: ExternalLinkAnnotationProps;
        }) => {
          return (
            <ExternalLinkAnnotation {...props.value}>
              {props.children}
            </ExternalLinkAnnotation>
          );
        },
        internalLink: (props: {
          children: React.ReactNode;
          value: InternalLinkAnnotationProps;
        }) => {
          return (
            <InternalLinkAnnotation {...props.value}>
              {props.children}
            </InternalLinkAnnotation>
          );
        },
      },
      types: {
        button: (props: {value: ButtonBlockProps}) => (
          <ButtonBlock {...props.value} />
        ),
        image: (props: {value: ImageBlockProps}) => (
          <ImageBlock containerMaxWidth={containerMaxWidth} {...props.value} />
        ),
      },
    }),
    [containerMaxWidth],
  );

  return (
    <div className="container">
      <RichtextLayout
        contentAligment={props.data.contentAlignment}
        desktopContentPosition={props.data.desktopContentPosition}
        maxWidth={containerMaxWidth}
      >
        {data.richtext && (
          <PortableText
            components={components as PortableTextComponents}
            value={data.richtext as PortableTextBlock[]}
          />
        )}
      </RichtextLayout>
    </div>
  );
}
