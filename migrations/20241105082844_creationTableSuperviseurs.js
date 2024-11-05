exports.up = async knex =>
    knex.schema
        .withSchema('journal_mss')
        .createTable('superviseurs', table => {
            table.text('id_superviseur');
            table.text('id_service');
        })


exports.down = async knex => knex.schema.dropTable('journal_mss.superviseurs');
