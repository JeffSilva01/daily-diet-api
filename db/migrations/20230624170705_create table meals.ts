import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').notNullable()
    table.uuid('user_id').references('id').inTable('users').index()
    table.text('name')
    table.text('description')
    table.timestamp('date')
    table.boolean('is_diet').defaultTo(false)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
