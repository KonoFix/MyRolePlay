-- =============================================================================
-- Corrige DELETE não propagando via Realtime em tabelas filtradas por
-- campaign_id (não é a chave primária).
-- =============================================================================
-- Causa raiz: REPLICA IDENTITY padrão do Postgres só inclui a chave primária
-- na linha "old" de um evento de DELETE. O dm.js assina postgres_changes
-- nessas tabelas com filter: `campaign_id=eq.<id>` — mas campaign_id não
-- existe na linha "old" sob REPLICA IDENTITY DEFAULT, então o filtro nunca
-- casa e o evento de DELETE é descartado silenciosamente pelo Realtime.
--
-- Confirmado na prática: excluir um item do tracker de iniciativa some do
-- banco mas continua aparecendo na tela (do próprio mestre que excluiu,
-- e de qualquer outro cliente conectado) até recarregar a página — porque
-- nada reage ao DELETE, e `state.initiative` em memória nunca é atualizado.
--
-- REPLICA IDENTITY FULL inclui a linha inteira (antes da exclusão) no
-- evento, permitindo o filtro por campaign_id casar corretamente.
-- =============================================================================
alter table public.initiative_entries replica identity full;
alter table public.arcs               replica identity full;
alter table public.maps               replica identity full;
alter table public.campaign_members   replica identity full;
