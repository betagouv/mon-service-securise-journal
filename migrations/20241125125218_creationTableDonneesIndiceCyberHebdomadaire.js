exports.up = knex => knex.raw(`
    CREATE TABLE IF NOT EXISTS journal_mss.donnees_indice_cyber_hebdomadaire (
        id UUID CONSTRAINT pk_donnees_indice_cyber_hebdomadaire PRIMARY KEY DEFAULT gen_random_uuid(),
        id_service VARCHAR(128) NOT NULL,
        indice REAL NOT NULL,
        date TIMESTAMP NOT NULL 
    );
`);

exports.down = knex => knex.raw(`
    DROP TABLE IF EXISTS journal_mss.donnees_indice_cyber_hebdomadaire; 
`);
