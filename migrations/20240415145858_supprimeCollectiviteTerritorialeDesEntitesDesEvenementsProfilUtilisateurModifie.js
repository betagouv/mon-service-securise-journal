exports.up = knex => knex.raw("update journal_mss.evenements SET donnees=donnees::jsonb #- '{entite,collectiviteTerritoriale}' where type = 'PROFIL_UTILISATEUR_MODIFIE';");

exports.down = _ => {
};
