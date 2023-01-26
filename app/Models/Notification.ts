import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Listing from './Listing'
import Bid from './Bid'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public message:string

  @column()
  public notification_user_id:number

  @column()
  public notification_type:string

  @column()
  public listing_id:number

  @column()
  public bid_id:number

  @column()
  public user_id:number

  @column()
  public is_read:boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(()=> User, {foreignKey: "user_id", localKey:'notification_user_id'})
  public user_involvement:BelongsTo<typeof User>

  @belongsTo(()=> Listing, {foreignKey:'listing_id'})
  public listing:BelongsTo<typeof Listing>

  @belongsTo(()=> Bid, {foreignKey:'listing_id'})
  public bid:BelongsTo<typeof Bid>
}
