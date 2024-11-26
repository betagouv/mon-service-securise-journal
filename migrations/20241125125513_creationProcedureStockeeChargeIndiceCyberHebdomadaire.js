exports.up = knex => knex.raw(`

CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_indice_cyber_hebdomadaire()
LANGUAGE SQL
AS $$
      
    TRUNCATE TABLE journal_mss.donnees_indice_cyber_hebdomadaire;
        
    INSERT INTO journal_mss.donnees_indice_cyber_hebdomadaire (id_service, indice, date)
    SELECT DISTINCT
        first_value(e.donnees ->> 'idService') over par_service_par_semaine as id_service,
        first_value(details."indice") over par_service_par_semaine as indice,
        first_value(e.date) over par_service_par_semaine as la_date
    FROM journal_mss.vue_evenements_sans_services_supprimes e,
         jsonb_to_recordset(donnees -> 'detailIndiceCyber') as details("categorie" text, "indice" float)
    WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
      AND details.categorie = 'total'
    WINDOW par_service_par_semaine AS (
        PARTITION BY e.donnees ->> 'idService', extract(year from e.date), extract(week from e.date)
        ORDER BY e.date DESC);

$$;

`);

exports.down = knex => knex.raw(`
    DROP PROCEDURE IF EXISTS journal_mss.charge_donnees_indice_cyber_hebdomadaire();
`)

