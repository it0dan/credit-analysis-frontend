# Humanize Customer Experience + Debug Mode

## Problemas

1. O customer mostra a analise em blocos prontos, sem comunicar que agentes estao raciocinando em tempo real entre polls.
2. A UI ainda expoe marca pessoal/empresa em textos e wordmark, o que reduz a neutralidade do produto para a demo.
3. Telemetria tecnica util para palco e engenharia aparece para o usuario final: IDs, traces, spans, fases, latencias e custo.

## Objetivos

1. Introduzir uma experiencia de reasoning streaming no customer usando o polling existente, com estados por agente e micro-animacoes entre atualizacoes.
2. Remover todas as mencoes a "Sensedia", "sense" e "dia" do UI, adotando uma identidade neutra `Credito A2A`.
3. Esconder telemetria tecnica por default no customer e expor via debug mode (`Ctrl+Shift+D` ou `?debug=1`), mantendo o operator como tela tecnica sempre detalhada.

## Entrega Coordenada

A mudanca combina de-brand, debug infrastructure e novo stream visual de agentes porque os tres pontos afetam os mesmos componentes compartilhados (`CockpitLayout`, primitives de UI e pagina de status do customer). A implementacao deve preservar a logica de negocio e apenas reorganizar apresentacao/visibilidade.

## Fora de Escopo

- Nao alterar backend, endpoints, payloads ou contratos do orquestrador.
- Nao migrar polling para SSE nesta sessao.
- Nao alterar tokens de design nem a paleta atual.
- Nao remover telemetria do operator.

## Debito Explícito

SSE real fica como debito para o repo `credit-analysis-agent`: um endpoint futuro `/analysis/:id/events` deve emitir eventos por span/OTel (`queued`, `started`, `tool_call`, `tool_result`, `completed`, `error`). Ate la, o frontend simula progresso fino usando polling de 2s e estados otimistas locais.
