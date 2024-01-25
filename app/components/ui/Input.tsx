import {forwardRef} from 'react';

import {cn} from '~/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({className, type, ...props}, ref) => {
    return (
      <input
        className={cn(
          'flex h-10 w-full rounded-md border border-color-scheme-text bg-color-scheme-bg px-3 py-2 text-sm ring-offset-color-scheme-text file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export {Input};
