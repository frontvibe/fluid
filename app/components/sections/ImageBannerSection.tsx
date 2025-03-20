import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {SectionDefaultProps, SectionOfType} from 'types/sanity/types';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {ButtonBlockProps} from '../sanity/richtext/components/ButtonBlock';

import {
  Banner,
  BannerContent,
  BannerMedia,
  BannerMediaOverlay,
} from '../Banner';
import {useSection} from '../CmsSection';
import {ButtonBlock} from '../sanity/richtext/components/ButtonBlock';
import {SanityImage} from '../sanity/SanityImage';

type ImageBannerSectionProps = SectionOfType<'imageBannerSection'>;

export function ImageBannerSection(
  props: SectionDefaultProps & {data: ImageBannerSectionProps},
) {
  const {data} = props;
  const {contentAlignment, contentPosition, overlayOpacity} = data;
  const section = useSection();

  // Todo: add encodeDataAttribute to SanityImage
  return (
    <Banner height={data.bannerHeight}>
      <BannerMedia>
        <SanityImage
          aspectRatio="16/9"
          data={data.backgroundImage}
          decoding="sync"
          draggable={false}
          fetchpriority={section?.index === 0 ? 'high' : 'auto'}
          loading={section?.index === 0 ? 'eager' : 'lazy'}
          showBorder={false}
          showShadow={false}
          sizes="100vw"
        />
      </BannerMedia>
      <BannerMediaOverlay opacity={overlayOpacity} />
      <BannerContent
        contentAlignment={contentAlignment}
        contentPosition={contentPosition}
      >
        <BannerRichtext value={data.content as PortableTextBlock[]} />
      </BannerContent>
    </Banner>
  );
}

function BannerRichtext(props: {value?: null | PortableTextBlock[]}) {
  const components = useMemo(
    () => ({
      types: {
        button: (props: {value: ButtonBlockProps}) => (
          <ButtonBlock {...props.value} />
        ),
      },
    }),
    [],
  );

  if (!props.value) return null;

  return (
    <div className="flex flex-col gap-4 text-balance [&_a]:w-fit [&_a:not(:last-child)]:mr-4">
      <PortableText
        components={components as PortableTextComponents}
        value={props.value}
      />
    </div>
  );
}
