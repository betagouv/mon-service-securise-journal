const vue = `journal_mss.vue_evenements_profil_utilisateur_modifie_derniers_en_date`;

exports.up = knex => knex.raw(`CREATE OR REPLACE VIEW ${vue} AS 
  
WITH
    derniers_en_date AS (
        SELECT DISTINCT ON (donnees ->> 'idUtilisateur') id AS id_dernier_evenement
        FROM journal_mss.evenements
        WHERE type = 'PROFIL_UTILISATEUR_MODIFIE'
        ORDER BY donnees ->> 'idUtilisateur', date DESC
    )
SELECT e.*
FROM journal_mss.evenements e
JOIN derniers_en_date d on d.id_dernier_evenement = e.id

;`);

exports.down = knex => knex.raw(`DROP VIEW IF EXISTS ${vue};`)
