const faunadb = require('faunadb');
const q = faunadb.query;

const client = new faunadb.Client({
  secret: 'fnAEtTyGAVAA0XM9V0dl-KQKcNtXEkzPPGkl4hrj',
  domain: 'db.eu.fauna.com',
})

module.exports = {
  client,
  q
}
