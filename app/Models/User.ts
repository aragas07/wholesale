import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, BelongsTo, belongsTo, hasMany, HasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Attachment from './Attachment'
import Listing from './Listing'
import Bid from './Bid'
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public firstname : string                                                           

  @column()
  public middlename : string

  @column()
  public lastname : string

  @column()
  public phone_number : string

  @column()
  public company_address : string

  @column()
  public user_type : string

  @column()
  public address: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Attachment, {
    onQuery(query){
      query.where('uploaded_by', 'id')
    }
  })
  public profilePic: BelongsTo<typeof Attachment>

  @beforeSave()
  public static async hashPassword (Auth: User) {
    if (Auth.$dirty.password) {
      Auth.password = await Hash.make(Auth.password)
    }
  }

  @hasMany(()=> Listing, {foreignKey:'user_id'} )
  public listings:HasMany<typeof Listing>

  @hasOne(()=> Attachment, {foreignKey:'uploaded_by'})
  public profilepic:HasOne<typeof Attachment>

  @hasMany(()=> Bid, {foreignKey:"user-id", localKey:'id'})
  public bids:HasMany<typeof Bid>
}
