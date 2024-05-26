import {cn} from 'app/lib/utils';
import {forwardRef} from 'react';

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({className, ...props}, ref) => (
    <div
      className={cn(
        'group/card rounded-lg border bg-card text-card-foreground shadow-sm shadow-foreground/10',
        className,
      )}
      data-type="card"
      ref={ref}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    ref={ref}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardMedia = forwardRef<
  HTMLDivElement,
  {
    aspectRatio?: 'auto' | 'square' | 'video';
  } & React.HTMLAttributes<HTMLDivElement>
>(({aspectRatio = 'video', className, ...props}, ref) => {
  const ratios = {
    auto: 'aspect-none',
    square: 'aspect-square',
    video: 'aspect-video',
  };

  return (
    <div
      className={cn('relative overflow-hidden', ratios[aspectRatio], className)}
      ref={ref}
      {...props}
    >
      <div className="origin-center [&_img]:size-full [&_img]:scale-[1.005] [&_img]:object-cover [&_img]:[transition:transform_0.5s_ease] group-hover/card:[&_img]:scale-[1.03]">
        {props.children}
      </div>
    </div>
  );
});
CardMedia.displayName = 'CardMedia';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({className, ...props}, ref) => (
  <h3
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className,
    )}
    ref={ref}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({className, ...props}, ref) => (
  <p
    className={cn('text-sm text-muted-foreground', className)}
    ref={ref}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div className={cn('p-6 pt-0', className)} ref={ref} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    className={cn('flex items-center p-6 pt-0', className)}
    ref={ref}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
};
