# Design

## Decisao 1 - Reasoning streaming sem SSE

Mantemos o polling existente em `/analysis/:id/status` com intervalo de 2s. O frontend adiciona uma primitive `AgentStream` que transforma o payload atual de fases em uma lista viva de agentes e estados intermediarios.

Estados renderizados por agente:

- `queued`: agente ainda aguardando, visual esmaecido e sem icone forte.
- `thinking`: agente ativo, com pulse aquamarine e cursor de digitacao.
- `tool_call`: chamada de ferramenta em curso, label azul mono.
- `result`: resultado recem-chegado, flash aquamarine curto.
- `done`: concluido, check aquamarine fixo.
- `error`: falha, simbolo de alerta.

Entre polls, o agente mais recente fica em estado vivo (`thinking`) quando o status geral for `analyzing`. Se nao houver novo evento por mais de 1.5s e o status continuar `analyzing`, o proximo agente esperado entra em estado otimista `queued -> thinking`, sem alterar dados persistidos. Quando uma nova `phase` aparecer no payload, a linha anima a transicao interna por aproximadamente 800ms antes de fixar como `done` ou `error`.

No fallback simulado apos 3 falhas de poll, os timers atuais serao expandidos para uma sequencia deterministica de cerca de 12 sub-eventos ao longo de aproximadamente 9s. Isso cria uma narrativa de agentes trabalhando: entrada, chamada de ferramenta, resultado e conclusao.

Todas as animacoes novas respeitam `prefers-reduced-motion`: cursor fica estatico, pulse perde repeticao longa e fade-in vira aparicao imediata.

## Decisao 2 - De-brand

Criamos `packages/ui/src/brand.tsx` com `Brand` e tres variantes:

- `full`: `◇ CREDITO·A2A`
- `glyph`: `◇`
- `footer`: `credito·a2a · demo`

O glyph `◇` em `var(--acc)` preserva a linguagem terminal/HUD do deck sem depender de marca pessoal. O texto mono uppercase com letter-spacing forte combina com labels e tags ja usados no produto. O middot (`·`) separa termos sem parecer slogan comercial.

`CockpitLayout` passa a consumir `<Brand variant="full" />` no topo e `<Brand variant="footer" />` no rodape. Os metadados dos dois apps tambem devem usar nomes neutros. Qualquer README sob `apps` que mencione a marca deve ser atualizado.

## Decisao 3 - Debug mode

Criamos `packages/ui/src/debug-context.tsx` como client component com:

- `DebugProvider({ defaultEnabled, children })`
- `useDebug(): { enabled, toggle }`
- `DebugOnly({ children })`
- `HumanLabel({ human, debug })`

Estado inicial:

- Customer: `defaultEnabled={false}`.
- Operator: `defaultEnabled={true}`.

Ativacao:

- `Ctrl+Shift+D` alterna em qualquer pagina.
- `?debug=1` forca ligado.
- `?debug=0` forca desligado.
- Overrides por URL persistem em `localStorage["dan:debug-mode"]`.

Quando debug estiver ativo, o provider renderiza badge fixo `[DEBUG·ON]` no canto superior direito, mono 10px, cor aquamarine, fundo `--bg`, padding `4px 8px` e `border-bottom: 1px solid var(--acc)`. O badge usa `title` para documentar o atalho.

`DebugOnly` remove telemetria do DOM visual quando desativado. `HumanLabel` mostra texto humano no modo default e texto tecnico quando debug estiver ativo.

## Decisao 4 - Mapeamento agente -> label humano

| Agente tecnico | Label customer |
|---|---|
| `bureau` | Verificando seu historico de credito |
| `documents` | Confirmando documentos |
| `risk` | Avaliando seu perfil |
| `compliance` | Conferindo conformidade |
| `decision` | Concluindo analise |

Status final no customer:

| Status tecnico | Mensagem customer |
|---|---|
| `approved` | Aprovado · seu credito esta pronto |
| `rejected` | Nao foi possivel aprovar agora |
| `hitl_required` | Em analise humana · retornamos em ate 24h |
| `error` | Algo deu errado · tente novamente em instantes |

## Decisao 5 - Operator como tela tecnica

O operator continua mostrando toda telemetria sem acao do usuario. Se componentes compartilhados passarem por `DebugOnly` ou `HumanLabel`, o `DebugProvider` do operator inicia ligado para preservar IDs, spans, fases, latencias, custos e trace. A rota `/queue/[request_id]` e a fila devem continuar adequadas para demonstracao tecnica no palco.
