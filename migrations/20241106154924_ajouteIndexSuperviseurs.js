exports.up = async knex =>
    knex.schema.alterTable('journal_mss.superviseurs', table => {
        table.unique(['id_superviseur', 'id_service', 'siret_service']);
    });

exports.down = async knex =>
    knex.schema.alterTable('journal_mss.superviseurs', table => {
        table.dropUnique(['id_superviseur', 'id_service', 'siret_service'])
    });
