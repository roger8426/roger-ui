import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * Vite lib mode strips CSS imports from JS chunks when cssCodeSplit is enabled.
 * This plugin reads each chunk's associated CSS file content and injects it at
 * runtime via a `<style>` tag, so consumers don't need to manually import CSS.
 *
 * - SSR-safe: guards with `typeof document !== 'undefined'`
 * - Deduplication: uses a unique `id` per CSS asset to prevent double injection
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

        // Remove /* empty css */ comments
        chunk.code = chunk.code.replace(/\/\* empty css\s*\*\/\n?/g, '')

        // Build runtime injection code for each CSS file
        const injections = [...importedCss]
          .map((cssFile) => {
            const cssAsset = bundle[cssFile]
            if (!cssAsset || cssAsset.type !== 'asset') return ''

            const cssContent = typeof cssAsset.source === 'string' ? cssAsset.source : ''
            if (!cssContent) return ''

            // Create a stable ID from the CSS file path
            const styleId = `__rui_${cssFile.replace(/[/.]/g, '_')}`

            // Escape backticks, backslashes, and ${} for template literal
            const escaped = cssContent
              .replace(/\\/g, '\\\\')
              .replace(/`/g, '\\`')
              .replace(/\$/g, '\\$')

            return (
              `(function(){` +
              `if(typeof document!=='undefined'){` +
              `var id='${styleId}';` +
              `if(!document.getElementById(id)){` +
              `var s=document.createElement('style');` +
              `s.id=id;` +
              `s.textContent=\`${escaped}\`;` +
              `document.head.appendChild(s)` +
              `}}` +
              `})();`
            )
          })
          .filter(Boolean)
          .join('\n')

        if (injections) {
          chunk.code = `${injections}\n${chunk.code}`
        }
      }

      // Remove standalone CSS assets from the bundle since they are now inlined
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type === 'asset' && fileName.endsWith('.css')) {
          delete bundle[fileName]
        }
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
