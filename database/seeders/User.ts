import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run () {
    await User.create({
      password: "1234",
      email: "zhakamizhako@gmail.com",
      firstname: "Zhakami",
      middlename: "Z",
      lastname: "Zhako",
      user_type: "ADMIN",
      phone_number: "+639232901913",
    })
    await User.create({
      password: "1234",
      email: "test_wholesaler",
      firstname: "Whole",
      middlename: "Z",
      lastname: "Saler",
      user_type: "WHOLESALER",
      phone_number: "+123456789",

    })
    await User.create({
      password: "1234",
      email: "test_customer",
      firstname: "Cus",
      middlename: "tom",
      lastname: "Er",
      user_type: "CUSTOMER",
      phone_number: "+123456789",

    })
  }
}
