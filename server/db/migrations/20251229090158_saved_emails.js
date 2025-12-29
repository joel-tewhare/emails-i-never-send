export function up(knex) {
  return knex.schema.createTable('saved_emails', (table) => {
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('users.id')
    table.integer('prompt_id').notNullable().references('prompts.id')
    table.text('content').notNullable()
    table.timestamp('created_at').notNullable()
  })
}

export async function down(knex) {
  return knex.schema.dropTable('saved_emails')
}
