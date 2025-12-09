CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_caractere_personnel_service()
LANGUAGE SQL
AS
$$

    TRUNCATE TABLE journal_mss.donnees_caractere_personnel_service;

    INSERT INTO journal_mss.donnees_caractere_personnel_service (
         id_service,
         date,
         donnees_caractere_personnel)
    WITH donnees_caractere_personnel_par_service AS (
        SELECT DISTINCT
            donnees ->> 'idService' as id_service,
            first_value(date) over par_service as date,
            first_value(donnees -> 'donneesCaracterePersonnel') over par_service as donneesCaracterePersonnel
        FROM journal_mss.evenements
        WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
        AND donnees->>'donneesCaracterePersonnel' IS NOT NULL
        AND donnees ->> 'idService' NOT IN
            (select donnees ->> 'idService' from journal_mss.evenements where type = 'SERVICE_SUPPRIME')
        WINDOW par_service AS (partition by donnees ->> 'idService' order by date desc)
    )
    SELECT id_service, date, donnees_caractere_personnel
    FROM donnees_caractere_personnel_par_service
    CROSS JOIN LATERAL jsonb_array_elements(donneesCaracterePersonnel) as donnees_caractere_personnel

$$;



