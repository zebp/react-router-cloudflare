import type { ExportedHandler } from "@cloudflare/workers-types";
import { createRequestHandler } from "react-router";

const getLoadContext = ({ context }: any) => ({
  ...context,
  cloudflare: {
    ...context.cloudflare,
    cf: context.cloudflare.request.cf,
  },
});

export default {
  async fetch(request, env, ctx) {
    try {
      const loadContext = getLoadContext({
        // @ts-ignore
        request,
        context: {
          cloudflare: {
            request,
            // This object matches the return value from Wrangler's
            // `getPlatformProxy` used during development via Remix's
            // `cloudflareDevProxyVitePlugin`:
            // https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
            ctx: {
              waitUntil: ctx.waitUntil.bind(ctx),
              passThroughOnException: ctx.passThroughOnException.bind(ctx),
            },
            // @ts-ignore
            caches,
            // @ts-ignore
            env,
          },
        },
      });

      let handler;

      // @ts-ignore
      if (import.meta.hot) {
        handler = createRequestHandler(
          // @ts-expect-error
          () => import("virtual:react-router/server-build").catch(),
          "production"
        );
      } else {
        handler = createRequestHandler(
          // @ts-expect-error
          () => import("../dist/server/index.js"),
          "production"
        );
      }

      // @ts-ignore
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return handler(request, loadContext) as any;
    } catch (error) {
      console.error(error);
      return new Response("An unexpected error occurred", { status: 500 });
    }
  },
} satisfies ExportedHandler<{}>;
