CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_statuts_des_mesures()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_statuts_des_mesures;

INSERT INTO journal_mss.donnees_statuts_des_mesures (id_service, version_service, id_mesure, statut, date)
WITH versions_actuelles_des_services AS (
    SELECT DISTINCT
        donnees ->> 'idService' as id_service,
        COALESCE(first_value(donnees ->> 'versionService') over par_service, 'v1') as version_service
    FROM journal_mss.evenements e
    WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
    WINDOW par_service AS (partition by e.donnees ->> 'idService' order by date desc)
),
-- On veut seulement garder les lignes correspondant à la version actuelle :
-- on écarte les éventuelles lignes "pré-migration".
les_completudes_de_la_version_actuelle AS (
    SELECT
        actuelle.id_service,
        actuelle.version_service as version_actuelle,
        donnees -> 'detailMesures' as details_mesures,
        e.date
    FROM journal_mss.evenements e
             JOIN versions_actuelles_des_services actuelle on actuelle.id_service = e.donnees->>'idService'
    WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
      AND actuelle.version_service = COALESCE(donnees ->> 'versionService', 'v1')
),
mesures_mises_a_plat AS (
    SELECT
        id_service,
        version_actuelle,
        details."idMesure" as id_mesure,
        details.statut,
        date
    FROM les_completudes_de_la_version_actuelle,
         jsonb_to_recordset(details_mesures) AS details("idMesure" text, "statut" text)
)
SELECT DISTINCT
    id_service,
    version_actuelle,
    id_mesure,
    statut,
    first_value(date) over par_service_mesure_statut as date
FROM mesures_mises_a_plat
WINDOW par_service_mesure_statut AS (partition by id_service, id_mesure, statut order by date);

$$;

