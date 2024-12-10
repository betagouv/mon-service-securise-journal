exports.up = knex => knex.raw(`
    CREATE TABLE IF NOT EXISTS journal_mss.donnees_completude_premiere_fois_80 (
        id UUID CONSTRAINT pk_donnees_completude_premiere_fois_80 PRIMARY KEY DEFAULT gen_random_uuid(),
        id_service VARCHAR(128) NOT NULL,
        pourcentage_completion REAL NOT NULL,
        nombre_mesures_completes INT NOT NULL,
        nombre_total_mesures INT NOT NULL,
        indice_cyber REAL NOT NULL,
        date TIMESTAMP NOT NULL 
    );
`);

exports.down = knex => knex.raw(`
    DROP TABLE IF EXISTS journal_mss.donnees_completude_premiere_fois_80; 
`);
