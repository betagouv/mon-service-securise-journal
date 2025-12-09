CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_indice_cyber_tous_les_vendredis_sample_and_hold()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_indice_cyber_tous_les_vendredis_sample_and_hold;

INSERT INTO journal_mss.donnees_indice_cyber_tous_les_vendredis_sample_and_hold(id_service, indice, date)
WITH dates_avec_indices AS (
    SELECT
        jour::date,
        ids.id_service,
        indice
    FROM
        (SELECT distinct id_service from journal_mss.donnees_indice_cyber_hebdomadaire) ids
    -- 14 février 2023 est la date de début du monitoring d'indice cyber dans Metabase
    CROSS JOIN generate_series('2023-02-14'::date, (select max(date) from journal_mss.donnees_indice_cyber_hebdomadaire), '1 day'::interval) jour
    LEFT JOIN journal_mss.donnees_indice_cyber_hebdomadaire donnees on ids.id_service = donnees.id_service and jour::date = donnees.date::date
),
dates_avec_retenues AS (
     -- Pour faire du Sample and Hold qui fonctionne : https://stackoverflow.com/a/19012333/867600
     -- Si on utilise LAG() alors Postgres n'ignore pas les valeurs NULL donc le Sample and Hold ne fonctionne pas.
     SELECT
         id_service,
         jour,
         first_value(indice) over(partition by id_service, indice_malin) as indice_glissant
    FROM (
        -- Ici, on rajoute "1" à chaque fois que l'indice cyber évolue
        SELECT
            id_service,
            jour,
            indice,
            SUM(case when indice is null then 0 else 1 end) OVER (partition by id_service order by jour) AS indice_malin
        FROM dates_avec_indices a
    ) AS sommes_qui_evoluent
)
SELECT id_service, indice_glissant, jour
FROM dates_avec_retenues
WHERE EXTRACT(DOW FROM jour) = 5 -- conserve seulement les vendredis
  AND indice_glissant IS NOT NULL -- ignore les lignes sans donnée à la base

$$;
