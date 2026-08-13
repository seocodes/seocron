import { gzipSync } from 'node:zlib'
import { appendFile, readdir, readFile, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'

const limits = {
  javascriptGzip: 90 * 1024,
  cssGzip: 15 * 1024,
  fontsRaw: 400 * 1024,
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? walk(path) : [path]
    }),
  )

  return nested.flat()
}

const files = await walk('dist')
const totals = { javascriptGzip: 0, cssGzip: 0, fontsRaw: 0 }

for (const file of files) {
  const extension = extname(file)

  if (extension === '.js') {
    totals.javascriptGzip += gzipSync(await readFile(file)).byteLength
  } else if (extension === '.css') {
    totals.cssGzip += gzipSync(await readFile(file)).byteLength
  } else if (extension === '.woff' || extension === '.woff2') {
    totals.fontsRaw += (await stat(file)).size
  }
}

const rows = [
  ['JavaScript (gzip)', totals.javascriptGzip, limits.javascriptGzip],
  ['CSS (gzip)', totals.cssGzip, limits.cssGzip],
  ['Fontes locais', totals.fontsRaw, limits.fontsRaw],
]

const formatKb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`
const markdown = [
  '## Orçamento do build',
  '',
  '| Recurso | Atual | Limite | Estado |',
  '| --- | ---: | ---: | :---: |',
  ...rows.map(
    ([label, actual, limit]) =>
      `| ${label} | ${formatKb(actual)} | ${formatKb(limit)} | ${actual <= limit ? '✅' : '❌'} |`,
  ),
  '',
].join('\n')

console.log(markdown)

if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown)
}

const exceeded = rows.filter(([, actual, limit]) => actual > limit)
if (exceeded.length > 0) {
  throw new Error(
    `Orçamento excedido: ${exceeded.map(([label]) => label).join(', ')}`,
  )
}
