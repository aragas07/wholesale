import { DateTime } from 'luxon'
import { afterCreate, BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Bid from './Bid'
import Attachment from './Attachment'
import NotificationService from 'App/Services/NotificationService'

export default class Listing extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public address:string

  @column()
  public make_of_vehicle:string

  @column()
  public year_of_vehicle:string

  @column()
  public model:string

  @column()
  public trim:string

  @column()
  public mileage:string
  
  @column()
  public vin_number:string

  @column()
  public user_id:number

  @column()
  public is_archived:boolean

  @column()
  public has_ended:boolean

  @column()
  public hidden:boolean

  @column()
  public status:string

  @column()
  public disclaimers:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(()=> User, {foreignKey:'user_id'})
  public user:BelongsTo<typeof User>

  @hasMany(()=> Bid, {foreignKey:"listing_id", localKey:'id'})
  public bids:HasMany<typeof Bid>

  @hasMany(()=> Attachment, {foreignKey:"listing_id", localKey:'id'})
  public attachments:HasMany<typeof Attachment>

  @hasOne(()=> Attachment, {foreignKey:"listing_id", localKey:'id'})
  public cover:HasOne<typeof Attachment>

  @afterCreate()
  public static async NotifyAdmin(listing: Listing){
    
  }
}
