const vue = `journal_mss.vue_statuts_mesures_personnalisees`;

exports.up = knex => knex.raw(`CREATE OR REPLACE VIEW ${vue} AS 

WITH
    evenements_plus_recents AS (
        SELECT DISTINCT ON (donnees ->> 'idService') id AS id_dernier_evenement
        FROM journal_mss.vue_evenements_sans_services_supprimes
        WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
        ORDER BY donnees ->> 'idService', date DESC
    ),
    details_statuts AS (
        SELECT id AS id_completude,
            details."idMesure" AS id_mesure,
            details."statut"
         FROM journal_mss.vue_evenements_sans_services_supprimes,
              jsonb_to_recordset(donnees -> 'detailMesures') as details("idMesure" text, "statut" text)
         WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
     )
     
SELECT id_mesure, statut, COUNT(*) as total
FROM evenements_plus_recents recents
JOIN details_statuts d ON recents.id_dernier_evenement = d.id_completude
GROUP BY id_mesure, statut

;`);

exports.down = knex => knex.raw(`DROP VIEW IF EXISTS ${vue}`);
