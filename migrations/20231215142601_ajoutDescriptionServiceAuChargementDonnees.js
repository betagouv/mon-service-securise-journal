exports.up = knex => knex.raw(`

CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees()
LANGUAGE SQL
AS $$

  CALL journal_mss.charge_donnees_completude();
  CALL journal_mss.charge_donnees_description_service();
      
  INSERT INTO journal_mss.technique_chargement_donnees(date_chargement) VALUES (now());
      
$$;

`);

exports.down = knex => knex.raw(`DROP PROCEDURE IF EXISTS journal_mss.charge_donnees();`)
