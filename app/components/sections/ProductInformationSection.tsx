import type {TypeFromSelection} from 'groqd';

import type {SectionDefaultProps} from '~/lib/type';
import type {PRODUCT_INFORMATION_SECTION_FRAGMENT} from '~/qroq/sections';

import {MediaGallery} from '../product/MediaGallery';
import {ProductDetails} from '../product/ProductDetails';

export type ProductInformationSectionProps = TypeFromSelection<
  typeof PRODUCT_INFORMATION_SECTION_FRAGMENT
>;

export function ProductInformationSection(
  props: SectionDefaultProps & {data: ProductInformationSectionProps},
) {
  const {data} = props;

  return (
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-2">
        <MediaGallery />
        <ProductDetails data={data} />
      </div>
    </div>
  );
}
