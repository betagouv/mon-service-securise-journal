CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_specificite_projet_service_v2()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_specificite_projet_service_v2;

INSERT INTO journal_mss.donnees_specificite_projet_service_v2 (id_service, date, specificite_projet)
WITH dernieres_par_service AS (
    SELECT
    	id_service,
    	date,
        donnees -> 'specificitesProjet' as specificitesProjet
    FROM journal_mss.vue_tout_dernier_completude_par_service
    WHERE version_service = 'v2'
    AND donnees -> 'specificitesProjet' IS NOT NULL
)
SELECT id_service, date, specificite_projet#>> '{}' -- #>> '{}' pour extraire la valeur sans les guillemets.
FROM dernieres_par_service
CROSS JOIN LATERAL jsonb_array_elements(specificitesProjet) AS specificite_projet;

$$;