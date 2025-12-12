const vue = `journal_mss.vue_tout_dernier_completude_par_service`;

exports.up = knex => knex.raw(`CREATE OR REPLACE VIEW ${vue} AS 
  
    SELECT DISTINCT
        v.donnees ->> 'idService' as id_service,
        first_value(v.donnees->>'versionService') over par_service as version_service,
        first_value(v.date) over par_service as date,
        first_value(v.donnees) over par_service as donnees
    FROM journal_mss.vue_evenements_sans_services_supprimes v
    WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
    WINDOW par_service AS (partition by v.donnees ->> 'idService' order by v.date desc) 

;`);

exports.down = knex => knex.raw(`DROP VIEW IF EXISTS ${vue};`)
