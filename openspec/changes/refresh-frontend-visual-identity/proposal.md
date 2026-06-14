# Proposal: Correção da Identidade Visual Frontend

## Status
`ACCEPTED` — substitui a tentativa anterior (nunca formalizada).

## Contexto

A sessão anterior tentou aplicar a identidade visual do deck `harness-engineering-nodebr.html` ao `credit-analysis-frontend`, mas **falhou em dois eixos**:

1. **Paleta errada:** o token `--acc` recebeu `#7C3AED` (roxo) em vez de `#7FFFD4` (aquamarine). Todos os tokens semânticos derivaram dessa raiz incorreta. O resultado visual era indistinguível da paleta roxa/neon genérica anterior.
2. **Sem OpenSpec:** nenhum dos 5 artefatos foi criado. A change ficou sem rastreabilidade, proposta formal, ADR ou critérios de aceite.

Esta change **substitui integralmente** a tentativa anterior. Não complementa, não reconcilia.

## O que muda

| Categoria | Antes (errado) | Depois (correto) |
|---|---|---|
| Acento | `#7C3AED` roxo | `#7FFFD4` aquamarine |
| Background | `#0A0E1A` | `#0A0E14` |
| Superfície | `#111827` | `#0F141B` |
| Alert | `#EF4444` | `#FF4655` |
| Warn | `#F59E0B` | `#FFB84D` |
| Blue | `#3B82F6` | `#7EB8F7` |
| Purple | ausente | `#C9A8F5` |
| Texto | `#F9FAFB` | `#E6EDF3` |
| Muted | `#6B7280` | `#6B7785` |
| Lines | `rgba(255,255,255,0.08/0.15)` | `#1E2530` / `#2A3340` |
| Radius | `12px` (padrão) | `0` (padrão) / `2px` (excepcional) |
| Shadow | existe | removido |
| Glow halos | existem | removidos |
| Tema claro | existe | removido |
| Compat shim | existe | removido |

## Motivação

O deck `harness-engineering-nodebr.html` é a fonte canônica de identidade do projeto. A estética definida é **terminal-brutalism**: sem radius grande, sem sombras com blur, sem halos neon, sem tema claro. Qualquer divergência é um bug, não uma escolha de design.

## Escopo

- `packages/ui/tokens/tokens.css` — substituição integral
- `apps/customer/app/globals.css` — remoção do compat shim + atualização
- `apps/operator/app/globals.css` — idem
- `packages/ui/src/*.tsx` — 6 componentes refatorados
- `apps/customer/app/**/*.tsx` — 2 páginas refatoradas
- `apps/operator/app/**/*.tsx` — 4 páginas refatoradas
- `packages/ui/src/cockpit-layout.tsx` — theme toggle removido

## Fora do escopo

- `credit-analysis-agent` — intocado
- `compliance-agent` — intocado
- APIs e contratos de dados — intocados
