# Proposal — Linguagem bancária e workflow fluido

## Contexto

O portal customer ainda expõe conceitos internos do sistema agêntico. Um sistema bancário de referência deve comunicar proposta, análise, segurança e próximos passos em vocabulário reconhecível pelo cliente, mantendo os detalhes técnicos no operator e no modo debug.

## Entregas

1. Substituir textos técnicos visíveis do customer por linguagem de Internet Banking.
2. Trocar o reasoning stream do customer por cards de workflow com estados visuais ricos e movimento acessível.
3. Disponibilizar logout no header de todos os portais e na conta do customer.
4. Criar `/configuracoes` com perfil, notificações persistidas e preferências de exibição.

## Restrições

- Nenhuma dependência de runtime nova.
- Nenhuma alteração em `credit-analysis-agent` ou `compliance-agent`.
- Textos técnicos do operator permanecem intactos.
- Terminal-brutalism, reduced motion e densidade aquamarine mínima de 2,5% permanecem invariantes.

