import {
  useCardColorsCssVars,
  useColorsCssVars,
} from '../hooks/useColorsCssVars';
import {useSanityRoot} from '../hooks/useSanityRoot';
import {useSettingsCssVars} from '../hooks/useSettingsCssVars';

export function CssVars() {
  const settingsCssVars = useSettingsCssVars();
  const colorsCssVars = useColorsCssVars({});
  const {data} = useSanityRoot();
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

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
      <style dangerouslySetInnerHTML={{__html: settingsCssVars}} />
      <style dangerouslySetInnerHTML={{__html: cardsColorsCssVars}} />
      <style dangerouslySetInnerHTML={{__html: cartColorsCssVars}} />
      <style dangerouslySetInnerHTML={{__html: cartCardsColorsCssVars}} />
    </>
  );
}
