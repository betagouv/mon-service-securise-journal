CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_completude()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_completude;

INSERT INTO journal_mss.donnees_completude (id_service,
                                            nombre_total_mesures,
                                            nombre_mesures_completes,
                                            taux_completude,
                                            detail_indice_cyber,
                                            date)
SELECT DISTINCT donnees ->> 'idService',
                (first_value(donnees ->> 'nombreTotalMesures') over par_service_par_jour)::integer,
                (first_value(donnees ->> 'nombreMesuresCompletes') over par_service_par_jour)::integer,
                (first_value(donnees ->> 'nombreMesuresCompletes') over par_service_par_jour)::float
                    / (first_value(donnees ->> 'nombreTotalMesures') over par_service_par_jour)::float,
                first_value(donnees ->> 'detailIndiceCyber') over par_service_par_jour::jsonb,
                first_value(date) over par_service_par_jour
FROM journal_mss.vue_evenements_sans_services_supprimes
WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
WINDOW par_service_par_jour AS ( partition by donnees ->> 'idService', date::date order by date desc );

$$;

