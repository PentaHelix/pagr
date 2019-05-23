const express = require('express')
const pagr = require('./pagr/index.js')
const fs = require('fs')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/static', express.static('static'))

app.use(fileUpload())

app.post('/admin/*', (req, res, next) => {
  if (req.cookies['password'] == 'QAM8Pa<ke^9k') {
    next()
  } else {
    res.sendStatus(401)
  }
})

app.get('/admin/create', (req, res) => {
  fs.readdir('./static/img', (_, files) => {
    res.send(pagr.edit({
      _IMAGE_FILES_: JSON.stringify(files),
      _CONTENT_: '', 
      _URL_: '',
      _CREATING_: true
    }))
  })
})

app.get('/admin/edit', (req, res) => {
  req.query.file = req.query.file.replace(/(\/|\.)/, '')
  
  fs.readdir('./static/img', (_, files) => {
    res.send(pagr.edit({
      _IMAGE_FILES_: JSON.stringify(files),
      _FILENAME_: req.query.file,
      _CONTENT_: pagr.getPageFile(req.query.file), 
      _URL_: pagr.getPageUrl(req.query.file)
    }))
  })
})

app.post('/admin/page', (req, res) => {
  req.query.file = req.query.file.replace(/(\/|\.)/, '')
  fs.writeFile('./pages/' + req.query.file + '.md', req.body.content, (err) => {
    res.sendStatus(err ? 400 : 200)
  })
})


app.put('/admin/page', (req, res) => {
  req.query.file = req.query.file.replace(/(\/|\.)/, '')
  fs.writeFile('./pages/' + req.query.file + '.md', req.body.content, (err) => {
    res.sendStatus(err ? 400 : 200)
  })
})

app.post('/admin/upload', (req, res) => {
  req.files.file.mv('./static/img/' + req.files.file.name, (err) => {
    res.sendStatus(err ? 500 : 201)
  })
})

app.get('/*', (req, res) => {
  try {
    res.send(pagr.getPage(req.path.substr(1)))
  } catch (err) {
    res.sendStatus(404)
  }
})


app.listen(3000, () => {
  pagr.run()
  console.log('pagr started')
})