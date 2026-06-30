CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_risques_v2()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_risques_v2_service;

-- Insertion des risques généraux du dernier événement de chaque service
INSERT INTO journal_mss.donnees_risques_v2_service (
    id_service,
    id_risque,
    type_risque,
    risque_desactive,
    risque_avec_commentaire,
    risque_gravitee_surchargee,
    risque_gravitee_initiale)
WITH dernier_evenement_par_service AS (
    SELECT DISTINCT ON (donnees ->> 'idService')
        donnees ->> 'idService' AS id_service,
        donnees
    FROM journal_mss.vue_evenements_sans_services_supprimes
    WHERE type = 'RISQUES_V2_SERVICE_MODIFIES'
    ORDER BY donnees ->> 'idService', date DESC
)
SELECT
    e.id_service,
    rg."id",
    'general',
    rg."desactive",
    rg."avecCommentaire",
    rg."valeurGraviteSurchargee",
    rg."valeurGraviteCalculee"
FROM dernier_evenement_par_service e,
    jsonb_to_recordset(e.donnees -> 'risquesGeneraux')
        AS rg("id" text, "desactive" boolean, "avecCommentaire" boolean, "valeurGraviteCalculee" integer, "valeurGraviteSurchargee" integer);

-- Insertion des risques spécifiques du dernier événement de chaque service
INSERT INTO journal_mss.donnees_risques_v2_service (
    id_service,
    id_risque,
    type_risque,
    risque_desactive,
    risque_avec_commentaire,
    risque_gravitee_surchargee,
    risque_gravitee_initiale)
WITH dernier_evenement_par_service AS (
    SELECT DISTINCT ON (donnees ->> 'idService')
        donnees ->> 'idService' AS id_service,
        donnees
    FROM journal_mss.vue_evenements_sans_services_supprimes
    WHERE type = 'RISQUES_V2_SERVICE_MODIFIES'
    ORDER BY donnees ->> 'idService', date DESC
)
SELECT
    e.id_service,
    rs."id",
    'specifique',
    false,
    rs."avecCommentaire",
    rs."valeurGravite",
    rs."valeurGraviteBrute"
FROM dernier_evenement_par_service e,
    jsonb_to_recordset(e.donnees -> 'risquesSpecifiques')
        AS rs("id" text, "avecCommentaire" boolean, "valeurGravite" integer, "valeurGraviteBrute" integer);

$$;
