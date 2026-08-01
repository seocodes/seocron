# seocron

Timer e cronômetro em uma SPA estática. O projeto não possui backend, tracking nem persistência no navegador; todo estado termina ao recarregar ou fechar a aba.

## Requisitos

- Node.js 20.19+ ou 22.12+.
- npm.
- HTTPS no ambiente publicado para uso da Screen Wake Lock API.

## Comandos

| Comando             | Finalidade                                      |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | servidor local com hot reload                   |
| `npm run typecheck` | validação TypeScript sem emissão                |
| `npm run lint`      | análise estática                                |
| `npm run test`      | testes unitários e de componentes               |
| `npm run build`     | typecheck e build estático em `dist/`           |
| `npm run verify`    | verificação completa antes de integrar mudanças |

## Arquitetura

A aplicação usa React e TypeScript sobre Vite. Tailwind fornece utilitários de layout; cores são expostas por tokens CSS semânticos para permitir temas curados sem acoplar componentes a paletas específicas.

Os motores de Timer e Cronômetro serão hooks independentes da interface. Intervalos ou `requestAnimationFrame` servem apenas para solicitar renderização. O valor autoritativo sempre é calculado por diferenças entre timestamps de `Date.now()`, evitando drift quando a aba fica em background.

Preferências de tema e fonte vivem somente em state React. É uma invariante do produto não ler nem gravar Web Storage, cookies, banco de dados ou APIs remotas.

As fontes são empacotadas no build por pacotes Fontsource e servidas pelo mesmo host da aplicação.

## Verificação

Antes de considerar uma alteração pronta:

1. Rode o teste mais próximo da área alterada.
2. Rode `npm run verify`.
3. Confirme que nenhuma persistência ou requisição externa em runtime foi adicionada.
4. Para mudanças visuais, confira teclado, foco visível, contraste e layout mobile.

Regras adicionais para pessoas e agentes estão em [AGENTS.md](./AGENTS.md).

## Deploy

`npm run build` gera `dist/`, que pode ser servido por qualquer hospedagem estática. Não existe processo de servidor da aplicação em produção.

O baseline de produção usa Vercel com `main` como branch de produção. `vercel.json` define o build e os headers defensivos; nenhum runtime ou secret é necessário. O workflow de CI executa a mesma verificação usada localmente antes da integração de mudanças.
