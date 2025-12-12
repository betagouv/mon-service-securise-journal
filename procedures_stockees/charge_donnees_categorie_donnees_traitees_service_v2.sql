CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_categorie_donnees_traitees_service_v2()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_categorie_donnees_traitees_service_v2;

INSERT INTO journal_mss.donnees_categorie_donnees_traitees_service_v2 (id_service, date, categorie_donnees_traitees)
WITH dernieres_par_service AS (
    SELECT
        dernier.id_service,
        dernier.date,
        dernier.donnees->'categoriesDonneesTraitees' as categoriesDonneesTraitees
    FROM journal_mss.vue_tout_dernier_completude_par_service dernier
    WHERE version_service = 'v2'
    AND dernier.donnees->'categoriesDonneesTraitees' IS NOT NULL
)
SELECT id_service, date, categorie_donnees_traitees#>> '{}' -- #>> '{}' pour extraire la valeur sans les guillemets.
FROM dernieres_par_service
CROSS JOIN LATERAL jsonb_array_elements(categoriesDonneesTraitees) AS categorie_donnees_traitees;

$$;