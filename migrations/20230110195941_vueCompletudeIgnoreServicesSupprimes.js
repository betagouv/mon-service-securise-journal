const vue = `journal_mss.vue_completude`;

// C'est le FROM qui change par rapport à la vue_completude originale
exports.up = knex => knex.raw(`CREATE OR REPLACE VIEW ${vue} AS 
  
WITH
    evenements_plus_recents AS (
        SELECT DISTINCT ON(donnees->>'idService')
            id AS id_dernier_evenement
        FROM journal_mss.vue_evenements_sans_services_supprimes
        WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
        ORDER BY donnees->>'idService', date DESC
    ),
    completude AS (
        SELECT
            id AS id_completude,
            ((donnees->>'nombreMesuresCompletes')::FLOAT / (donnees->>'nombreTotalMesures')::FLOAT) * 100 AS completion
        FROM journal_mss.vue_evenements_sans_services_supprimes
        WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
    )

SELECT c.completion, e.donnees, e.date, e.id
FROM evenements_plus_recents recents
JOIN completude c ON recents.id_dernier_evenement = c.id_completude
-- Pas besoin de la vue ici : les événements sont déjà filtrés
JOIN journal_mss.evenements e ON recents.id_dernier_evenement = e.id 

;`);

exports.down = knex => knex.raw(`DROP VIEW IF EXISTS ${vue};`)
