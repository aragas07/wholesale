import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bid_id:number

  @column()
  public conversation_topic:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
