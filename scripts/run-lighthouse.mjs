import { mkdir, writeFile } from 'node:fs/promises'

import lighthouse from 'lighthouse'
import { chromium } from 'playwright'
import { preview } from 'vite'

const categories = [
  ['accessibility', 'Acessibilidade', 1, 'error'],
  ['best-practices', 'Boas práticas', 0.95, 'error'],
  ['seo', 'SEO', 0.9, 'error'],
  ['performance', 'Performance', 0.9, 'warn'],
]
const reportDirectory = '.lighthouseci/reports'

await mkdir(reportDirectory, { recursive: true })

const server = await preview({
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
})

const reports = []

try {
  for (let run = 1; run <= 3; run += 1) {
    const port = 9221 + run
    const browser = await chromium.launch({
      args: [`--remote-debugging-port=${port}`],
      headless: true,
    })

    try {
      const result = await lighthouse('http://127.0.0.1:4173/', {
        logLevel: 'error',
        onlyCategories: categories.map(([id]) => id),
        output: ['json', 'html'],
        port,
      })

      if (!result || !Array.isArray(result.report)) {
        throw new Error(`Lighthouse não gerou os relatórios da rodada ${run}.`)
      }

      const [jsonReport, htmlReport] = result.report
      await Promise.all([
        writeFile(`${reportDirectory}/run-${run}.report.json`, jsonReport),
        writeFile(`${reportDirectory}/run-${run}.report.html`, htmlReport),
      ])
      reports.push(result.lhr)
      console.log(`Rodada ${run}/3 concluída.`)
    } finally {
      await browser.close()
    }
  }
} finally {
  await server.close()
}

let hasError = false

for (const [id, label, minimum, severity] of categories) {
  const scores = reports
    .map((report) => report.categories[id].score)
    .sort((left, right) => left - right)
  const median = scores[Math.floor(scores.length / 2)]
  const summary = `${label}: ${Math.round(median * 100)}% (mínimo ${Math.round(minimum * 100)}%)`

  if (median >= minimum) {
    console.log(`✓ ${summary}`)
  } else if (severity === 'warn') {
    console.warn(`⚠ ${summary}`)
  } else {
    console.error(`✗ ${summary}`)
    hasError = true
  }
}

if (hasError) {
  process.exitCode = 1
}
