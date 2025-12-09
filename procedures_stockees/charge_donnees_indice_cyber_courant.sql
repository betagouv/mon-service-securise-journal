CREATE OR REPLACE PROCEDURE journal_mss.charge_donnees_indice_cyber_courant()
LANGUAGE SQL
AS
$$

TRUNCATE TABLE journal_mss.donnees_indice_cyber_courant;

INSERT INTO journal_mss.donnees_indice_cyber_courant (id_service, categorie, indice, date)
SELECT DISTINCT ON (donnees ->> 'idService', details.categorie)
    donnees->>'idService' as id_service,
    details."categorie",
    details."indice",
    date
FROM journal_mss.vue_evenements_sans_services_supprimes,
     jsonb_to_recordset(donnees -> 'detailIndiceCyber') as details("categorie" text, "indice" float)
WHERE type = 'COMPLETUDE_SERVICE_MODIFIEE'
ORDER BY donnees ->> 'idService', details.categorie, date DESC;

$$;
