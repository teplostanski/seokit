import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: {
      index: './src/index.ts',
      config: './src/config.ts',
      api: './src/api',
    },
    platform: 'node',
    dts: true,
    format: ['esm', 'cjs'],
    target: 'node18',
    shims: true,
  },
])
