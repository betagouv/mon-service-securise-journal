exports.up = knex => {
  return knex.schema
      .withSchema('journal_mss')
      .createTable('evenements', table => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.timestamp('date');
        table.text('type');
        table.jsonb('donnees')
      })
};

exports.down = knex => {
  return knex.schema.dropTable('journal_mss.evenements')
};
