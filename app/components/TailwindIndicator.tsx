import {useIsDev} from '~/hooks/useIsDev';
import {useIsInIframe} from '~/hooks/useIsInIframe';

// shadcn-ui https://github.com/shadcn-ui/ui/blob/main/apps/www/components/tailwind-indicator.tsx
export function TailwindIndicator() {
  const isDev = useIsDev();
  const isInIframe = useIsInIframe();

  if (!isDev || isInIframe) return null;

  return (
    <div className="fixed bottom-1 left-1 z-50 flex size-6 items-center justify-center rounded-full bg-[#AB4ABA] p-3 font-mono text-xs text-[#F4D4F4]">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}
