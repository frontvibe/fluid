import type {EncodeDataAttributeCallback} from '@sanity/react-loader';
import type {InferType} from 'groqd';

import {Suspense, useMemo} from 'react';

import type {FOOTERS_FRAGMENT} from '~/qroq/footers';
import type {
  COLLECTION_SECTIONS_FRAGMENT,
  PRODUCT_SECTIONS_FRAGMENT,
  SECTIONS_FRAGMENT,
} from '~/qroq/sections';

import {useIsDev} from '~/hooks/useIsDev';
import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';
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
  type?: CmsSectionType;
}) {
  const {data, encodeDataAttribute} = props;
  const isDev = useIsDev();
  const type = data._type;
  const Section = useMemo(() => sections[type], [type]);

  return Section ? (
    <SectionWrapper data={data} type={props.type}>
      <Suspense
        fallback={
          // Todo: add skeleton component for each section type
          <div className="h-96" />
        }
      >
        <Section data={data} encodeDataAttribute={encodeDataAttribute} />
      </Suspense>
    </SectionWrapper>
  ) : isDev ? (
    <MissingSection type={type} />
  ) : null;
}

function SectionWrapper(props: {
  children: React.ReactNode;
  data: CmsSectionsProps;
  type?: CmsSectionType;
}) {
  const {children, data} = props;
  const isDev = useIsDev();
  const cssVars = useSettingsCssVars({
    settings: data?.settings,
  });
  const sectionSelector = `#section-${data._key}`;
  const customCss = data.settings?.customCss?.code
    ? `${sectionSelector} ${data.settings.customCss.code}`
    : '';
  const sectionType = data._type;

  return props.type === 'footer' ? (
    <footer
      className="color-scheme section-padding relative"
      data-footer-type={isDev ? sectionType : null}
      style={cssVars}
    >
      {children}
      {data.settings?.customCss && (
        <style dangerouslySetInnerHTML={{__html: customCss}} />
      )}
    </footer>
  ) : (
    <section
      className="color-scheme section-padding relative"
      data-section-type={isDev ? sectionType : null}
      id={`section-${data._key}`}
      style={cssVars}
    >
      {children}
      {data.settings?.customCss && (
        <style dangerouslySetInnerHTML={{__html: customCss}} />
      )}
    </section>
  );
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
