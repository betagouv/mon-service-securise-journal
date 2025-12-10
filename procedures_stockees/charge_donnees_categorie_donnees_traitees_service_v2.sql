CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_categorie_donnees_traitees_service_v2()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_categorie_donnees_traitees_service_v2;

INSERT INTO journal_mss.donnees_categorie_donnees_traitees_service_v2 (id_service, date, categorie_donnees_traitees)
WITH categorie_donnees_traitees_par_service AS (
    SELECT DISTINCT
        donnees ->> 'idService' as id_service,
        first_value(date) over par_service as date,
        first_value(donnees -> 'categoriesDonneesTraitees') over par_service as categoriesDonneesTraitees
    FROM journal_mss.evenements
    WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
      AND donnees->>'categoriesDonneesTraitees' IS NOT NULL
      AND (donnees->>'versionService' = 'v2')
      AND donnees ->> 'idService' NOT IN (select donnees ->> 'idService'
                                          from journal_mss.evenements
                                          where type = 'SERVICE_SUPPRIME')
    WINDOW par_service AS (partition by donnees ->> 'idService' order by date desc)
)
SELECT id_service, date, categorie_donnees_traitees#>> '{}' -- #>> '{}' pour extraire la valeur sans les guillemets.
FROM categorie_donnees_traitees_par_service
CROSS JOIN LATERAL jsonb_array_elements(categoriesDonneesTraitees) AS categorie_donnees_traitees;

$$;