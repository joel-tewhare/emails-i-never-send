export async function seed(knex) {
  await knex('moods').insert([
    { id: 1, mood: 'Positive' },
    { id: 2, mood: 'Negative' },
  ])
}
