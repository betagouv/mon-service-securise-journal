exports.up = async knex => {
  await knex.raw(`DROP VIEW IF EXISTS journal_mss.vue_repartition_pourcentage_par_statut_mesure;`)
  await knex.raw(`DROP VIEW IF EXISTS journal_mss.vue_completude;`)
  await knex.raw(`DROP VIEW IF EXISTS journal_mss.vue_evenements_completude_service_modifiee_derniers_en_date;`)
  await knex.raw(`DROP VIEW IF EXISTS journal_mss.vue_evenements_profil_utilisateur_modifie_derniers_en_date;`)
  await knex.raw(`DROP VIEW IF EXISTS journal_mss.vue_moyennes_indice_cyber;`)
  await knex.raw(`DROP VIEW IF EXISTS journal_mss.vue_statuts_mesures_personnalisees;`)
  await knex.raw(`DROP VIEW IF EXISTS journal_mss.vue_profils_utilisateurs;`)
};

exports.down = function(knex) {};
