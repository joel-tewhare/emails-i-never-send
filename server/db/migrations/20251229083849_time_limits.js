export function up(knex) {
  return knex.schema.createTable('time_limits', (table) => {
    table.increments('id').primary()
    table.string('time_limit').notNullable()
  })
}

export async function down(knex) {
  return knex.schema.dropTable('time_limits')
}
