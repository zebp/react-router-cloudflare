declare module "react-router" {
  // Your AppLoadContext used in v2
  interface AppLoadContext {
    cloudflare: {
      request: Request,
      ctx: ExecutionContext,
      env: Env,
      caches: CacheStorage,
    };
  }
}

export {};