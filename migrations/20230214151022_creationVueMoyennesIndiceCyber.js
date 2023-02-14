const vue = `journal_mss.vue_moyennes_indice_cyber`;

exports.up = knex => knex.raw(`CREATE OR REPLACE VIEW ${vue} AS 

WITH
    evenements_plus_recents AS (
        SELECT DISTINCT ON (donnees ->> 'idService') id AS id_dernier_evenement
        FROM journal_mss.vue_evenements_sans_services_supprimes
        WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
        ORDER BY donnees ->> 'idService', date DESC
    ),
    details_indice_cyber AS (
        SELECT id AS id_evenement_indice_cyber,
               details."categorie",
               details."indice",
               ((donnees->>'nombreMesuresCompletes')::FLOAT / (donnees->>'nombreTotalMesures')::FLOAT) * 100 AS completion
        FROM journal_mss.vue_evenements_sans_services_supprimes,
             jsonb_to_recordset(donnees -> 'detailIndiceCyber') as details("categorie" text, "indice" float)
        WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
    )
SELECT categorie, indice, completion
FROM evenements_plus_recents
JOIN details_indice_cyber ON id_dernier_evenement = id_evenement_indice_cyber
   
;`);

exports.down = knex => knex.raw(`DROP VIEW IF EXISTS ${vue};`);
