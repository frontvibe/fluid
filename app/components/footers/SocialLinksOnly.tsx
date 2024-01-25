import type {TypeFromSelection} from 'groqd';

import type {SectionDefaultProps} from '~/lib/type';
import type {FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT} from '~/qroq/footers';

type FooterSocialLinksOnlyProps = TypeFromSelection<
  typeof FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT
>;

export function SocialLinksOnly(
  props: SectionDefaultProps & {data: FooterSocialLinksOnlyProps},
) {
  const {data} = props;

  return (
    <div className="container">
      <div className="flex">
        <p>{data.copyright}</p>
      </div>
    </div>
  );
}
