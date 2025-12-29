export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('auth_id').notNullable().unique()
    table.string('username').notNullable().unique()
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
  })
}

export async function down(knex) {
  return knex.schema.dropTable('users')
}
