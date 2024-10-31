exports.up = knex => knex.raw(`

CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_risques()
LANGUAGE SQL
AS $$

    TRUNCATE TABLE journal_mss.donnees_risques_service;
    
    -- D'abord, insertion des risques généraux
    
    INSERT INTO journal_mss.donnees_risques_service (
                                                      id_service,
                                                      id_risque,
                                                      niveau_gravite,
                                                      niveau_vraisemblance, 
                                                      type_risque,
                                                      date)
        WITH evenements_risques_generaux AS (SELECT donnees ->> 'idService' AS id_service,
                                            rg."id"      AS id_risque,
                                            rg."niveauGravite" as niveau_gravite,
                                            rg."niveauVraisemblance" as niveau_vraisemblance,
                                            date
                                     FROM journal_mss.evenements,
                                          jsonb_to_recordset(donnees -> 'risquesGeneraux')
                                              AS rg("id" text, "niveauGravite" text, "niveauVraisemblance" text)
                                     WHERE type = 'RISQUES_SERVICE_MODIFIES'
                                       AND (NULLIF(rg."niveauGravite", '') IS NOT NULL OR NULLIF(rg."niveauVraisemblance", '')  IS NOT NULL)
        ),
             derniers_evenements AS (
                 SELECT distinct
                     id_service,
                     id_risque,
                     niveau_gravite,
                     niveau_vraisemblance,
                     'general' as type_risque,
                     date
                 FROM evenements_risques_generaux a
                 WHERE date = (SELECT MAX(date) from evenements_risques_generaux b where a.id_service = b.id_service)
             )
        SELECT * from derniers_evenements;
    
    -- Puis, insertion des risques spécifiques
    
    INSERT INTO journal_mss.donnees_risques_service (
                                                      id_service,
                                                      id_risque,
                                                      niveau_gravite,
                                                      niveau_vraisemblance, 
                                                      type_risque,
                                                      date)
    WITH evenements_risques_specifiques AS (SELECT donnees ->> 'idService' AS id_service,
                                            rs."id"      AS id_risque,
                                            rs."niveauGravite" as niveau_gravite,
                                            rs."niveauVraisemblance" as niveau_vraisemblance,
                                            date
                                     FROM journal_mss.evenements,
                                          jsonb_to_recordset(donnees -> 'risquesSpecifiques')
                                              AS rs("id" text, "niveauGravite" text, "niveauVraisemblance" text)
                                     WHERE type = 'RISQUES_SERVICE_MODIFIES'
                                       AND (NULLIF(rs."niveauGravite", '') IS NOT NULL OR NULLIF(rs."niveauVraisemblance", '')  IS NOT NULL)
        ),
             derniers_evenements AS (
                 SELECT distinct
                     id_service,
                     id_risque,
                     niveau_gravite,
                     niveau_vraisemblance,
                     'specifique' as type_risque,
                     date
                 FROM evenements_risques_specifiques a
                 WHERE date = (SELECT MAX(date) from evenements_risques_specifiques b where a.id_service = b.id_service)
             )
        SELECT * from derniers_evenements;
    
$$;

`);

exports.down = knex => knex.raw(`DROP PROCEDURE IF EXISTS journal_mss.charge_donnees_risques();`)

