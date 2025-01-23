import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";

const rrPlugins = reactRouter();

// HACK HACK HACK
for (const plugin of rrPlugins) {
  if (plugin.name === "react-router") {
    // react-router tries to make its own dev server, but we have our own!
    plugin.configureServer = undefined;
  }
}

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    cloudflare(),
    rrPlugins,
    tsconfigPaths(),
  ],
});
