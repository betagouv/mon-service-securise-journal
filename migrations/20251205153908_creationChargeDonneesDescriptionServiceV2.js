exports.up = knex => knex.raw(`

CREATE TABLE IF NOT EXISTS journal_mss.donnees_description_service_v2 (
    id UUID CONSTRAINT pk_donnees_description_service_v2 PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    id_service TEXT NOT NULL,
    nb_points_acces INTEGER NOT NULL,
    audience_cible TEXT NOT NULL,
    niveau_securite TEXT NOT NULL,
    niveau_securite_minimal TEXT NOT NULL,
    type_hebergement TEXT NOT NULL,
    ouverture_systeme TEXT NOT NULL,
    statut_deploiement TEXT NOT NULL,
    nb_total_mesures INTEGER NOT NULL,
    nb_mesures_completes INTEGER NOT NULL,
    nb_categories_donnees_traitees_supplementaires INTEGER NOT NULL,
    volumetrie_donnees_traitees TEXT NOT NULL,
    localisation_donnees_traitees TEXT NOT NULL,
    duree_dysfonctionnement_acceptable TEXT NOT NULL        
);

`);

exports.down = knex => knex.raw(`
    DROP TABLE IF EXISTS journal_mss.donnees_description_service_v2; 
`);
