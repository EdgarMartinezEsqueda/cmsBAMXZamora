// El repositorio es público: la CLABE y la cuenta nunca se escriben en un archivo versionado.
// En una base nueva se toman de SEED_BANK_* (cms/.env); después se editan en el panel.
module.exports = async function seedBank(strapi) {
  const existing = await strapi.documents('api::bank-account.bank-account').findFirst({ status: 'draft' });
  if (existing) return { created: false, documentId: existing.documentId };
  const data = {
    bankName: (process.env.SEED_BANK_NAME || 'BANBAJÍO').trim(),
    clabe: (process.env.SEED_BANK_CLABE || '').trim(),
    accountNumber: (process.env.SEED_BANK_ACCOUNT || '').trim(),
  };
  if (!data.clabe || !data.accountNumber) {
    throw new Error('Faltan la CLABE o la cuenta: define SEED_BANK_CLABE y SEED_BANK_ACCOUNT en cms/.env, o créalos en el panel.');
  }
  const bank = await strapi.documents('api::bank-account.bank-account').create({ data, status: 'published' });
  return { created: true, documentId: bank.documentId };
};
