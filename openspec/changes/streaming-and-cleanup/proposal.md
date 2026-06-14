# Streaming and Customer Cleanup

## Motivacao

A experiencia customer ainda tem inconsistencias depois do pass de humanizacao: o stream visual nao usa o estado canonico `in_progress`, a simulacao pode deixar agente anterior em fila enquanto posteriores aparecem concluidos, e alguns elementos de cockpit/marketing vazam para a tela do cliente.

## Escopo

Esta change consolida quatro fixes na mesma camada de apresentacao customer:

1. Streaming sequencial real com `queued -> in_progress -> success/done` e estados visuais distintos.
2. Remocao do stat de marketing `+2.847 analises concluidas hoje` da home customer.
3. Brand do header clicavel para `/` usando `next/link`.
4. Cleanup de leaks residuais: `OP-1002`, ID tecnico em header/debug, badge de fallback e HUD live apos estado terminal.

## Observacao sobre AgentStream

A sessao anterior reportou `AgentStream`; no estado atual o arquivo existe, mas ainda precisa ser consolidado para o contrato visual pedido aqui: `in_progress`, `awaiting_human`, pulse + typing cursor e simulacao sequencial cobrindo os 5 agentes.

## Fora de Escopo

- Backend permanece intocado.
- Operator preserva telemetria tecnica, throughput e IDs.
- Tokens/paleta nao mudam.
