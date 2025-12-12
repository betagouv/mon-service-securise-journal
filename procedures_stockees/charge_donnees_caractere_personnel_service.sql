CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_caractere_personnel_service()
LANGUAGE SQL
AS
$$

    TRUNCATE TABLE journal_mss.donnees_caractere_personnel_service;

    INSERT INTO journal_mss.donnees_caractere_personnel_service (id_service, date, donnees_caractere_personnel)
    WITH dernieres_par_service AS (
        SELECT
            dernier.id_service,
            dernier.date,
            dernier.donnees->'donneesCaracterePersonnel' as donneesCaracterePersonnel
        FROM journal_mss.vue_tout_dernier_completude_par_service dernier
        WHERE dernier.version_service IS NULL OR dernier.version_service = 'v1'
        AND dernier.donnees->'donneesCaracterePersonnel' IS NOT NULL
    )
    SELECT id_service, date, donnees_caractere_personnel#>> '{}' -- #>> '{}' pour extraire la valeur sans les guillemets.
    FROM dernieres_par_service
    CROSS JOIN LATERAL jsonb_array_elements(donneesCaracterePersonnel) as donnees_caractere_personnel;

$$;



