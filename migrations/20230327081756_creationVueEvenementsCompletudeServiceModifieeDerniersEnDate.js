const vue = `journal_mss.vue_evenements_completude_service_modifiee_derniers_en_date`;

exports.up = knex => knex.raw(`CREATE OR REPLACE VIEW ${vue} AS 
  
WITH
    derniers_en_date AS (
        SELECT DISTINCT ON (donnees ->> 'idService') id AS id_dernier_evenement
        FROM journal_mss.evenements
        WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
        ORDER BY donnees ->> 'idService', date DESC
    )
SELECT e.*
FROM journal_mss.evenements e
JOIN derniers_en_date d on d.id_dernier_evenement = e.id

;`);

exports.down = knex => knex.raw(`DROP VIEW IF EXISTS ${vue};`)
