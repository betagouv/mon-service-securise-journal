exports.up = knex => knex.raw(`

CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_type_service()
LANGUAGE SQL
AS $$

    TRUNCATE TABLE journal_mss.donnees_type_service;
    INSERT INTO journal_mss.donnees_type_service (
                                                      id_service,
                                                      date,
                                                      type_service,
                                                      donnees_origine)
    WITH type_service_par_service AS (SELECT DISTINCT e.donnees ->> 'idService' as id_service, 
                                            first_value(date) over par_service as date,
                                            first_value(e.donnees -> 'typeService') over par_service as typesService,
                                            first_value(donnees) over par_service as donnees_origine
                                FROM journal_mss.evenements e 
                                WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE' 
                                    AND e.donnees->>'typeService' IS NOT NULL
                                    AND e.donnees ->> 'idService' NOT IN
                                        (select donnees ->> 'idService' from journal_mss.evenements where type = 'SERVICE_SUPPRIME')
                                WINDOW par_service AS (partition by e.donnees ->> 'idService' order by date desc))
    SELECT id_service, date, type_service, donnees_origine
    FROM type_service_par_service
             cross join lateral jsonb_array_elements(typesService) as type_service

$$;

`);

exports.down = knex => knex.raw(`DROP PROCEDURE IF EXISTS journal_mss.charge_donnees_type_service();`)

