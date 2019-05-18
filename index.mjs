import express from 'express'

import { run, pages } from './pagr.mjs'

const app = express()

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/*', (req, res) => {
  if (pages[req.path.substr(1)]) {
    res.send(pages[req.path.substr(1)].html)
  } else {
    res.send('404')
  }
})

app.listen(3000, () => {
  run()
  console.log('pagr started')
})