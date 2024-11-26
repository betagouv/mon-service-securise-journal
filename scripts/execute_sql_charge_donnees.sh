#! /bin/bash -l

# Ce script est lancé par le crontab dédié à Clever Cloud.
# Il permet au process node d'avoir accès aux variables d'env
# https://developers.clever-cloud.com/doc/administrate/cron/#access-environment-variables

# On ne veut pas exécuter les CRON depuis une instance spawnée à cause d'un scaling.
# https://developers.clever-cloud.com/doc/administrate/cron/#deduplicating-crons
if [[ "$INSTANCE_NUMBER" != "0" ]]; then
  echo "L'instance n'est pas la 0, c'est la ${INSTANCE_NUMBER}. On s'arrête là."
  exit 0
fi

psql -d "$URL_SERVEUR_BASE_DONNEES" <<SQL

  CALL journal_mss.charge_donnees_completude();
  CALL journal_mss.charge_donnees_description_service();
  CALL journal_mss.charge_donnees_collaboratif_service();
  CALL journal_mss.charge_donnees_type_service();
  CALL journal_mss.charge_donnees_fonctionnalite_service();
  CALL journal_mss.charge_donnees_caractere_personnel_service();
  CALL journal_mss.charge_donnees_statuts_des_mesures();
  CALL journal_mss.charge_donnees_risques();
  CALL journal_mss.charge_donnees_indice_cyber_courant();
  CALL journal_mss.charge_donnees_indice_cyber_hebdomadaire();

  INSERT INTO journal_mss.technique_chargement_donnees(date_chargement) VALUES (now());

SQL