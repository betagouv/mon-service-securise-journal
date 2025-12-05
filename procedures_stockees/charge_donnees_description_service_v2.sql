CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_description_service_v2()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_description_service_v2;

INSERT INTO journal_mss.donnees_description_service_v2 (id_service,
                                                        nb_points_acces,
                                                        audience_cible,
                                                        niveau_securite,
                                                        niveau_securite_minimal,
                                                        type_hebergement,
                                                        ouverture_systeme,
                                                        statut_deploiement,
                                                        nb_total_mesures,
                                                        nb_mesures_completes,
                                                        nb_categories_donnees_traitees_supplementaires,
                                                        volumetrie_donnees_traitees,
                                                        localisation_donnees_traitees,
                                                        duree_dysfonctionnement_acceptable,
                                                        date)
SELECT DISTINCT
    donnees ->> 'idService',
    first_value(donnees ->> 'pointsAcces') over par_service:: integer,
    first_value(donnees ->> 'audienceCible') over par_service,
    first_value(donnees ->> 'niveauSecurite') over par_service,
    first_value(donnees ->> 'niveauSecuriteMinimal') over par_service,
    first_value(donnees ->> 'typeHebergement') over par_service,
    first_value(donnees ->> 'ouvertureSysteme') over par_service,
    first_value(donnees ->> 'statutDeploiement') over par_service,
    first_value(donnees ->> 'nombreTotalMesures') over par_service:: integer,
    first_value(donnees ->> 'nombreMesuresCompletes') over par_service:: integer,
    first_value(donnees ->> 'categoriesDonneesTraiteesSupplementaires') over par_service:: integer,
    first_value(donnees ->> 'volumetrieDonneesTraitees') over par_service,
    first_value(donnees ->> 'localisationDonneesTraitees') over par_service,
    first_value(donnees ->> 'dureeDysfonctionnementAcceptable') over par_service,
    first_value(date) over par_service
FROM journal_mss.evenements
WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
  AND (donnees->>'versionService' = 'v2')
  AND donnees ->> 'idService' NOT IN (select donnees ->> 'idService'
                                      from journal_mss.evenements
                                      where type = 'SERVICE_SUPPRIME')
WINDOW par_service AS (partition by donnees ->> 'idService' order by date desc)

$$;