exports.up = async knex =>
    knex.schema
        .withSchema('journal_mss')
        .createTable('donnees_collaboratif_service', table => {
          table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
          table.timestamp('date');
          table.text('id_service');
          table.text('id_utilisateur');
          table.text('droit');
          table.jsonb('donnees_origine');
        })


exports.down = async knex => knex.schema.dropTable('journal_mss.donnees_collaboratif_service');
