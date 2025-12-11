CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_type_service()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_type_service;

INSERT INTO journal_mss.donnees_type_service (id_service, date, type_service)
WITH derniers_par_service AS (
    SELECT
    	id_service,
    	date,
        donnees -> 'typeService' as typesService
    FROM journal_mss.vue_tout_dernier_completude_par_service
    WHERE version_service IS NULL OR version_service = 'v1'
    AND donnees -> 'typeService' IS NOT NULL
)
SELECT id_service, date, type_service#>> '{}' -- #>> '{}' pour extraire la valeur sans les guillemets.
FROM derniers_par_service
cross join lateral jsonb_array_elements(typesService) as type_service;

$$;

