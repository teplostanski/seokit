import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: {
      main: './src/index.ts',
      config: './src/config.ts',
      api: '../api/src/index.ts',
    },
    platform: 'node',
    dts: true,
    format: ['esm', 'cjs'],
    target: 'node18',
    shims: true,
    external: ['../api/src/**/*'],
  },
])
