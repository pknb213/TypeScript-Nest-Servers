import express, { Request, Response, NextFunction } from 'express';

class App {
  public app: express.Application
  public port: number

  constructor() {
    this.app = express()
    this.port = 1234
    this.testUrl()
    this.listen()
  }

  public testUrl() {
    this.app.get('/', (req, res) => {
      // res.send('welcome!')
      res.sendStatus(200)
    })
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`
        ################################################
        🛡️  Server listening on port: ${this.port}🛡️
        ################################################
    ` )
    })
  }
}

export default new App()