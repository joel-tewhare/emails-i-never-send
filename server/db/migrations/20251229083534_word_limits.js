export function up(knex) {
  return knex.schema.createTable('word_limits', (table) => {
    table.increments('id').primary()
    table.integer('word_limit').notNullable()
  })
}

export async function down(knex) {
  return knex.schema.dropTable('word_limits')
}
