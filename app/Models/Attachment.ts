import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Listing from './Listing'

export default class Attachment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public filename: string

  @column()
  public path: string

  @column()
  public uri_path:string

  @column()
  public type: string

  @column()
  public listing_id:number

  @column()
  public message_id:number

  @column()
  public uploaded_by: number

  // @column()
  // public user_id:number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(()=> User, {foreignKey: "user_id", localKey: "uploaded_by"})
  public user:BelongsTo<typeof User>

  @belongsTo(()=> Listing, {foreignKey:"listing_id"})
  public listing: BelongsTo<typeof Listing>
}
