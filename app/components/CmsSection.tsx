import type {EncodeDataAttributeCallback} from '@sanity/react-loader';
import type {InferType} from 'groqd';

import {createContext, useContext, useMemo} from 'react';

import type {FOOTERS_FRAGMENT} from '~/qroq/footers';
import type {
  COLLECTION_SECTIONS_FRAGMENT,
  PRODUCT_SECTIONS_FRAGMENT,
  SECTIONS_FRAGMENT,
} from '~/qroq/sections';

import {useCardColorsCssVars, useColorsCssVars} from '~/hooks/useColorsCssVars';
import {useIsDev} from '~/hooks/useIsDev';
import {sections} from '~/lib/sectionRelsolver';

type CmsSectionsProps =
  | NonNullable<InferType<typeof COLLECTION_SECTIONS_FRAGMENT>>[0]
  | NonNullable<InferType<typeof FOOTERS_FRAGMENT>>
  | NonNullable<InferType<typeof PRODUCT_SECTIONS_FRAGMENT>>[0]
  | NonNullable<InferType<typeof SECTIONS_FRAGMENT>>[0];

type CmsSectionType = 'footer' | 'section';

export function CmsSection(props: {
  data: CmsSectionsProps;
  encodeDataAttribute?: EncodeDataAttributeCallback;
  index?: number;
  type?: CmsSectionType;
}) {
  const {data, encodeDataAttribute} = props;
  const isDev = useIsDev();
  const type = data._type;
  const Section = useMemo(() => sections[type], [type]);

  if (data.settings?.hide) return null;

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
  data: CmsSectionsProps;
  encodeDataAttribute?: EncodeDataAttributeCallback;
  index?: number;
  type?: CmsSectionType;
}) {
  const {children, data} = props;
  const isDev = useIsDev();
  const colorsCssVars = useColorsCssVars({
    selector: props.type === 'footer' ? 'footer' : `#section-${data._key}`,
    settings: data?.settings,
  });
  const cardColorsCssVars = useCardColorsCssVars({
    selector: `#section-${data._key} [data-type="card"]`,
    settings: props.data.settings,
  });
  const sectionSelector = `#section-${data._key}`;
  const customCss = data.settings?.customCss?.code
    ? `${sectionSelector} ${data.settings.customCss.code}`
    : '';
  const sectionType = data._type;

  return props.type === 'footer' ? (
    <footer
      className="section-padding relative bg-background text-foreground [content-visibility:auto]"
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
        id: data._key,
        index: props.index,
      }}
    >
      <section
        className="section-padding relative bg-background text-foreground [content-visibility:auto]"
        data-section-type={isDev ? sectionType : null}
        id={`section-${data._key}`}
      >
        <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
        <style dangerouslySetInnerHTML={{__html: cardColorsCssVars}} />
        {children}
        {data.settings?.customCss && (
          <style dangerouslySetInnerHTML={{__html: customCss}} />
        )}
      </section>
    </SectionContext.Provider>
  );
}

export const SectionContext = createContext<{
  encodeDataAttribute?: EncodeDataAttributeCallback;
  id: null | string;
  index?: number;
} | null>(null);

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
