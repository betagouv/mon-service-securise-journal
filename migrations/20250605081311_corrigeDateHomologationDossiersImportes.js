const chaineDateFrEnChaineDateISO = (chaineDateFr) => {
  const [jour, mois, annee] = chaineDateFr.split('/');
  return `${annee}-${mois}-${jour}`;
};

const estDateEnFrancais = (chaineDate) =>
  /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/.test(chaineDate);

exports.up = async (knex) => {
  await knex.transaction(async (trx) => {
    const evenementsAMigrer = await trx('journal_mss.evenements')
      .where({type: 'NOUVELLE_HOMOLOGATION_CREEE'})
      .whereRaw("(donnees->>'importe')::boolean=true");

    const maj = evenementsAMigrer.map(async ({id, donnees}) => {
      const nouvellesDonnees = {
        ...donnees,
        dateHomologation: estDateEnFrancais(donnees.dateHomologation) ? chaineDateFrEnChaineDateISO(donnees.dateHomologation) : donnees.dateHomologation,
      };

      return trx('journal_mss.evenements')
        .where({id})
        .update({donnees: nouvellesDonnees});
    });

    await Promise.all(maj);
  });
};

exports.down = async () => {
};
