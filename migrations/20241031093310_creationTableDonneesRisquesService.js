exports.up = async knex =>
    knex.schema
        .withSchema('journal_mss')
        .createTable('donnees_risques_service', table => {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.timestamp('date');
            table.text('id_service');
            table.text('id_risque');
            table.text('type_risque');
            table.text('niveau_gravite');
            table.text('niveau_vraisemblance');
            // On ne met pas de champ 'Catégorie' car pour les risques spécifiques il s'agit d'un tableau
            // Ça nous forcerait à faire une table dédiée pour modéliser correctement la relation 1-N
        })


exports.down = async knex => knex.schema.dropTable('journal_mss.donnees_risques_service');
