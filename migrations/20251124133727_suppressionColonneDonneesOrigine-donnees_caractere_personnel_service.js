// Les colonnes `donnees_origine` ne nous servent à rien en PROD.
// De plus, elles polluent les visualisations Metabase par défaut.
// Donc, on modifie les procédures stockées de chargement pour ne plus les alimenter.

exports.up = knex => knex.raw(`

ALTER TABLE journal_mss.donnees_caractere_personnel_service DROP COLUMN donnees_origine;

CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_caractere_personnel_service()
LANGUAGE SQL
AS $$

    TRUNCATE TABLE journal_mss.donnees_caractere_personnel_service;
    INSERT INTO journal_mss.donnees_caractere_personnel_service (
                                                      id_service,
                                                      date,
                                                      donnees_caractere_personnel
                                                )
    WITH donnees_caractere_personnel_par_service AS (
            SELECT DISTINCT
                e.donnees ->> 'idService' as id_service, 
                first_value(date) over par_service as date,
                first_value(e.donnees -> 'donneesCaracterePersonnel') over par_service as donneesCaracterePersonnel
            FROM journal_mss.evenements e 
            WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE' 
                AND e.donnees->>'donneesCaracterePersonnel' IS NOT NULL
                AND e.donnees ->> 'idService' NOT IN
                    (select donnees ->> 'idService' from journal_mss.evenements where type = 'SERVICE_SUPPRIME')
            WINDOW par_service AS (partition by e.donnees ->> 'idService' order by date desc))
    SELECT id_service, date, donnees_caractere_personnel
    FROM donnees_caractere_personnel_par_service
    cross join lateral jsonb_array_elements(donneesCaracterePersonnel) as donnees_caractere_personnel

$$;


`);

exports.down = knex => knex.raw(`
  ALTER TABLE journal_mss.donnees_caractere_personnel_service ADD COLUMN donnees_origine JSONB;
  DROP PROCEDURE IF EXISTS journal_mss.charge_donnees_caractere_personnel_service();
`);
