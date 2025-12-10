CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_specificite_projet_service_v2()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_specificite_projet_service_v2;

INSERT INTO journal_mss.donnees_specificite_projet_service_v2 (id_service, date, specificite_projet)
WITH specificite_projet_par_service AS (
    SELECT DISTINCT
        donnees ->> 'idService' as id_service,
        first_value(date) over par_service as date,
        first_value(donnees -> 'specificitesProjet') over par_service as specificitesProjet
    FROM journal_mss.evenements
    WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
      AND donnees->>'specificitesProjet' IS NOT NULL
      AND (donnees->>'versionService' = 'v2')
      AND donnees ->> 'idService' NOT IN (select donnees ->> 'idService'
                                          from journal_mss.evenements
                                          where type = 'SERVICE_SUPPRIME')
    WINDOW par_service AS (partition by donnees ->> 'idService' order by date desc)
)
SELECT id_service, date, specificite_projet#>> '{}' -- #>> '{}' pour extraire la valeur sans les guillemets.
FROM specificite_projet_par_service
CROSS JOIN LATERAL jsonb_array_elements(specificitesProjet) AS specificite_projet;

$$;