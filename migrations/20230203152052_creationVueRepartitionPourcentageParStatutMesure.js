const vue = `journal_mss.vue_repartition_pourcentage_par_statut_mesure`;

exports.up = knex => knex.raw(`CREATE OR REPLACE VIEW ${vue} AS 

SELECT id_mesure,
       statut,
       ROUND(100 * (total / (sum(total) OVER (PARTITION BY id_mesure)))) as pourcentage
FROM journal_mss.vue_statuts_mesures_personnalisees

;`);

exports.down = knex => knex.raw(`DROP VIEW IF EXISTS ${vue}`);
