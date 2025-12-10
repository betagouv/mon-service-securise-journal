exports.up = async knex =>
  knex.schema.alterTable('journal_mss.donnees_completude', table => {
    table.jsonb('detail_indice_cyber');
  });

exports.down = async knex =>
  knex.schema.alterTable('journal_mss.donnees_completude', table => {
    table.dropColumn('detail_indice_cyber');
  });
