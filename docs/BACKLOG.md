# Backlog do produto

Este backlog registra oportunidades, não promessas. A prioridade considera valor para quem usa, risco técnico e compatibilidade com a proposta privada e client-only.

## Como ler

- **Agora:** pequeno, valioso e seguro o bastante para a próxima evolução.
- **Depois:** faz sentido, mas depende de uma decisão ou validação anterior.
- **Explorar:** hipótese útil para portfólio; precisa de pesquisa antes de virar implementação.
- **Não planejado:** contradiz o produto atual ou adiciona custo sem valor proporcional.

## Agora

### Auditoria manual de acessibilidade e Safari mobile

**Valor:** encontra problemas que axe, jsdom e engines desktop não percebem, como ordem real de foco, VoiceOver, zoom de texto e barras móveis do Safari.

**Critérios de aceite:**

- percorrer Timer, Cronômetro, foco e fullscreen apenas por teclado;
- testar VoiceOver em Safari iOS ou macOS;
- testar zoom de texto e orientação em 320 px e 390 px;
- registrar evidências, problemas e decisão para cada achado;
- manter os testes automáticos existentes.

**Riscos:** depender de dispositivo real; confundir diferença aceitável de plataforma com defeito.

### Alerta sonoro e vibração locais, opcionais

**Valor:** permite perceber o fim do Timer sem olhar para a tela.

**Critérios de aceite:**

- ficar desligado por padrão;
- exigir interação antes de tocar, respeitando políticas de autoplay;
- oferecer controle acessível para som e, quando suportado, vibração;
- não baixar áudio em runtime nem enviar dados;
- falhar silenciosamente quando a API não existir;
- nunca repetir o alerta sem limite.

**Riscos:** volume inesperado, autoplay bloqueado, vibração sem suporte no Safari e recurso de áudio aumentando o bundle.

## Depois

### Configuração compartilhável por URL

**Valor:** um link poderia abrir, por exemplo, um Timer de 25 minutos no tema Nord e fonte Orbitron, sem conta e sem persistência.

**Critérios de aceite:**

- serializar somente configurações não sensíveis em query parameters;
- validar e limitar todos os valores recebidos;
- manter o padrão quando a URL for inválida;
- não iniciar contagem automaticamente;
- permitir copiar um link com feedback acessível;
- documentar que a URL pode aparecer no histórico e ser compartilhada.

**Riscos:** URLs longas, compatibilidade futura e confusão entre “configuração compartilhada” e “estado sincronizado”.

### Instalação e uso offline como PWA

**Valor:** aproxima a experiência de um aplicativo nativo e mantém o Timer disponível sem conexão depois da instalação.

**Condição anterior:** definir como atualizações do service worker serão aplicadas sem interromper uma contagem ativa.

**Critérios de aceite:**

- manifest com nome, ícones e cores corretos;
- cache apenas de assets versionados do próprio app;
- estratégia clara de atualização e rollback;
- teste offline automatizado;
- nenhuma persistência de histórico ou tracking introduzidos.

**Riscos:** servir código antigo, cache difícil de depurar e atualização durante Timer ativo.

## Explorar

### Testes de regressão visual

**Valor:** detecta corte de dígitos, mudanças inesperadas de espaçamento e combinações ruins entre temas, fontes e escalas.

**Antes de implementar:** selecionar poucas telas estáveis; screenshots de todas as combinações seriam lentas e frágeis.

**Critérios candidatos:** desktop e 320 px; Timer e Cronômetro; normal e foco; tolerância explícita para renderização de fontes entre sistemas.

**Riscos:** falsos positivos e manutenção de snapshots sem análise humana.

### Preferência de movimento reduzido

**Valor:** garante que novos efeitos futuros respeitem `prefers-reduced-motion`.

**Observação:** o app atual usa transições curtas e discretas. A implementação só se justifica se o repertório de animações crescer ou uma auditoria identificar desconforto.

## Não planejado

### Contas e histórico persistente

Mudariam a promessa de uso imediato e privado. Exigiriam autenticação, banco, política de retenção, recuperação e segurança operacional. Só deveriam voltar à discussão se pessoas reais precisarem sincronizar dados entre dispositivos.

### Analytics, tracking e logs remotos

Não há problema concreto que justifique observar comportamento individual. Métricas de CI, artefatos de falha e feedback direto são suficientes neste estágio.

### Backend apenas para “parecer full-stack”

Um servidor sem responsabilidade de produto aumenta superfície de falha e custo. Maturidade full-stack aparece aqui em limites claros, segurança, compatibilidade, CI/CD, operação e decisões proporcionais.

### Git Flow

Branches permanentes `develop`, `release` e `hotfix` não combinam com deploy contínuo de um app pequeno. Branches curtas, PRs e `main` sempre publicável tornam o fluxo mais simples e rastreável.

## Regra para promover um item

Antes de mover algo para implementação, responda:

1. Qual problema de uma pessoa real isso resolve?
2. Qual é o menor recorte útil?
3. Que invariante ou risco pode ser afetado?
4. Como provar o comportamento com teste ou evidência manual?
5. O que será deliberadamente deixado de fora?

Essas respostas viram os critérios de aceite do PR e evitam transformar ideias interessantes em complexidade permanente.
