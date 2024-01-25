import type {TypeFromSelection} from 'groqd';

import type {SectionDefaultProps} from '~/lib/type';
import type {CTA_SECTION_FRAGMENT} from '~/qroq/sections';

type CtaSectionProps = TypeFromSelection<typeof CTA_SECTION_FRAGMENT>;

export function CtaSection(
  props: SectionDefaultProps & {data: CtaSectionProps},
) {
  const {data} = props;
  const {title} = data;

  return title ? (
    <div className="container flex justify-center">
      <h2>{title}</h2>
    </div>
  ) : null;
}
