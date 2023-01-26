import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'attachments'
  protected tableAlter = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */

      table.string('filename')
      table.text('path')
      table.text('uri_path')
      table.string('type') // - image, file, etc.

      table.integer('uploaded_by').unsigned().references('id').inTable('users')

      table.integer("message_id").references("id").inTable("messages");
      table.integer("listing_id").references("id").inTable("listings");

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.schema.alterTable(this.tableAlter, (table) => {
      table.integer('profile_pic').unsigned().references('id').inTable('attachments')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableAlter, table => {
      table.dropColumn('profile_pic')
    })
    this.schema.dropTable(this.tableName)
  }
}
