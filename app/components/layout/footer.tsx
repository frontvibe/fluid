import {useEncodeDataAttribute} from '~/hooks/use-encode-data-attribute';
import {useRootLoaderData} from '~/root';

import {CmsSection} from '../cms-section';

export function Footer() {
  const {sanityRoot} = useRootLoaderData();
  const data = sanityRoot?.data;
  const footerData = data?.footer;
  const footerSections = footerData?.sections;
  const footer = footerData?.footer;
  const encodeDataAttribute = useEncodeDataAttribute(footerData ?? {});

  return (
    <>
      {/* Sections */}
      {footerSections && footerSections.length > 0
        ? footerSections.map((section, index) => (
            <CmsSection
              data={section}
              encodeDataAttribute={encodeDataAttribute}
              index={index}
              key={section._key}
            />
          ))
        : null}
      {/* Footer Section */}
      {footer ? (
        <CmsSection
          data={footer}
          encodeDataAttribute={encodeDataAttribute}
          type="footer"
        />
      ) : null}
    </>
  );
}
