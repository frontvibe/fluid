import {cn} from 'app/lib/utils';

function Card({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/card rounded-lg border bg-card text-card-foreground shadow-xs shadow-foreground/10',
        className,
      )}
      data-type="card"
      {...props}
    />
  );
}

function CardHeader({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  );
}

function CardMedia({
  aspectRatio = 'video',
  className,
  ...props
}: React.ComponentProps<'div'> & {
  aspectRatio?: 'auto' | 'square' | 'video';
}) {
  const ratios = {
    auto: 'aspect-none',
    square: 'aspect-square',
    video: 'aspect-video',
  };

  return (
    <div
      className={cn('relative overflow-hidden', ratios[aspectRatio], className)}
      {...props}
    >
      <div className="origin-center [&_img]:size-full [&_img]:scale-[1.005] [&_img]:object-cover [&_img]:duration-500 [&_img]:group-hover/card:scale-[1.03]">
        {props.children}
      </div>
    </div>
  );
}

function CardTitle({className, ...props}: React.ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'text-2xl leading-none font-semibold tracking-tight',
        className,
      )}
      {...props}
    >
      {props.children}
    </h3>
  );
}

function CardDescription({className, ...props}: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}

function CardContent({className, ...props}: React.ComponentProps<'div'>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

function CardFooter({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
};
