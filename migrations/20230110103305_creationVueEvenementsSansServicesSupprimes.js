const vue = `journal_mss.vue_evenements_sans_services_supprimes`;

exports.up = knex => knex.raw(`CREATE OR REPLACE VIEW ${vue} AS 
  
SELECT *
FROM journal_mss.evenements
WHERE donnees->'idService' NOT IN (
    SELECT donnees->'idService'
    FROM journal_mss.evenements
    WHERE type = 'SERVICE_SUPPRIME'
)

;`);


exports.down = knex => knex.raw(`DROP VIEW IF EXISTS ${vue};`)
