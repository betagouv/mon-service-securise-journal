exports.up = async (knex) =>
  knex.schema.alterTable("journal_mss.donnees_description_service", (table) => {
    table.text("niveau_securite");
  });

exports.down = async (knex) =>
  knex.schema.alterTable("journal_mss.donnees_description_service", (table) => {
    table.dropColumn("niveau_securite");
  });
