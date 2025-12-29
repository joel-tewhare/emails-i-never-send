export function up(knex) {
  return knex.schema.createTable('moods', (table) => {
    table.increments('id').primary()
    table.string('mood').notNullable()
  })
}

export async function down(knex) {
  return knex.schema.dropTable('moods')
}
