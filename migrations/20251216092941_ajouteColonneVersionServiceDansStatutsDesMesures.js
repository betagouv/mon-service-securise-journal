const table = 'journal_mss.donnees_statuts_des_mesures';

exports.up = async knex =>
    knex.schema.alterTable(table, table => {
      table.text('version_service');
    });

exports.down = async knex =>
    knex.schema.alterTable(table, table => {
      table.dropColumn('version_service');
    });
