CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_description_service()
LANGUAGE SQL
AS
$$

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
SELECT
    id_service,
    COALESCE(donnees -> 'nombreOrganisationsUtilisatrices' ->> 'borneBasse', '1')::integer,
    COALESCE(donnees -> 'nombreOrganisationsUtilisatrices' ->> 'borneHaute', '1')::integer,
    donnees ->> 'provenanceService',
    donnees ->> 'statutDeploiement' ,
    (donnees ->> 'pointsAcces')::integer,
    (donnees ->> 'fonctionnalitesSpecifiques')::integer,
    (donnees ->> 'donneesSensiblesSpecifiques')::integer,
    donnees ->> 'localisationDonnees',
    donnees ->> 'delaiAvantImpactCritique',
    (donnees ->> 'risqueJuridiqueFinancierReputationnel')::boolean,
    donnees ->> 'niveauSecurite',
    donnees ->> 'niveauSecuriteMinimal',
    date
FROM journal_mss.vue_tout_dernier_completude_par_service
WHERE (version_service IS NULL OR version_service = 'v1');

$$;