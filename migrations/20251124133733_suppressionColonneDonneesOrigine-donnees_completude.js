// Les colonnes `donnees_origine` ne nous servent à rien en PROD.
// De plus, elles polluent les visualisations Metabase par défaut.
// Donc, on modifie les procédures stockées de chargement pour ne plus les alimenter.

exports.up = knex => knex.raw(`

ALTER TABLE journal_mss.donnees_completude DROP COLUMN donnees_origine;

CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_completude()
LANGUAGE SQL
AS $$

TRUNCATE TABLE journal_mss.donnees_completude;

INSERT INTO journal_mss.donnees_completude (id_service,
                                            nombre_total_mesures,
                                            nombre_mesures_completes,
                                            taux_completude,
                                            date)
SELECT DISTINCT evenements.donnees ->> 'idService',
                (first_value(donnees ->> 'nombreTotalMesures') over par_service_par_jour)::integer,
                (first_value(donnees ->> 'nombreMesuresCompletes') over par_service_par_jour)::integer,
                (first_value(donnees ->> 'nombreMesuresCompletes') over par_service_par_jour)::float
                    / (first_value(donnees ->> 'nombreTotalMesures') over par_service_par_jour)::float,
                first_value(date) over par_service_par_jour
FROM journal_mss.evenements
WHERE evenements.type = 'COMPLETUDE_SERVICE_MODIFIEE'
  AND evenements.donnees ->> 'idService' NOT IN
      (select donnees ->> 'idService' from journal_mss.evenements where type = 'SERVICE_SUPPRIME')
WINDOW par_service_par_jour AS ( partition by evenements.donnees ->> 'idService', date::date order by date desc );

$$;

`);

exports.down = knex => knex.raw(`
  ALTER TABLE journal_mss.donnees_completude ADD COLUMN donnees_origine JSONB;
  DROP PROCEDURE IF EXISTS journal_mss.charge_donnees_completude();
`);

