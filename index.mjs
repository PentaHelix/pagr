import express from 'express'

import { run, getPage } from './pagr.mjs'

const app = express()

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/*', (req, res) => {
  if (pages[req.path.substr(1)]) {
    res.send(getPage(req.path.substr(1)))
  } else {
    res.send('404')
  }
})

app.listen(3000, () => {
  run()
  console.log('pagr started')
})