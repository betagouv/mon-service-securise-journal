exports.up = knex => knex.raw(`

CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_completude_premiere_fois_80()
LANGUAGE SQL
AS $$
      
    TRUNCATE TABLE journal_mss.donnees_completude_premiere_fois_80;
        
    INSERT INTO journal_mss.donnees_completude_premiere_fois_80 (id_service, pourcentage_completion, nombre_mesures_completes, nombre_total_mesures, indice_cyber, date)
    WITH
    tout_sauf_indice AS (
        SELECT DISTINCT
            first_value(id) over par_service as id_evenement,
            first_value(id_service) over par_service as id_service,
            (first_value(taux_completude) over par_service) * 100 as pourcentage_completion,
            first_value(nombre_mesures_completes) over par_service as nombre_mesures_completes,
            first_value(nombre_total_mesures) over par_service as nombre_total_mesures,
            first_value(date) over par_service as date
        FROM journal_mss.donnees_completude c
        WHERE taux_completude >= 0.8
        AND date > '2023-02-14' -- date à partir de laquelle on monitore l'indice cyber dans Metabase
        WINDOW par_service AS (PARTITION BY c.id_service ORDER BY date)
    ),
    indice AS (
        SELECT id as id_evenement, indice as indice_cyber
        FROM journal_mss.donnees_completude c,
         jsonb_to_recordset(donnees_origine->'detailIndiceCyber') as x(categorie text, indice float)
        WHERE categorie = 'total'
    )
    SELECT
        a.id_service,
        a.pourcentage_completion,
        a.nombre_mesures_completes,
        a.nombre_total_mesures,
        b.indice_cyber,
        a.date
    FROM tout_sauf_indice a JOIN indice b on a.id_evenement = b.id_evenement
    
$$;

`);

exports.down = knex => knex.raw(`
    DROP PROCEDURE IF EXISTS journal_mss.charge_donnees_completude_premiere_fois_80();
`)

