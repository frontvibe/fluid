import {useRootLoaderData} from '~/root';

import {CmsSection} from '../cms-section';

export function Footer() {
  const {sanityRoot} = useRootLoaderData();
  const data = sanityRoot?.data;
  const footerSections = data?.footer?.sections;
  const footer = data?.footer?.footer;

  return (
    <>
      {/* Sections */}
      {footerSections && footerSections.length > 0
        ? footerSections.map((section, index) => (
            <CmsSection data={section} index={index} key={section._key} />
          ))
        : null}
      {/* Footer Section */}
      {footer ? <CmsSection data={footer} type="footer" /> : null}
    </>
  );
}
