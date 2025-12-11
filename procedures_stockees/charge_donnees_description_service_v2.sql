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
SELECT
    id_service,
    (donnees ->> 'pointsAcces')::integer,
    donnees ->> 'audienceCible',
    donnees ->> 'niveauSecurite',
    donnees ->> 'niveauSecuriteMinimal',
    donnees ->> 'typeHebergement',
    donnees ->> 'ouvertureSysteme',
    donnees ->> 'statutDeploiement',
    (donnees ->> 'nombreTotalMesures')::integer,
    (donnees ->> 'nombreMesuresCompletes')::integer,
    (donnees ->> 'categoriesDonneesTraiteesSupplementaires')::integer,
    donnees ->> 'volumetrieDonneesTraitees',
    donnees ->> 'localisationDonneesTraitees',
    donnees ->> 'dureeDysfonctionnementAcceptable',
    date
FROM journal_mss.vue_tout_dernier_completude_par_service
WHERE version_service = 'v2';

$$;