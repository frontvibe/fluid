import type {TypeFromSelection} from 'groqd';

import type {SectionDefaultProps} from '~/lib/type';
import type {IMAGE_BANNER_SECTION_FRAGMENT} from '~/qroq/sections';

import {
  Banner,
  BannerContent,
  BannerMedia,
  BannerMediaOverlay,
} from '../Banner';
import {SanityImage} from '../sanity/SanityImage';

type ImageBannerSectionProps = TypeFromSelection<
  typeof IMAGE_BANNER_SECTION_FRAGMENT
>;

export function ImageBannerSection(
  props: SectionDefaultProps & {data: ImageBannerSectionProps},
) {
  const {data} = props;
  const {contentAlignment, overlayOpacity, title} = data;

  if (!title) return null;

  // Todo: add encodeDataAttribute to SanityImage
  return (
    <Banner height={data.bannerHeight}>
      <BannerMedia>
        <SanityImage
          aspectRatio="16/9"
          data={data.backgroundImage}
          sizes="100vw"
        />
      </BannerMedia>
      <BannerMediaOverlay opacity={overlayOpacity} />
      <BannerContent contentAlignment={contentAlignment}>
        <h1>{title}</h1>
      </BannerContent>
    </Banner>
  );
}
