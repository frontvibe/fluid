import {useSanityRoot} from '~/hooks/useSanityRoot';

import {CmsSection} from '../CmsSection';

export function Footer() {
  const {data, encodeDataAttribute} = useSanityRoot();
  const footerSections = data?.footer?.sections;
  const footer = data?.footer?.footer;

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
          key={footer._key}
          type="footer"
        />
      ) : null}
    </>
  );
}
