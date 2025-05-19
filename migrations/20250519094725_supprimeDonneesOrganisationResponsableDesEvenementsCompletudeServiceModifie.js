exports.up = knex => knex.raw("update journal_mss.evenements SET donnees=donnees::jsonb #- '{organisationResponsable}' where type = 'COMPLETUDE_SERVICE_MODIFIEE';");

exports.down = _ => {
};
