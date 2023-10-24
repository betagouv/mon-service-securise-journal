exports.up = knex => {
  return knex.schema
      .withSchema('journal_mss')
      .createTable('technique_chargement_donnees', table => {
        table.timestamp('date_chargement').defaultTo(knex.raw('now()'));
      })
};

exports.down = knex => {
  return knex.schema.dropTable('journal_mss.technique_chargement_donnees')
};
