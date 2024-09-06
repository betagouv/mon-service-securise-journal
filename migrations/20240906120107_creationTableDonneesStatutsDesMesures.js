const table = 'donnees_statuts_des_mesures';

exports.up = async knex =>
    knex.schema
        .withSchema('journal_mss')
        .createTable(table, table => {
          table.text('id_service');
          table.text('id_mesure');
          table.text('statut');
          table.timestamp('date');
        })


exports.down = async knex => knex.schema.dropTable(`journal_mss.${table}`);
