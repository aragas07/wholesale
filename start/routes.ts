/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import UsersController from 'App/Controllers/Http/UsersController'

Route.get('/', async () => {
  return { hello: 'Argie' }
})

Route.post('/login', 'UsersController.login').middleware('base64')
Route.post('/register', 'UsersController.register').middleware('base64')
Route.get('/notifications/get', 'UsersController.getNotifications').middleware('auth')
Route.put('/notifications/read/:id', 'UsersController.readNotification').middleware('auth')
Route.group(()=>{
  Route.get('/mybids', 'BidController.getMyBids').middleware('auth')
  Route.post('/bid', 'BidController.bid').middleware('auth')
}).prefix('bids')


Route.get('/get/:id', 'UsersController.get').middleware('base64')
Route.group(()=>{
  Route.get(':id', 'UsersController.get')
}).prefix('users')

Route.group(()=>{
  Route.get('/users', 'UsersController.adminGetUsers')
  Route.get('/bids/:id', 'BidController.getBidsByListing').middleware('auth')
  Route.post('/action', 'ListingsController.actionListing')
  Route.get('/listings', 'ListingsController.getListingsAdmin').middleware('auth')
}).prefix('admin')


Route.group(()=> {
  Route.get('/', 'ListingsController.getListings')
  Route.get('/:id', 'ListingsController.getListing')
  Route.post('/create', 'ListingsController.createListing').middleware('auth')
  Route.put('/search', 'ListingsController.search')
  Route.get('/user/:id', 'UsersController.getUserWithListings').middleware('base64')
  Route.get('/:id/bids', 'BidController.getBidsByListing').middleware('auth')
}).prefix('listings')

// Route.group(()=> {
//   Route.get('/', 'ListingController.getListings')
//   Route.post('/create', 'ListingController.createListing')
//   Route.put('/search', 'ListingController.search')
// }).prefix('listings')