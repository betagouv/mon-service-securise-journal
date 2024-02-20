exports.up = knex => knex.raw(`

CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_collaboratif_service()
LANGUAGE SQL
AS $$

    TRUNCATE TABLE journal_mss.donnees_collaboratif_service;
    INSERT INTO journal_mss.donnees_collaboratif_service (
                                                      id_service,
                                                      id_utilisateur,
                                                      droit,
                                                      date,
                                                      donnees_origine)
    WITH autorisations_par_service AS (SELECT DISTINCT e.donnees ->> 'idService' as id_service,
                                                   first_value(e.donnees -> 'autorisations') over par_service as autorisations,
                                                   first_value(date) over par_service as date,
                                                   first_value(e.donnees) over par_service as donnees_origine
                                   FROM journal_mss.evenements as e
                                   where e.type = 'COLLABORATIF_SERVICE_MODIFIE'
                                     AND e.donnees ->> 'idService' NOT IN
                                         (select donnees ->> 'idService'
                                          from journal_mss.evenements
                                          where type = 'SERVICE_SUPPRIME')
                                   WINDOW par_service AS (partition by e.donnees ->> 'idService' order by date desc))
    SELECT id_service,
           une_autorisation ->> 'idUtilisateur' as id_utilisateur,
           une_autorisation ->> 'droit'         as droit,
           date,
           donnees_origine
    FROM autorisations_par_service
             cross join lateral jsonb_array_elements(autorisations) as une_autorisation

$$;

`);

exports.down = knex => knex.raw(`DROP PROCEDURE IF EXISTS journal_mss.charge_donnees_collaboratif_service();`)

