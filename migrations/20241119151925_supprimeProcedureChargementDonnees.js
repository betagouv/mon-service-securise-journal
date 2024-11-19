exports.up = knex => knex.raw(`DROP PROCEDURE IF EXISTS journal_mss.charge_donnees();`)

exports.down = () => {}
