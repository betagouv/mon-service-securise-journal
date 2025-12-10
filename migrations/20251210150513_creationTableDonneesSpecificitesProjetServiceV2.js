exports.up = knex => knex.raw(`

CREATE TABLE IF NOT EXISTS journal_mss.donnees_specificite_projet_service_v2 (
    id UUID CONSTRAINT pk_donnees_specificite_projet_service_v2 PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    id_service TEXT NOT NULL,
    specificite_projet TEXT NOT NULL        
);

`);

exports.down = knex => knex.raw(`
    DROP TABLE IF EXISTS journal_mss.donnees_specificite_projet_service_v2; 
`);
