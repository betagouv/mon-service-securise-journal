exports.up = async (knex) =>
    knex.schema
        .withSchema('journal_mss')
        .createTable('donnees_completude', table => {
          table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
          table.timestamp('date');
          table.text('id_service');
          table.integer('nombre_total_mesures');
          table.integer('nombre_mesures_completes');
          table.float('taux_completude');
          table.jsonb('donnees_origine');
        })

exports.down = async knex => knex.schema.dropTable('journal_mss.donnees_completude');
