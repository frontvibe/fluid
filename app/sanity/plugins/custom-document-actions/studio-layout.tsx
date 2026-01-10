import type {LayoutProps} from 'sanity';

import {createContext, useContext} from 'react';

const PluginContext = createContext<{
  shopifyStoreDomain: string;
}>({
  shopifyStoreDomain: '',
});

export function usePluginContext() {
  return useContext(PluginContext);
}

export function createStudioLayout({
  shopifyStoreDomain,
}: {
  shopifyStoreDomain: string;
}) {
  return function CustomStudioLayout(props: LayoutProps) {
    return (
      <PluginContext value={{shopifyStoreDomain}}>
        {props.renderDefault(props)}
      </PluginContext>
    );
  };
}
