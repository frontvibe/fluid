import type {ROOT_QUERYResult} from 'types/sanity/sanity.generated';

import {Link} from '@remix-run/react';
import {cx} from 'class-variance-authority';
import Autoplay from 'embla-carousel-autoplay';
import {useMemo} from 'react';

import {useColorsCssVars} from '~/hooks/use-colors-css-vars';
import {useRootLoaderData} from '~/root';

import {IconArrowRight} from '../icons/icon-arrow-right';
import {SanityInternalLink} from '../sanity/link/sanity-internal-link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

type AnnouncementBarProps = NonNullable<
  NonNullable<ROOT_QUERYResult['header']>['announcementBar']
>[number];

export function AnnouncementBar() {
  const {sanityRoot} = useRootLoaderData();
  const data = sanityRoot?.data;
  const header = data?.header;
  const announcementBar = header?.announcementBar;
  const plugins = useMemo(
    () =>
      header?.autoRotateAnnouncements
        ? [Autoplay({delay: 5000, stopOnMouseEnter: true})]
        : [],
    [header],
  );

  const colorsCssVars = useColorsCssVars({
    selector: `#announcement-bar`,
    settings: {
      colorScheme: header?.announcementBarColorScheme ?? null,
      customCss: null,
      hide: null,
      padding: null,
    },
  });

  const isActive = (announcementBar?.length ?? 0) > 1;

  if (!announcementBar) return null;

  return (
    <section className="bg-background text-foreground" id="announcement-bar">
      <div className="container">
        <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
        <Carousel opts={{active: isActive, align: 'center'}} plugins={plugins}>
          <CarouselContent className="relative ml-0 justify-center">
            {announcementBar?.map((item) => (
              <CarouselItem key={item._key}>
                <Item
                  _key={item._key}
                  externalLink={item.externalLink}
                  link={item.link}
                  openInNewTab={item.openInNewTab}
                  text={item.text}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {isActive && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}

function Item(props: AnnouncementBarProps) {
  if (!props.text) return null;

  const className = cx('flex w-full justify-center py-3 text-center');

  return props.link ? (
    <SanityInternalLink
      className={cx(['group', className])}
      data={{
        _key: props.link.slug?.current ?? '',
        _type: 'internalLink',
        anchor: null,
        link: props.link,
        name: props.text,
      }}
    >
      <LinkWrapper>{props.text}</LinkWrapper>
    </SanityInternalLink>
  ) : props.externalLink ? (
    <Link
      className={cx(['group', className])}
      rel={props.openInNewTab ? 'noopener noreferrer' : ''}
      target={props.openInNewTab ? '_blank' : undefined}
      to={props.externalLink}
    >
      <LinkWrapper>{props.text}</LinkWrapper>
    </Link>
  ) : (
    <p className={className}>{props.text}</p>
  );
}

function LinkWrapper({children}: {children: React.ReactNode}) {
  return (
    <p className="flex items-center text-sm underline-offset-4 group-hover:underline">
      <span className="bg-background relative z-2 block pr-2">{children}</span>
      <span className="-translate-x-[2px] transition-transform group-hover:translate-x-[-0.15px]">
        <IconArrowRight />
      </span>
    </p>
  );
}
