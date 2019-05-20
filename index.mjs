import express from 'express'

import { run, getPage, getPageFile, getPageUrl, edit } from './pagr/index.mjs'
import fs from 'fs'
import path from 'path'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'

const app = express()

app.use(bodyParser.json())

app.use('/static', express.static('static'))

app.use(fileUpload())

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/admin/edit', (req, res) => {
  req.query.file = req.query.file.replace(/(\/|\.)/, '')
  
  fs.readdir('./static/img', (err, files) => {
    res.send(edit({
      _IMAGE_FILES_: JSON.stringify(files),
      _FILENAME_: req.query.file,
      _CONTENT_: getPageFile(req.query.file), 
      _URL_: getPageUrl(req.query.file)
    }))
  })
})

app.post('/admin/page', (req, res) => {
  req.query.file = req.query.file.replace(/(\/|\.)/, '')
  console.log(req.body)
  fs.writeFile('./pages/' + req.query.file + '.md', req.body.content, (err) => {
    res.sendStatus(err ? 400 : 200)
  })
})

app.post('/admin/upload', (req, res) => {
  req.files.file.mv('./static/img/' + req.files.file.name, (err) => {
    res.sendStatus(err ? 500 : 201)
  })
})

// app.post('/auth', (req, res) => {

// })

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