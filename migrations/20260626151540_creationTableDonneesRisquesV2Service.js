exports.up = async knex =>
    knex.schema
        .withSchema('journal_mss')
        .createTable('donnees_risques_v2_service', table => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.text('id_service').notNullable();
            table.text('id_risque').notNullable();
            table.text('type_risque').notNullable();
            table.boolean('risque_desactive').notNullable();
            table.boolean('risque_avec_commentaire').notNullable();
            table.integer('risque_gravitee_initiale').notNullable();
            table.integer('risque_gravitee_surchargee').nullable();
        });


exports.down = async knex =>
    knex.schema.dropTable('journal_mss.donnees_risques_v2_service');
