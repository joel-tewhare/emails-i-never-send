export async function seed(knex) {
  await knex('users').insert([
    {
      id: 1,
      auth_id: 'auth0|f83bd9a2c1e54723a4d29f01',
      username: 'riverstone',
      first_name: 'River',
      last_name: 'Stone',
    },
    {
      id: 2,
      auth_id: 'auth0|a7c291e88baf4d5fa0f91dc3',
      username: 'lunaletters',
      first_name: 'Luna',
      last_name: 'Harrington',
    },
    {
      id: 3,
      auth_id: 'auth0|c12eef04873a4c1b9e52af77',
      username: 'mosswriter',
      first_name: 'Elliot',
      last_name: 'Moss',
    },
  ])
}
