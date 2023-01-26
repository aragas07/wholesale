import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Listing from './Listing'
import User from './User'

export default class Bid extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id:number

  @column()
  public listing_id:number

  @column()
  public value:number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(()=> Listing, {foreignKey:'listing_id'} )
  public listing:BelongsTo<typeof Listing>  

  @belongsTo(()=> User, {foreignKey:'user_id'} )
  public user:BelongsTo<typeof User>  
}
