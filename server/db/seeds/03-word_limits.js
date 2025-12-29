export async function seed(knex) {
  await knex('word_limits').insert([
    { id: 1, word_limit: 150 },
    { id: 2, word_limit: 200 },
    { id: 3, word_limit: 250 },
  ])
}
