import { defineConfig } from "tsup"
import { resolve } from "path"

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "next-themes",
    "tailwindcss",
  ],
  banner: {
    js: '"use client";',
  },
  esbuildOptions(options) {
    options.alias = {
      "@": resolve(__dirname, "src"),
    }
  },
  tsconfig: "tsconfig.build.json",
})
