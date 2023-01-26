import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'listings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('name')
      table.string('description')
      table.string('address')
      table.string('make_of_vehicle')
      table.string('year_of_vehicle')
      table.string('model')
      table.string('trim')
      table.string('mileage')

      table.string('vin_number')
      table.boolean('is_archived')
      table.boolean('has_ended').defaultTo(false)
      table.boolean('hidden').defaultTo(false)
      table.string('status')
      table.text('disclaimers')

      table.integer("user_id").references("id").inTable("users")
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
