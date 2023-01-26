import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.text("message")
      table.integer("notification_user_id").references("id").inTable("users")
      table.string("notification_type")
      table.integer("listing_id").references("id").inTable("listings")
      table.integer("bid_id").references("id").inTable("bids")
      table.integer("user_id").references("id").inTable("users")
      table.boolean("is_read").defaultTo(false)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
