// Les colonnes `donnees_origine` ne nous servent à rien en PROD.
// De plus, elles polluent les visualisations Metabase par défaut.
// Donc, on modifie les procédures stockées de chargement pour ne plus les alimenter.
// Ici, on scope également la procédure stockée sur les services "v1".

exports.up = knex => knex.raw(`

ALTER TABLE journal_mss.donnees_description_service DROP COLUMN donnees_origine;
ALTER TABLE journal_mss.donnees_description_service ADD COLUMN niveau_securite TEXT;
ALTER TABLE journal_mss.donnees_description_service ADD COLUMN niveau_securite_minimal TEXT;

CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_description_service()
LANGUAGE SQL
AS $$

TRUNCATE TABLE journal_mss.donnees_description_service;

INSERT INTO journal_mss.donnees_description_service (id_service,
                                            nb_entites_utilisatrices_borne_basse,
                                            nb_entites_utilisatrices_borne_haute,
                                            provenance_service,
                                            statut_deploiement,
                                            nb_points_acces,
                                            nb_fonctionnalites_specifiques,
                                            nb_donnees_caractere_personnel_specifiques,
                                            localisation_donnees,
                                            delai_avant_impact_critique,
                                            risque_juridique_financier_reputationnel,
                                            niveau_securite,
                                            niveau_securite_minimal,
                                            date)
SELECT DISTINCT donnees ->> 'idService',
                COALESCE((first_value(donnees -> 'nombreOrganisationsUtilisatrices' ->> 'borneBasse')
                          over par_service), '1')::integer,
                COALESCE((first_value(donnees -> 'nombreOrganisationsUtilisatrices' ->> 'borneHaute')
                          over par_service), '1')::integer,
                first_value(donnees ->> 'provenanceService') over par_service,
                first_value(donnees ->> 'statutDeploiement') over par_service,
                (first_value(donnees ->> 'pointsAcces') over par_service)::integer,
                (first_value(donnees ->> 'fonctionnalitesSpecifiques') over par_service)::integer,
                (first_value(donnees ->> 'donneesSensiblesSpecifiques') over par_service)::integer,
                first_value(donnees ->> 'localisationDonnees') over par_service,
                first_value(donnees ->> 'delaiAvantImpactCritique') over par_service,
                (first_value(donnees ->> 'risqueJuridiqueFinancierReputationnel') over par_service)::boolean,
                first_value(donnees ->> 'niveauSecurite') over par_service,
                first_value(donnees ->> 'niveauSecuriteMinimal') over par_service,
                first_value(date) over par_service
FROM journal_mss.evenements
WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
  AND (donnees->>'versionService' IS NULL OR donnees->>'versionService' = 'v1')
  AND donnees ->> 'idService' NOT IN
      (select donnees ->> 'idService' from journal_mss.evenements where type = 'SERVICE_SUPPRIME')
WINDOW par_service AS (partition by donnees ->> 'idService' order by date desc);

$$;


`);

exports.down = knex => knex.raw(`
  ALTER TABLE journal_mss.donnees_description_service ADD COLUMN donnees_origine JSONB;
  ALTER TABLE journal_mss.donnees_description_service DROP COLUMN niveau_securite;
  ALTER TABLE journal_mss.donnees_description_service DROP COLUMN niveau_securite_minimal;
  DROP PROCEDURE IF EXISTS journal_mss.charge_donnees_description_service();
`)

