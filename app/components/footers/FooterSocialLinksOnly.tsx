import type {TypeFromSelection} from 'groqd';

import type {SectionDefaultProps} from '~/lib/type';
import type {FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT} from '~/qroq/footers';

import {CountrySelector} from '../layout/CountrySelector';

type FooterSocialLinksOnlyProps = TypeFromSelection<
  typeof FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT
>;

export function FooterSocialLinksOnly(
  props: SectionDefaultProps & {data: FooterSocialLinksOnlyProps},
) {
  const {data} = props;

  return (
    <div className="container">
      <div className="flex items-center justify-between">
        <p>{data.copyright}</p>
        <CountrySelector />
      </div>
    </div>
  );
}
