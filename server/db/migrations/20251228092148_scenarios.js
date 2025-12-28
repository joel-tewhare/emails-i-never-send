export function up(knex) {
  return knex.schema.createTable('scenarios', (table) => {
    table.increments('id').primary()
    table.string('description').notNullable()
  })
}

export async function down(knex) {
  return knex.schema.dropTable('scenarios')
}
