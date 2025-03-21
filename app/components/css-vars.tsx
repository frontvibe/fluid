import {useRootLoaderData} from '~/root';

import {
  useCardColorsCssVars,
  useColorsCssVars,
} from '../hooks/use-colors-css-vars';
import {useSettingsCssVars} from '../hooks/use-settings-css-vars';

export function CssVars() {
  const settingsCssVars = useSettingsCssVars();
  const colorsCssVars = useColorsCssVars({});
  const {sanityRoot} = useRootLoaderData();
  const data = sanityRoot?.data;

  const cartColorsCssVars = useColorsCssVars({
    selector: '.cart',
    settings: {
      colorScheme: data?.settings?.cartColorScheme,
    },
  });
  const cardsColorsCssVars = useCardColorsCssVars({
    selector: `[data-type="card"]`,
  });
  const cartCardsColorsCssVars = useCardColorsCssVars({
    selector: `.cart [data-type="card"]`,
    settings: {
      colorScheme: data?.settings?.cartColorScheme,
    },
  });
  const saleBadgeColorsCssVars = useColorsCssVars({
    selector: `[data-type="sale-badge"]`,
    settings: {
      colorScheme: data?.settings?.badgesSaleColorScheme,
    },
  });
  const soldOutBadgeColorsCssVars = useColorsCssVars({
    selector: `[data-type="sold-out-badge"]`,
    settings: {
      colorScheme: data?.settings?.badgesSoldOutColorScheme,
    },
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
      <style dangerouslySetInnerHTML={{__html: settingsCssVars}} />
      <style dangerouslySetInnerHTML={{__html: cardsColorsCssVars}} />
      <style dangerouslySetInnerHTML={{__html: cartColorsCssVars}} />
      <style dangerouslySetInnerHTML={{__html: cartCardsColorsCssVars}} />
      <style dangerouslySetInnerHTML={{__html: saleBadgeColorsCssVars}} />
      <style dangerouslySetInnerHTML={{__html: soldOutBadgeColorsCssVars}} />
    </>
  );
}
