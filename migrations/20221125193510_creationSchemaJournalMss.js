exports.up = knex => {
  return knex.schema.raw('CREATE SCHEMA journal_mss')
};

exports.down = knex => {
  return knex.schema.dropSchema('journal_mss', true)
};
