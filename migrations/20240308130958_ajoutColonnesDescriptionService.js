exports.up = async knex =>
    knex.schema.alterTable('journal_mss.donnees_description_service', table => {
        table.text('provenance_service')
        table.text('statut_deploiement')
        table.integer('nb_points_acces')
        table.integer('nb_fonctionnalites_specifiques')
        table.integer('nb_donnees_caractere_personnel_specifiques')
        table.text('localisation_donnees')
        table.text('delai_avant_impact_critique')
        table.boolean('risque_juridique_financier_reputationnel')
    });

exports.down = async knex =>
    knex.schema.alterTable('journal_mss.donnees_description_service', table => {
        table.dropColumn('provenance_service')
        table.dropColumn('statut_deploiement')
        table.dropColumn('nb_points_acces')
        table.dropColumn('nb_fonctionnalites_specifiques')
        table.dropColumn('nb_donnees_caractere_personnel_specifiques')
        table.dropColumn('localisation_donnees')
        table.dropColumn('delai_avant_impact_critique')
        table.dropColumn('risque_juridique_financier_reputationnel')
    });
