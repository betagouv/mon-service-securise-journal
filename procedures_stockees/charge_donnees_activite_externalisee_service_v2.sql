CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_activite_externalisee_service_v2()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_activite_externalisee_service_v2;

INSERT INTO journal_mss.donnees_activite_externalisee_service_v2 (id_service, date, activite_externalisee)
WITH dernieres_activites_par_service AS (
    SELECT
        dernier.id_service,
        dernier.date,
        dernier.donnees->'activitesExternalisees' as activitesExternalisees
    FROM journal_mss.vue_tout_dernier_completude_par_service dernier
    WHERE dernier.version_service = 'v2'
    AND dernier.donnees->'activitesExternalisees' IS NOT NULL
)
SELECT id_service, date, activite_externalisee#>> '{}' -- #>> '{}' pour extraire la valeur sans les guillemets.
FROM dernieres_activites_par_service
CROSS JOIN LATERAL jsonb_array_elements(activitesExternalisees) AS activite_externalisee;

$$;