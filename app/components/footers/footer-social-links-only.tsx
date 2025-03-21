import type {FooterOfType, SectionDefaultProps} from 'types';

import {useColorsCssVars} from '~/hooks/use-colors-css-vars';

import {CountrySelector} from '../layout/country-selector';
import {SocialMediaButtons} from '../social-media';

type FooterSocialLinksOnlyProps = FooterOfType<'socialLinksOnly'>;

export function FooterSocialLinksOnly(
  props: SectionDefaultProps & {data: FooterSocialLinksOnlyProps},
) {
  const {data} = props;
  const colorsCssVars = useColorsCssVars({
    selector: '#country-selector',
    settings: data.settings,
  });

  return (
    <div className="container flex flex-col items-center justify-center gap-5">
      <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
      <div className="flex flex-wrap items-center justify-center gap-1">
        <SocialMediaButtons />
      </div>
      <CountrySelector />
      <p className="mt-4">{data.copyright}</p>
    </div>
  );
}
