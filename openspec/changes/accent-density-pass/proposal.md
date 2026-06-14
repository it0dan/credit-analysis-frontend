# Accent Density Pass

## Motivacao

A identidade visual ja usa os tokens corretos do deck, mas a leitura de interface ainda precisa reforcar a presenca do accent aquamarine nos HUDs, labels, headings, status, cards e controles. A baseline medida em 1440x900/375x812 ficou acima do alvo objetivo de 2.5%, mas o pass garante que os padroes visuais do deck aparecam de forma consistente nas rotas principais.

## Baseline

- Customer desktop: 11.35% aquamarine dos pixels nao-fundo.
- Customer mobile: 13.26% aquamarine dos pixels nao-fundo.
- Operator desktop: 5.38% aquamarine dos pixels nao-fundo.
- Alvo de fechamento: >= 2.5% em todas as telas medidas apos o pass.

## Escopo

- Intensificar styling de componentes existentes em `apps/customer`, `apps/operator` e `packages/ui`.
- Alinhar HUD top, HUD bottom, tags, headings, pulses, cards, stats, botoes e inputs ao vocabulario visual do deck.
- Manter as rotas e fluxos atuais.

## Fora de Escopo

- Alterar tokens em `packages/ui/tokens/tokens.css`.
- Alterar logica de negocio, submit, fetch, polling, navegacao ou payloads.
- Reescrever componentes existentes ou introduzir novas mudancas contratuais de produto.
