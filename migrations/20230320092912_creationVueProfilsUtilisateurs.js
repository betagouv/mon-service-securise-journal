const vue = `journal_mss.vue_profils_utilisateurs`;

exports.up = knex => knex.raw(`CREATE OR REPLACE VIEW ${vue} AS 

WITH
    evenements_plus_recents AS (
        SELECT DISTINCT ON (donnees ->> 'idUtilisateur') id AS id_dernier_evenement
        FROM journal_mss.evenements
        WHERE type = 'PROFIL_UTILISATEUR_MODIFIE'
        ORDER BY donnees ->> 'idUtilisateur', date DESC
    )
SELECT e.*
FROM journal_mss.evenements e
JOIN evenements_plus_recents r on e.id = r.id_dernier_evenement;

;`);

exports.down = knex => knex.raw(`DROP VIEW IF EXISTS ${vue};`);
