import { appendFile, readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

if (!process.env.GITHUB_STEP_SUMMARY) {
  console.log('GITHUB_STEP_SUMMARY não está definido; resumo não publicado.')
  process.exit(0)
}

const sections = []

try {
  const coverage = JSON.parse(
    await readFile('coverage/coverage-summary.json', 'utf8'),
  ).total
  sections.push(
    '## Cobertura',
    '',
    '| Métrica | Cobertura |',
    '| --- | ---: |',
    `| Linhas | ${coverage.lines.pct}% |`,
    `| Statements | ${coverage.statements.pct}% |`,
    `| Funções | ${coverage.functions.pct}% |`,
    `| Branches | ${coverage.branches.pct}% |`,
    '',
  )
} catch {
  sections.push('## Cobertura', '', 'Resumo indisponível.', '')
}

try {
  const reportDirectory = '.lighthouseci/reports'
  const reportFiles = (await readdir(reportDirectory)).filter((file) =>
    file.endsWith('.report.json'),
  )
  const reports = await Promise.all(
    reportFiles.map(async (file) =>
      JSON.parse(await readFile(join(reportDirectory, file), 'utf8')),
    ),
  )
  const categoryIds = [
    ['performance', 'Performance'],
    ['accessibility', 'Acessibilidade'],
    ['best-practices', 'Boas práticas'],
    ['seo', 'SEO'],
  ]

  sections.push(
    '## Lighthouse (mediana de 3 execuções)',
    '',
    '| Categoria | Pontuação |',
    '| --- | ---: |',
  )

  for (const [id, label] of categoryIds) {
    const scores = reports
      .map((report) => Math.round(report.categories[id].score * 100))
      .sort((left, right) => left - right)
    sections.push(`| ${label} | ${scores[Math.floor(scores.length / 2)]}% |`)
  }
  sections.push('')
} catch {
  sections.push('## Lighthouse', '', 'Resumo indisponível.', '')
}

await appendFile(process.env.GITHUB_STEP_SUMMARY, sections.join('\n'))
