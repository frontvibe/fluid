import type {EncodeDataAttributeCallback} from '@sanity/react-loader';
import type {FooterDataType, SectionDataType} from 'types';

import {createContext, useContext, useMemo} from 'react';

import {
  useCardColorsCssVars,
  useColorsCssVars,
} from '~/hooks/use-colors-css-vars';
import {useIsDev} from '~/hooks/use-is-dev';
import {sections} from '~/lib/section-resolver';

type CmsSectionType = 'footer' | 'section';

type CmsSectionProps = FooterDataType | SectionDataType;

export function CmsSection(props: {
  data: CmsSectionProps;
  encodeDataAttribute?: EncodeDataAttributeCallback;
  index?: number;
  type?: CmsSectionType;
}) {
  const {data, encodeDataAttribute} = props;
  const {_type, settings} = data;
  const isDev = useIsDev();
  const type = _type;
  const Section = useMemo(() => sections[type], [type]);

  if (settings?.hide) return null;

  return Section ? (
    <SectionWrapper
      data={data}
      encodeDataAttribute={encodeDataAttribute}
      index={props.index}
      type={props.type}
    >
      <Section data={data} encodeDataAttribute={encodeDataAttribute} />
    </SectionWrapper>
  ) : isDev ? (
    <MissingSection type={type} />
  ) : null;
}

function SectionWrapper(props: {
  children: React.ReactNode;
  data: CmsSectionProps;
  encodeDataAttribute?: EncodeDataAttributeCallback;
  index?: number;
  type?: CmsSectionType;
}) {
  const {children, data} = props;
  const {_key, _type, settings} = data;
  const isDev = useIsDev();
  const colorsCssVars = useColorsCssVars({
    selector: props.type === 'footer' ? 'footer' : `#section-${_key}`,
    settings,
  });
  const cardColorsCssVars = useCardColorsCssVars({
    selector: `#section-${_key} [data-type="card"]`,
    settings,
  });
  const sectionSelector = `#section-${_key}`;
  const customCss = settings?.customCss?.code
    ? `${sectionSelector} ${settings.customCss.code}`
    : '';
  const sectionType = _type;

  return props.type === 'footer' ? (
    <footer
      className="section-padding bg-background text-foreground relative [content-visibility:auto]"
      data-footer-type={isDev ? sectionType : null}
    >
      <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
      {children}
      {data.settings?.customCss && (
        <style dangerouslySetInnerHTML={{__html: customCss}} />
      )}
    </footer>
  ) : (
    <SectionContext.Provider
      value={{
        encodeDataAttribute: props.encodeDataAttribute,
        id: _key,
        index: props.index,
      }}
    >
      <section
        className="section-padding bg-background text-foreground relative [content-visibility:auto]"
        data-section-type={isDev ? sectionType : null}
        id={`section-${_key}`}
      >
        <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
        <style dangerouslySetInnerHTML={{__html: cardColorsCssVars}} />
        {children}
        {settings?.customCss && (
          <style dangerouslySetInnerHTML={{__html: customCss}} />
        )}
      </section>
    </SectionContext.Provider>
  );
}

export const SectionContext = createContext<null | {
  encodeDataAttribute?: EncodeDataAttributeCallback;
  id: null | string;
  index?: number;
}>(null);

export function useSection() {
  return useContext(SectionContext);
}

function MissingSection(props: {type?: string}) {
  return (
    <section className="w-full bg-slate-800 text-white">
      <div className="container py-10 text-center">
        <div className="rounded-md border-2 border-dashed border-gray-400 px-5 py-10">
          <div>
            The section component{' '}
            {props.type && (
              <strong className="px-2 text-xl">{props.type}</strong>
            )}{' '}
            does not exist yet.
          </div>
        </div>
      </div>
    </section>
  );
}
