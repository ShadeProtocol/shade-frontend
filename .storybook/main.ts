import path from "path";
import type { StorybookConfig } from "@storybook/nextjs";

/**
 * Next rewrites imports of the packages listed in
 * `experimental.optimizePackageImports` into `__barrel_optimize__` requests,
 * which the SWC loader deliberately skips. tsconfig maps `lucide-react` and
 * `qrcode.react` to local TypeScript shims, so those rewritten requests hand
 * webpack unparsed TypeScript. Dropping the two shimmed packages from the
 * option keeps them on the normal loader path.
 */
function dropShimmedPackagesFromBarrelOptimization(rules: unknown[]) {
  for (const rule of rules) {
    if (!rule || typeof rule !== "object" || !("use" in rule)) {
      continue;
    }

    const { use } = rule as { use: unknown };
    const uses = Array.isArray(use) ? use : [use];

    for (const entry of uses) {
      if (!entry || typeof entry !== "object" || !("options" in entry)) {
        continue;
      }

      const options = (entry as { options?: unknown }).options as
        | {
            nextConfig?: {
              experimental?: { optimizePackageImports?: unknown };
            };
          }
        | undefined;
      const experimental = options?.nextConfig?.experimental;

      if (Array.isArray(experimental?.optimizePackageImports)) {
        experimental.optimizePackageImports =
          experimental.optimizePackageImports.filter(
            (pkg) => pkg !== "lucide-react" && pkg !== "qrcode.react",
          );
      }
    }
  }
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-themes"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (webpackConfig) => {
    webpackConfig.resolve = webpackConfig.resolve ?? {};
    // Resolve the shims to the exact files so webpack keeps the TypeScript
    // extension its loaders match on, and Storybook renders the same icons the
    // app does.
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      "lucide-react": path.resolve(process.cwd(), "src/lib/lucide-react.tsx"),
      "qrcode.react": path.resolve(process.cwd(), "src/lib/qrcode-react.tsx"),
    };

    dropShimmedPackagesFromBarrelOptimization(
      webpackConfig.module?.rules ?? [],
    );

    return webpackConfig;
  },
};

export default config;
