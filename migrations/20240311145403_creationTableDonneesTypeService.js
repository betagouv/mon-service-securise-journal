exports.up = async knex =>
    knex.schema
        .withSchema('journal_mss')
        .createTable('donnees_type_service', table => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.timestamp('date');
            table.text('id_service');
            table.text('type_service');
            table.jsonb('donnees_origine');
        })


exports.down = async knex => knex.schema.dropTable('journal_mss.donnees_type_service');
