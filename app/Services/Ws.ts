import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'
import log from './LogService'

class Ws {
  public io: Server
  private booted = false
  private Log = new log(this)

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(AdonisServer.instance!)
    this.Log.info("WS Server started")
  }
}

export default new Ws()