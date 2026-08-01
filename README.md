# seocron

Timer e cronômetro em uma SPA estática. O projeto não possui backend, tracking nem persistência no navegador; todo estado termina ao recarregar ou fechar a aba.

## Requisitos

- Node.js 24.15+.
- npm.
- HTTPS no ambiente publicado para uso da Screen Wake Lock API.

## Comandos

| Comando               | Finalidade                                  |
| --------------------- | ------------------------------------------- |
| `npm run dev`         | servidor local com hot reload               |
| `npm run typecheck`   | validação TypeScript sem emissão            |
| `npm run lint`        | análise estática                            |
| `npm run test`        | testes unitários e de componentes           |
| `npm run test:e2e`    | build e testes dos fluxos reais no Chromium |
| `npm run build`       | typecheck e build estático em `dist/`       |
| `npm run verify`      | formatação, tipos, lint, unitários e build  |
| `npm run verify:full` | `verify` mais E2E; gate de integração       |

## Arquitetura

A aplicação usa React e TypeScript sobre Vite. Tailwind fornece utilitários de layout; cores são expostas por tokens CSS semânticos para permitir temas curados sem acoplar componentes a paletas específicas.

Os motores de Timer e Cronômetro são hooks independentes da interface. O Timer armazena o timestamp de término; o Cronômetro armazena o timestamp de início e o tempo já acumulado. Intervalos servem apenas para solicitar renderização. O valor autoritativo sempre é calculado por diferenças de `Date.now()`, inclusive ao retornar de uma aba suspensa.

Preferências de tema e fonte vivem somente em state React. É uma invariante do produto não ler nem gravar Web Storage, cookies, banco de dados ou APIs remotas.

As fontes são empacotadas no build e servidas pelo mesmo host da aplicação. JetBrains Mono, Space Mono e VT323 vêm de pacotes Fontsource; DSEG7 Classic vem do pacote oficial DSEG. Nenhuma fonte usa CDN em runtime.

Integrações de navegador ficam em hooks isolados:

- Wake Lock é solicitado apenas enquanto o modo ativo está rodando, readquirido após retorno à aba e liberado ao pausar ou desmontar.
- O título da página deriva do modo e do timestamp atual.
- Atalhos globais ignoram campos e controles interativos para preservar comportamento nativo de teclado.

Os temas possuem testes de contraste e de sincronização entre os tokens TypeScript e o CSS enviado. Axe cobre a semântica da aplicação em todas as paletas; contraste é testado separadamente porque jsdom não possui engine de layout.

## Verificação

Antes de considerar uma alteração pronta:

1. Rode o teste mais próximo da área alterada.
2. Rode `npm run verify:full` antes de integrar a branch.
3. Confirme que nenhuma persistência ou requisição externa em runtime foi adicionada.
4. Para mudanças visuais, confira teclado, foco visível, contraste e layout mobile.

Regras adicionais para pessoas e agentes estão em [AGENTS.md](./AGENTS.md).

## Deploy

`npm run build` gera `dist/`, que pode ser servido por qualquer hospedagem estática. Não existe processo de servidor da aplicação em produção.

O baseline de produção usa Vercel com `main` como branch de produção. `vercel.json` define o build e os headers defensivos; nenhum runtime ou secret é necessário. O workflow de CI executa `npm run verify:full`, incluindo os fluxos reais no Chromium, antes da integração de mudanças.
