import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bids'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.integer("user_id").references("id").inTable("users")
      table.integer("listing_id").references("id").inTable("listings")
      table.double("value")
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
