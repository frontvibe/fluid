import type {CSSProperties} from 'react';

export function Overlay(props: {opacity?: null | number}) {
  const style = {
    '--overlayOpacity': props?.opacity ? props.opacity / 100 : 0,
  } as CSSProperties;

  if (props?.opacity === 0) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-black bg-opacity-[var(--overlayOpacity)]"
      style={style}
    ></div>
  );
}
