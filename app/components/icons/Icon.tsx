import {cx} from 'class-variance-authority';
import {twMerge} from 'tailwind-merge';

export type IconProps = {
  direction?: 'down' | 'left' | 'right' | 'up';
} & JSX.IntrinsicElements['svg'];

export function Icon({
  children,
  className,
  fill = 'currentColor',
  stroke,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      aria-hidden
      className={twMerge(cx('size-5', className))}
      fill={fill}
      focusable={false}
      stroke={stroke}
    >
      {children}
    </svg>
  );
}
