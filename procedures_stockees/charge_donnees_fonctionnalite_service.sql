CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_fonctionnalite_service()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_fonctionnalite_service;

INSERT INTO journal_mss.donnees_fonctionnalite_service (id_service, date, fonctionnalite)
WITH fonctionnalite_par_service AS (
    SELECT DISTINCT donnees->>'idService' as id_service,
                    first_value(date) over par_service as date,
                    first_value(donnees -> 'fonctionnalites') over par_service as fonctionnalites
    FROM journal_mss.evenements e
    WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
      AND donnees->>'fonctionnalites' IS NOT NULL
      AND donnees->>'idService' NOT IN
          (select donnees->>'idService' from journal_mss.evenements where type = 'SERVICE_SUPPRIME')
    WINDOW par_service AS (partition by donnees->>'idService' order by date desc)
)
SELECT id_service, date, fonctionnalite
FROM fonctionnalite_par_service
cross join lateral jsonb_array_elements(fonctionnalites) as fonctionnalite

$$;
