export async function seed(knex) {
  await knex('time_limits').insert([
    { id: 1, time_limit: 'Off' },
    { id: 2, time_limit: '5 minutes' },
    { id: 3, time_limit: '10 minutes' },
    { id: 4, time_limit: '15 minutes' },
  ])
}
