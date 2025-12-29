export function up(knex) {
  return knex.schema.createTable('prompts', (table) => {
    table.increments('id').primary()
    table.integer('scenario_id').notNullable().references('id')
    table.integer('mood_id').notNullable().references('id')
    table.text('prompt').notNullable()
  })
}

export async function down(knex) {
  return knex.schema.dropTable('prompts')
}
