exports.up = knex => knex.raw(`

CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_description_service()
LANGUAGE SQL
AS $$

TRUNCATE TABLE journal_mss.donnees_description_service;

INSERT INTO journal_mss.donnees_description_service (id_service,
                                            nb_entites_utilisatrices_borne_basse,
                                            nb_entites_utilisatrices_borne_haute,
                                            date,
                                            donnees_origine)
SELECT DISTINCT evenements.donnees ->> 'idService',
                COALESCE((first_value(donnees -> 'nombreOrganisationsUtilisatrices' ->> 'borneBasse')
                          over par_service_par_jour), '1')::integer,
                COALESCE((first_value(donnees -> 'nombreOrganisationsUtilisatrices' ->> 'borneHaute')
                          over par_service_par_jour), '1')::integer,
                first_value(date) over par_service_par_jour,
                first_value(donnees) over par_service_par_jour
FROM journal_mss.evenements
WHERE evenements.type = 'COMPLETUDE_SERVICE_MODIFIEE'
  AND evenements.donnees ->> 'idService' NOT IN
      (select donnees ->> 'idService' from journal_mss.evenements where type = 'SERVICE_SUPPRIME')
WINDOW par_service_par_jour AS ( partition by evenements.donnees ->> 'idService', date::date order by date desc );

$$;

`);

exports.down = knex => knex.raw(`DROP PROCEDURE IF EXISTS journal_mss.charge_donnees_description_service();`)

