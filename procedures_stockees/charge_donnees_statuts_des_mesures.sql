CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_statuts_des_mesures()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_statuts_des_mesures;

INSERT INTO journal_mss.donnees_statuts_des_mesures (
    id_service,
    id_mesure,
    statut,
    date)
WITH tous_les_evenements AS (
    SELECT
        donnees ->> 'idService' AS id_service,
        details."idMesure"      AS id_mesure,
        details."statut",
        date
    FROM journal_mss.evenements,
      jsonb_to_recordset(donnees -> 'detailMesures') AS details("idMesure" text, "statut" text)
    WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
    AND donnees ->> 'idService' NOT IN
       (select donnees ->> 'idService' from journal_mss.evenements where type = 'SERVICE_SUPPRIME')
    AND (donnees->>'versionService' IS NULL OR donnees->>'versionService' = 'v1')
)
SELECT DISTINCT
    id_service,
    id_mesure,
    statut,
    first_value(date) over par_service_mesure_statut as date
FROM tous_les_evenements
WINDOW par_service_mesure_statut AS (partition by id_service, id_mesure, statut order by date);

$$;

