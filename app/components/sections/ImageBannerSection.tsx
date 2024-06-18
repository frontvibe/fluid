import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {TypeFromSelection} from 'groqd';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {IMAGE_BANNER_SECTION_FRAGMENT} from '~/qroq/sections';

import type {ButtonBlockProps} from '../sanity/richtext/components/ButtonBlock';

import {
  Banner,
  BannerContent,
  BannerMedia,
  BannerMediaOverlay,
} from '../Banner';
import {useSection} from '../CmsSection';
import {SanityImage} from '../sanity/SanityImage';
import {ButtonBlock} from '../sanity/richtext/components/ButtonBlock';

type ImageBannerSectionProps = TypeFromSelection<
  typeof IMAGE_BANNER_SECTION_FRAGMENT
>;

export function ImageBannerSection(
  props: {data: ImageBannerSectionProps} & SectionDefaultProps,
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

function BannerRichtext(props: {value?: PortableTextBlock[] | null}) {
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
    <div className="space-y-4 text-balance [&_a:not(last-child)]:mr-4">
      <PortableText
        components={components as PortableTextComponents}
        value={props.value}
      />
    </div>
  );
}
