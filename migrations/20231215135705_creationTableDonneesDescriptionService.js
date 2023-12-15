exports.up = async (knex) =>
    knex.schema
        .withSchema('journal_mss')
        .createTable('donnees_description_service', table => {
          table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
          table.timestamp('date');
          table.text('id_service');
          table.integer('nb_entites_utilisatrices_borne_basse');
          table.integer('nb_entites_utilisatrices_borne_haute');
          table.jsonb('donnees_origine');
        })

exports.down = async knex => knex.schema.dropTable('journal_mss.donnees_description_service');
