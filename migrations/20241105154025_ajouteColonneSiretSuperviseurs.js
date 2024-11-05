exports.up = async knex =>
  knex.schema.alterTable('journal_mss.superviseurs', table => {
    table.text('siret_service')
  });

exports.down = async knex =>
  knex.schema.alterTable('journal_mss.superviseurs', table => {
    table.dropColumn('siret_service')
  });
