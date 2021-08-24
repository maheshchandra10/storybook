import { Context, createContext } from 'react';
import { window as globalWindow } from 'global';

import { DocsContextProps } from '@storybook/web-preview';
import { Framework } from '@storybook/csf';

export type { DocsContextProps };

// We add DocsContext to window. The reason is that in case DocsContext.ts is
// imported multiple times (maybe once directly, and another time from a minified bundle)
// we will have multiple DocsContext definitions - leading to lost context in
// the React component tree.
// This was specifically a problem with the Vite builder.
/* eslint-disable no-underscore-dangle */
if (globalWindow.__DOCS_CONTEXT__ === undefined) {
  globalWindow.__DOCS_CONTEXT__ = createContext({});
  globalWindow.__DOCS_CONTEXT__.displayName = 'DocsContext';
}

export const DocsContext: Context<DocsContextProps<Framework>> = globalWindow.__DOCS_CONTEXT__;
