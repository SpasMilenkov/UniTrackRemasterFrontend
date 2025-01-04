// A somewhat hacky solution to fix the delay in CSS load when using naive.
// Apparently this issue was caused in a not so recent update to Nuxt...
// Without this plugin css loads considerably slower when refreshing the page
// This behavior is witnessed in both dev and preview modes

import { setup } from '@css-render/vue3-ssr';
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    const { collect } = setup(nuxtApp.vueApp);
    const originalRenderMeta: any = nuxtApp.ssrContext?.renderMeta;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    nuxtApp.ssrContext.renderMeta = () => {
      if (!originalRenderMeta) {
        return {
          headTags: collect(),
        };
      }
      const originalMeta = originalRenderMeta();
      if ('then' in originalMeta) {
        return originalMeta.then((resolvedOriginalMeta: any) => {
          return {
            ...resolvedOriginalMeta,
            headTags: resolvedOriginalMeta.headTags + collect(),
          };
        });
      } else {
        return {
          ...originalMeta,
          headTags: originalMeta.headTags + collect(),
        };
      }
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    nuxtApp.ssrContext.head = nuxtApp.ssrContext.head || [];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    nuxtApp.ssrContext.head.push({
      style: () =>
        collect()
          .split('</style>')
          .map((block) => {
            const id = RegExp(/cssr-id="(.+?)"/).exec(block)?.[1];
            const style = (RegExp(/>(.*)/s).exec(block)?.[1] ?? '').trim();
            return {
              'cssr-id': id,
              innerHTML: style,
            };
          }),
    });
  }
});
