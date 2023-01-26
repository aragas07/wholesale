import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ListingAccident extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public occurence:DateTime

  @column()
  public accident_entry:String


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
