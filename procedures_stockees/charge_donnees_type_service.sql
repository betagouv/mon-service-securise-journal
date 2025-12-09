CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_type_service()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_type_service;

INSERT INTO journal_mss.donnees_type_service (id_service, date, type_service)
WITH type_service_par_service AS (
    SELECT DISTINCT
        donnees ->> 'idService' as id_service,
        first_value(date) over par_service as date,
        first_value(donnees -> 'typeService') over par_service as typesService
    FROM journal_mss.evenements
    WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
    AND donnees->>'typeService' IS NOT NULL
    AND (donnees->>'versionService' IS NULL OR donnees->>'versionService' = 'v1')
    AND donnees ->> 'idService' NOT IN
        (select donnees ->> 'idService' from journal_mss.evenements where type = 'SERVICE_SUPPRIME')
    WINDOW par_service AS (partition by donnees ->> 'idService' order by date desc)
)
SELECT id_service, date, type_service
FROM type_service_par_service
cross join lateral jsonb_array_elements(typesService) as type_service

$$;

