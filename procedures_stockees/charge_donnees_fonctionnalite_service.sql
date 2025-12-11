CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_fonctionnalite_service()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_fonctionnalite_service;

INSERT INTO journal_mss.donnees_fonctionnalite_service (id_service, date, fonctionnalite)
WITH dernieres_par_service AS (
    SELECT
    	id_service,
    	date,
        donnees -> 'fonctionnalites' as fonctionnalites
    FROM journal_mss.vue_tout_dernier_completude_par_service
    WHERE version_service = 'v1'
    AND donnees->>'fonctionnalites' IS NOT NULL
)
SELECT id_service, date, fonctionnalite#>> '{}' -- #>> '{}' pour extraire la valeur sans les guillemets.
FROM dernieres_par_service
cross join lateral jsonb_array_elements(fonctionnalites) as fonctionnalite;

$$;
