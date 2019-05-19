import express from 'express'

import { run, getPage } from './pagr.mjs'

const app = express()

app.use('/static', express.static('static'));

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/*', (req, res) => {
  try {
    res.send(getPage(req.path.substr(1)))
  } catch (err) {
    res.sendStatus(404)
  }
})

app.listen(3000, () => {
  run()
  console.log('pagr started')
})