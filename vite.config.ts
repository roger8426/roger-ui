import { dirname, relative } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * Vite lib mode strips CSS imports from JS chunks when cssCodeSplit is enabled.
 * This plugin restores `import './Foo.css'` statements in each chunk that has
 * a corresponding extracted CSS asset.
 */
function libCssInject(): Plugin {
  return {
    name: 'lib-css-inject',
    apply: 'build',
    enforce: 'post',
    generateBundle(opts, bundle) {
      // Only run for library build (preserveModules), skip Storybook build
      if (!opts.preserveModules) return

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk' || !fileName.endsWith('.js')) continue

        // Use Vite's metadata to find CSS files imported by this chunk
        const importedCss = (chunk as unknown as { viteMetadata?: { importedCss?: Set<string> } })
          .viteMetadata?.importedCss

        if (!importedCss || importedCss.size === 0) continue

        const dir = dirname(fileName)

        // Remove /* empty css */ comments
        chunk.code = chunk.code.replace(/\/\* empty css\s*\*\/\n?/g, '')

        // Prepend import for each associated CSS file
        const imports = [...importedCss]
          .map((cssFile) => {
            const relativePath = relative(dir, cssFile)
            const importPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`
            return `import '${importPath}';`
          })
          .join('\n')

        chunk.code = `${imports}\n${chunk.code}`
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), libCssInject()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
})
