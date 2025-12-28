export async function seed(knex) {
  await knex('scenarios').insert([
    { id: 1, description: 'Work' },
    { id: 2, description: 'Relationships' },
    { id: 3, description: 'Customer Service' },
    { id: 4, description: 'Emotional Honesty' },
    { id: 5, description: 'Conflict Resolution' },
  ])
}
